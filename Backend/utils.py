import os
import tempfile
from PyPDF2 import PdfReader
from docx import Document

DOCUMENT_TEXT = ""

def extract_text_from_file(file):
    global DOCUMENT_TEXT
    ext = os.path.splitext(file.filename)[1].lower()
    content = ""

    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as temp:
        file.save(temp.name)
        if ext == ".pdf":
            reader = PdfReader(temp.name)
            content = "\n".join(page.extract_text() for page in reader.pages if page.extract_text())
        elif ext == ".docx":
            doc = Document(temp.name)
            content = "\n".join(p.text for p in doc.paragraphs)
        elif ext == ".txt":
            with open(temp.name, "r", encoding="utf-8") as f:
                content = f.read()
        else:
            raise ValueError("Unsupported file format")

    DOCUMENT_TEXT = content
