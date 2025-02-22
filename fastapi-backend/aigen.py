import os
from openai import OpenAI
from dotenv import load_dotenv

# Load the environment variables
load_dotenv()

# Check if the API key is actually loaded
api_key = os.getenv('OPENAI_API_KEY')
if not api_key:
    raise ValueError("No OpenAI API key found. Make sure OPENAI_API_KEY is set in your .env file")

client = OpenAI(
    api_key=api_key
)

try:
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": "Say this is a test",
            }
        ],
        model="gpt-4",  # or "gpt-3.5-turbo"
    )
    print(chat_completion.choices[0].message.content)
except Exception as e:
    print(f"An error occurred: {str(e)}")