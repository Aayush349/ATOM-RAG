 Thrilled to share my first major project — a Retrieval-Augmented Generation (RAG) AI assistant, now live and working end-to-end! ⚙️🧠
💡 What it does:
 It takes user questions, searches a custom knowledge base, and uses a language model to generate factually grounded answers — kind of like a smart assistant that actually knows what it’s talking about 😉

 👉 Try it here: http://44.212.43.86:3000/
🔑 Key Features:
📄 Upload PDF documents and query them in natural language
🧠 Uses sentence-transformer embeddings + vector index search
💬 Chat powered by OpenRouter’s LLM API
🎤 Voice-enabled (Speech-to-Text) queries
⚛️ Frontend in React + Vite, backend in Flask
🐳 Fully containerized using Docker, hosted on AWS EC2



📌 Demo Notes:
⚠️ Use compact PDFs — large files may take longer to process
💸 This is a test deployment, API usage is limited — if it breaks, retry later
🎙️ Mic input might not work on some browsers due to the HTTP (non-secure) protocol

🔮 Future Improvements:
Support for multiple file formats (e.g. DOCX, TXT)
Improved UI/UX
Smarter voice command handling
Optimized vector storage & faster response times
