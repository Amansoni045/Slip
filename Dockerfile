# Use the official Python image
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Install system dependencies (needed for some ML libraries)
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    software-properties-common \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy all files to the container
COPY . .

# Install Python dependencies
RUN pip3 install -r requirements.txt

# Expose the port Streamlit runs on (default 8501)
EXPOSE 8501

# Healthcheck to make sure the app is running
HEALTHCHECK CMD curl --fail http://localhost:8501/_stcore/health

# Command to run the app
ENTRYPOINT ["streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0"]
