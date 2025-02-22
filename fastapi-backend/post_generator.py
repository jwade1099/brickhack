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

def generate_post(interests):
    """
    Generate a social media post based on a list of interests.
    
    Args:
        interests (list): List of strings representing user interests
        
    Returns:
        str: Generated post content
    """
    interests_str = ", ".join(interests)
    
    prompt = f"""Generate an engaging social media post related to one or more of these interests: {interests_str}.
    The post should be informative, engaging, and between 50-200 words. Include relevant hashtags at the end.
    Make it sound natural and conversational, not promotional."""

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful social media content creator."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
    
    except Exception as e:
        print(f"Error generating post: {str(e)}")
        return None

# Example usage:
if __name__ == "__main__":
    # Test the function
    sample_interests = ["photography", "travel", "food"]
    generated_post = generate_post(sample_interests)
    if generated_post:
        print("Generated Post:")
        print(generated_post)