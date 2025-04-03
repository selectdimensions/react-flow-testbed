# Multi-stage build for production

# Build frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files and build
COPY public/ ./public/
COPY src/ ./src/
RUN npm run build

# Build backend
FROM python:3.12-slim AS backend-build

# Install Poetry
RUN pip install poetry

# Copy Poetry configuration
WORKDIR /app
COPY pyproject.toml poetry.lock* ./

# Configure Poetry to not create a virtual environment
RUN poetry config virtualenvs.create false && \
    poetry install --no-dev

# Final image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Copy Python dependencies from backend-build
COPY --from=backend-build /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages

# Copy backend code
COPY backend/ /app/backend/
COPY utils/ /app/utils/

# Copy frontend build
COPY --from=frontend-build /app/build /app/static

# Copy environment variables
COPY .env ./

# Expose port
EXPOSE 8000

# Set environment variable for static files
ENV STATIC_FILES_DIR=/app/static

# Run server
CMD ["python", "-m", "uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "8000"]