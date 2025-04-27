# chatbot.py

import spacy
from models import User

# Load the spaCy model (make sure you have downloaded the correct model in your environment)
nlp = spacy.load("en_core_web_trf")  # Transformer-based model for better performance

def get_chatbot_response(user_message):
    # Process the user message using spaCy
    doc = nlp(user_message)

    # Example: Look for a user's name in the message
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            user_name = ent.text
            user = User.query.filter_by(name=user_name).first()  # Query database for the user by name
            if user:
                return f"The email of {user_name} is {user.email}."
            else:
                return f"No user found with the name {user_name}."
    
    # If no entities are matched, fallback response
    return "I am processing your query."
