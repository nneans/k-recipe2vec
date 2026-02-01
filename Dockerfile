FROM python:3.9-slim

WORKDIR /code

# Copy backend files
COPY ./backend /code/backend

# Change working directory to backend
WORKDIR /code/backend

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Run the application
CMD ["uvicorn", "src.api:app", "--host", "0.0.0.0", "--port", "7860"]
