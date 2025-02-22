import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize OpenAI client
api_key = os.getenv('OPENAI_API_KEY')
if not api_key:
    raise ValueError("No OpenAI API key found. Make sure OPENAI_API_KEY is set in your .env file")
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def test_completion():
    try:
        # Test chat completion
        chat_completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Hello! How are you?"}
            ]
        )
        print("Chat Completion Test:")
        print(f"Response: {chat_completion.choices[0].message.content}\n")
        
    except Exception as e:
        print(f"Chat Completion Error: {str(e)}\n")

def test_image_generation():
    try:
        # Test image generation
        image_response = client.images.generate(
            model="dall-e-",
            prompt="My friend jeff hitting a slam dunk",
            n=1,
            size="256x256"
        )
        print("Image Generation Test:")
        print(f"Image URL: {image_response.data[0].url}\n")
        
    except Exception as e:
        print(f"Image Generation Error: {str(e)}\n")

def main():
    print("Starting OpenAI API Tests...\n")
    
    # Test API key
    if not os.getenv('OPENAI_API_KEY'):
        print("Error: OPENAI_API_KEY not found in environment variables")
        return
    
    # Run tests
    test_completion()
    test_image_generation()
    
    print("API tests completed!")

if __name__ == "__main__":
    main()