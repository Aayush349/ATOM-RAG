# --- rag_logic/processor.py ---
from rag_logic.embedder import get_embedding
from rag_logic.vector_store import search_index, build_index
from rag_logic.utils.file_reader import read_file_chunks
import os
import openai

openai.api_key = os.getenv("OPENROUTER_API_KEY")
openai.api_base = "https://openrouter.ai/api/v1"

# Called during /upload
'''
def process_document(file_path):
    chunks = read_file_chunks(file_path)
    embeddings = [get_embedding(chunk) for chunk in chunks]
    build_index(embeddings, chunks)
    return f"Document processed and indexed with {len(chunks)} chunks."
    '''

def process_document(file_path):
    chunks = read_file_chunks(file_path)
    print(f"Read {len(chunks)} chunks from file.")

    embeddings = [get_embedding(chunk) for chunk in chunks]
    print("Embeddings created.")

    build_index(embeddings, chunks)
    print("Index built.")

    return f"Document processed and indexed with {len(chunks)} chunks."


# Called during /chat

def answer_with_rag(prompt):
    query_embedding = get_embedding(prompt)
    similar_chunks = search_index(query_embedding)
    context = "\n".join(similar_chunks[:3])

    response = openai.ChatCompletion.create(
        model="qwen/qwen3-coder:free",
        messages=[
            {"role": "system", "content": "You are ATOM, a helpful assistant."},
            {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {prompt}"}
        ]
    )
    return response['choices'][0]['message']['content']
