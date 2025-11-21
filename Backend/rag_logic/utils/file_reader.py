import fitz  # PyMuPDF
import docx

def read_pdf(file_path):
    doc = fitz.open(file_path)
    return "\n".join(page.get_text() for page in doc)

def read_docx(file_path):
    doc = docx.Document(file_path)
    return "\n".join(para.text for para in doc.paragraphs)

def read_file_chunks(file_path, chunk_size=500):
    if file_path.endswith('.pdf'):
        text = read_pdf(file_path)
    elif file_path.endswith('.docx'):
        text = read_docx(file_path)
    else:
        with open(file_path, 'r', encoding='utf-8') as f:
            text = f.read()
    return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
