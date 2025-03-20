from openai import AzureOpenAI
from dotenv import load_dotenv
import os
import json
load_dotenv()
version = "2024-10-21"
key = os.getenv("CHAT_KEY")
endpoint = os.getenv("CHAT_ENDPOINT")
client = AzureOpenAI(
    api_key=key,
    api_version=version,
    azure_endpoint=endpoint
)


def get_response(history):
    print(history)
    response = client.chat.completions.create(
        model="gpt-35-turbo",
        messages=history
    )

    return response.choices[0].message.content.strip()


def get_embeddings(description):
    client = AzureOpenAI(
        api_key=key,
        api_version=version,
        azure_endpoint=os.getenv("EMBEDDINGS_URL")
    )

    response = client.embeddings.create(
        input=description,
        model="text-embedding-ada-002"
    )
    return response
    # return [item.embedding for item in response.data]
