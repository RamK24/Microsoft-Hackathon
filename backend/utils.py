import ast
from uuid import uuid4
from job_listings import get_google_listings
from assistant import get_embeddings, get_response
import torch


def generate_session_id() -> str:
    return str(uuid4())


def process_session(session):
    return {
        "id": session.session_id,
        "session_id": session.session_id,
        "role": session.role,
        "created_at": session.created_at.isoformat() + "Z",
        "last_activity": session.last_activity.isoformat() + "Z",
        "messages": session.messages
    }


def get_desc_str(highlights):
    desc = ''
    for info in highlights:
        if 'items' in info:
            desc += info['title'] + ': ' + '\n'.join(info['items']) + '\n\n'
    return desc


# def process_job(job_title, location):
#     jobs = get_google_listings(job_title, location)
#     desc_strs = [get_desc_str(job['job_highlights']) for job in jobs]
#     return desc_strs


def process_jobs(user_summary, job_title, location, disability):
    jobs = get_google_listings(job_title, location)
    desc_strs = [get_desc_str(job['job_highlights']) for job in jobs]
    embeddings_obj = get_embeddings(desc_strs)
    prompt = [{'role': 'user', 'content': f'Here is a person with disability {disability}. You will be give job'
                                          f'description in form of a list. review each job description and see if the user '
                                          f'can perform the described job. You will return all the jobs '
                                          f'user can the user perform with a reasonable accommodation in the form of list of indexes.'
                                          f'You will return just a list and no surrounding text just the list'
                                          f'use 0 based index.'
                                          f'eg: [1, 3, 5, 6]'}]
    response = get_response(prompt)
    relevant_jobs = ast.literal_eval(response)
    user_summary_embedding = torch.tensor(get_embeddings([user_summary]).data[0].embedding)
    embeddings = [item.embedding for item in embeddings_obj.data]
    embeddings = torch.tensor(embeddings)
    scores = (embeddings @ user_summary_embedding)
    for idx, job in enumerate(jobs):
        if idx not in relevant_jobs:
            jobs[idx]['user_sim_score'] = -1
        else:
            jobs[idx]['user_sim_score'] = scores[idx]
    return sorted(jobs, key=lambda x : x['user_sim_score'], reverse=True)


