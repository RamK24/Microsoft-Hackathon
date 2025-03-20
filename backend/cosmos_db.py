from azure.cosmos import CosmosClient, exceptions, PartitionKey
from dotenv import load_dotenv
import os
load_dotenv()
url = os.getenv("DB_URL")
key = os.getenv("DB_KEY")
client = CosmosClient(url, credential=key)
DATABASE_NAME = 'Interactions'
CONTAINER_NAME = 'Conversations'
db = client.create_database_if_not_exists(DATABASE_NAME)
db = client.get_database_client(DATABASE_NAME)
container = db.create_container_if_not_exists(id=CONTAINER_NAME, partition_key=PartitionKey(path="/session_id"))
user_profile = db.create_container_if_not_exists(id='Profiles', partition_key=PartitionKey(path="/id"))


def upsert_conversation(session):
    success_count = 0
    failed_sessions = []
    print(session)
    try:
        container.upsert_item(session)
        success_count += 1
        print('*'*100)
        print('uploaded susccessfully')
    except exceptions.CosmosHttpResponseError as e:
        failed_sessions.append(session['session_id'])
        raise Exception(f"Failed to upload session {session['session_id']}: {e}")


def upsert_profile(profile):
    user_profile.upsert_item(profile)