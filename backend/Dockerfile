FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all other backend files
COPY . .

# Run vector DB creation step to build FAISS index during the build phase
RUN python rag_utils.py

# Hugging Face Spaces run on port 7860
EXPOSE 7860

# Run uvicorn server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
