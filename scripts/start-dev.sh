#!/bin/bash

# Exit on error
set -e

# Start the backend server
echo "Starting backend server..."
cd $(dirname "$0")/../
# Use poetry run instead of activating the virtual environment
cd backend
poetry run uvicorn app:app --reload --port 8000 &
BACKEND_PID=$!

# Start the frontend server
echo "Starting frontend server..."
cd ..
npm start &
FRONTEND_PID=$!

# Function to handle cleanup on exit
cleanup() {
  echo "Shutting down servers..."
  kill $BACKEND_PID $FRONTEND_PID
  exit 0
}

# Set up trap
trap cleanup SIGINT SIGTERM

# Wait for user to cancel
echo "Development servers running. Press Ctrl+C to stop."
wait