# --- rag_logic/vector_store.py ---
import faiss
import numpy as np

index = None
stored_chunks = []

def build_index(embeddings, chunks):
    global index, stored_chunks
    dim = len(embeddings[0])
    index = faiss.IndexFlatL2(dim)
    index.add(np.array(embeddings))
    stored_chunks = chunks

def search_index(query_embedding, top_k=3):
    global index, stored_chunks
    if index is None:
        raise ValueError("Vector index is empty. Upload a document first.")
    query_vector = np.array([query_embedding])
    _, indices = index.search(query_vector, top_k)
    return [stored_chunks[i] for i in indices[0]]
