from fastapi import FastAPI, Body
import ast
from resume_creator import create_resume
from pydantic import BaseModel
from utils import generate_session_id, process_jobs
from assistant import get_response
from cosmos_db import upsert_conversation, upsert_profile, user_profile
from db import conn
from typing import Optional
from fastapi import HTTPException, status
from datetime import datetime, timedelta
import asyncio
import json

app = FastAPI()




class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None  # Frontend sends this after first message

class ChatSession(BaseModel):
    session_id: str
    role: str
    is_active: bool = True
    created_at: datetime = datetime.now()
    last_activity: datetime = datetime.now()
    messages: list = [{"role": "system", "content": f"""You are an empathetic and supportive assistant engaging in 
             natural conversation. Your primary goal is to provide a comforting and
             uplifting interaction while subtly gathering insights into his emotional state after work.
             Approach:

            Ease into conversations organically, discussing his work, interests, or routine to make him feel comfortable.
            Offer encouragement and validation, creating a safe space for him to express himself naturally.
            Pay close attention to his tone, word choices, and responses to infer his emotional state.
            Identify any specific events or interactions that may have influenced his mood without directly asking about his 
            feelings.
            Use your understanding to respond with empathy and, when appropriate, cheer him up with positive reinforcement,
            ensuring he feels heard and supported while 
            allowing his emotions to surface naturally. 
            Don't ask too many questions if you feel like the responses are not engaging.
            """},
                {"role": "assistant", "content": "Hey buddy, How are you today ?"}
                ]


class User(BaseModel):
    Name: str
    Role: str
    Skills: str
    WorkHistory: str


sessions: dict[str, ChatSession] = {}


@app.on_event("startup")
async def start_session_cleanup():
    asyncio.create_task(session_cleanup())


async def session_cleanup():
    while True:
        for session in list(sessions.values()):
            if (datetime.now() - session.last_activity).total_seconds() > 1 * 60 and session.is_active:
                session.is_active = False
                ct = ChatMessage(session_id=session.session_id, message='end')

                print(f"Session {session.session_id} ended due to inactivity.")
                await handle_employee_chat('2', ct)
        await asyncio.sleep(60)


@app.post("/employee-chat/{id}")
async def handle_employee_chat(id, message: ChatMessage):
    """Endpoint for employee conversations"""
    profile = user_profile.read_item(id, partition_key=id)
    if not message.session_id:
        session_id = generate_session_id()
        new_session = ChatSession(session_id=session_id, role="employee")
        sessions[session_id] = new_session
        session = new_session
    else:
        session = sessions.get(message.session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        if sessions.get(message.session_id) and not session.is_active:
            session.messages.append({'role': 'user', 'content': """ If the question: Please analyse the above conversation, 
            pick a mood from ['neutral', 'excited', 'anxious', 'frustrated', 'depressed']
            you return two things in JSON format like this 
        {   "mood": , "reason": <relevant reason from conversation>"""})
            response = get_response(session.messages)
            response = json.loads(response)
            sessions.clear()
            cursor = conn.cursor()
            cursor.execute("""
        INSERT INTO eMOTION (user_id, reason, emotion)
        VALUES (?, ?, ?)
    """, (int(id), response['reason'], response['mood']))
            conn.commit()
            print('inserted')
            return {
                "end": True,
                "status": "success",
                "message": "Received employee message",
                "response": response
            }
    session.messages[0]['content'] += f"{profile['name']} is a {profile['current_occupation']} with {profile['disability']}"
    session.last_activity = datetime.now()
    session.messages.append({"role": "user", "content": message.message})
    response = get_response(session.messages)
    session.messages.append({"role": "assistant", "content": response})
    return {
        "end": False,
        "status": "success",
        "session_id": session.session_id,
        "message": "Received employee message",
        "response": response
    }


@app.post('/login', status_code=status.HTTP_201_CREATED)
def create_user(user: User):
    prompt = [{'role': 'user', "content": f"summarise the below skills and work experience of an employee. "
                                           f"Here are the skill: {user.Skills} \n Here is the work experience: "
                                           f"{user.WorkHistory}"}]

    summary = get_response(prompt)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO Employees (Name, Role, Skills, summary, work_history)
        VALUES (?, ?, ?, ?, ?)
    """, (user.Name, user.Role, user.Skills, summary, user.WorkHistory))
    conn.commit()
    conn.commit()
    return {"data": user}


@app.post('/profile/{id}', status_code=status.HTTP_201_CREATED)
def create_profile(id, profile: dict = Body(...)):
    prompt = [{'role': 'user', "content": f"Provide a two to three line summary based on the below details for a resume."
                                          f"{profile['skills']} \n {profile['work_experience']} \n {profile['summary']}"}]
    summary = get_response(prompt)
    profile['summary'] = summary
    profile['id'] = id
    upsert_profile(profile)
    return {"status": 'success'}


@app.post('/suggest_edits/{id}')
def suggest_edits(jd, id):
    profile = user_profile.read_item(id, partition_key=id)
    prompt = [{'role': 'user', "content":
               f"Here's a Job description : {jd} "
               f"Here's a user profile in json format:  "
               f"{profile['skills']} \n {profile['work_experience']} \n {profile['summary']}"
               f"Your job is tailor the resume according to the Job description. make sure it is curated not very generic."
               f"you will return skills, work experience points and summary in the following format"
               f"[summary]*[skill1, skill2, skill3]*[[job1 point 1, job1 point 2], [job2 point1, job2 point2]]"}]

    response = get_response(prompt)
    summary, skills, jobs = response.split('*')
    profile['skills'] = ast.literal_eval(skills)
    profile['summary'] = summary[0]
    for idx, job in enumerate(profile['work_experience']):
        job['summary'] = jobs[idx]

    create_resume(profile)
    return {'status': 'success'}


@app.get('/recommended_jobs/{id}')
def get_relevant_jobs(id):
    profile = user_profile.read_item(id, partition_key=id)
    summary = profile['summary']
    # disability = profile['disability']
    results = process_jobs(summary, 'Waiter', 'Atlanta, GA', 'autism')
    return {'data': results}





