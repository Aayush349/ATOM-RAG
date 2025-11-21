import fitz  # PyMuPDF
import os

def process_pdf(file_path):
    try:
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text if text else "No text extracted."
    except Exception as e:
        return f"Failed to process PDF: {str(e)}"
