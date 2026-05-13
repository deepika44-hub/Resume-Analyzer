import PyPDF2
import io


def extract_text_from_pdf(file_bytes: bytes) -> str:
    reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
    text_parts = []
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text_parts.append(page_text.strip())
    full_text = "\n\n".join(text_parts)
    if not full_text.strip():
        raise ValueError(
            "Could not extract text from PDF. The file may be scanned or image-based."
        )
    return full_text