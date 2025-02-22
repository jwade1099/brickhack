import os
from openai import OpenAI
from dotenv import load_dotenv


load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')
if not api_key:
    raise ValueError("No OpenAI API key found")

client = OpenAI(api_key=api_key)

def image_generation():
    try:
        # Test image generation
        image_response = client.images.generate(
            model="dall-e-2",
            prompt="My friend jeff hitting a slam dunk",
            n=1,
            size="256x256"
        )
        print("Image Generation Test:")
        print(f"Image URL: {image_response.data[0].url}\n")
        
    except Exception as e:
        print(f"Image Generation Error: {str(e)}\n")


def main():
    image_generation()

main()
