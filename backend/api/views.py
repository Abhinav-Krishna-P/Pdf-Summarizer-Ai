import os
import fitz  # PyMuPDF for PDF text extraction
import requests
from dotenv import load_dotenv
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from .models import PDFUpload
from .serializers import PDFUploadSerializer

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent"

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_pdf(request):
    print("Received request to upload PDF")
    
    file = request.FILES.get('file')
    char_limit = request.data.get("char_limit", 200)  # Default: 200 characters
    print(f" Requested Summary Length: {char_limit} characters")

    if not file:
        print(" No file received")
        return Response({"error": "No file uploaded"}, status=400)

    if not file.name.endswith(".pdf"):
        print(" Invalid file format")
        return Response({"error": "Invalid file format"}, status=400)

    try:
        # Save the uploaded file
        pdf_instance = PDFUpload(file=file)
        pdf_instance.save()
        print(" File saved:", pdf_instance.file.url)

        # Extract text from the PDF
        with fitz.open(pdf_instance.file.path) as doc:
            extracted_text = "\n".join([page.get_text() for page in doc])

        pdf_instance.extracted_text = extracted_text
        pdf_instance.save()
        print(" Extracted text from PDF")

        #  Corrected JSON Format for Gemini API
        request_data = {
            "contents": [{"parts": [{"text": extracted_text}]}],
            "safetySettings": [],
            "generationConfig": {
                "temperature": 0.7,
                "topP": 1,
                "maxOutputTokens": int(char_limit)  # 🆕 Limit response length
            }
        }

        # Send request to Gemini API
        response = requests.post(
            f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
            json=request_data,
            headers={"Content-Type": "application/json"}
        )

        if response.status_code == 200:
            response_json = response.json()
            summary = response_json["candidates"][0]["content"]["parts"][0]["text"]

            # Save the summary in the database
            pdf_instance.summary = summary
            pdf_instance.save()
            print(" Summarization successful")

            serializer = PDFUploadSerializer(pdf_instance)
            return Response(serializer.data)

        print(" Summarization API failed:", response.text)
        return Response({"error": "Summarization failed"}, status=500)

    except Exception as e:
        print(" Unexpected error:", str(e))
        return Response({"error": str(e)}, status=500)
