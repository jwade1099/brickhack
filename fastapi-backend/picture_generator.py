import os
from openai import OpenAI
from dotenv import load_dotenv


load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')
if not api_key:
    raise ValueError("No OpenAI API key found")

client = OpenAI(api_key=api_key)

def generate_picture(prompt: str = "professional headshot of a person, digital art style") -> str:
    """
    Generate a profile picture using DALL-E and return the URL
    """
    try:
        image_response = client.images.generate(
            model="dall-e-2",
            prompt=prompt,
            n=1,
            size="256x256"
        )
        return image_response.data[0].url
        
    except Exception as e:
        raise Exception(f"Failed to generate image: {str(e)}")
