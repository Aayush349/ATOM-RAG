from sentence_transformers import SentenceTransformer
import logging

try:
    model = SentenceTransformer('all-MiniLM-L6-v2')
except Exception as e:
    logging.error(f"Failed to load embedding model: {e}")
    raise

def get_embedding(text):
    if isinstance(text, str):
        return model.encode([text])[0]  # wrap in list, then extract vector
    raise ValueError("Input to get_embedding must be a string.")
