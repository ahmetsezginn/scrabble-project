#!/bin/bash

# Function to handle cleanup
cleanup() {
    echo "Stopping processes..."
    if [ -n "$PYTHON_PID" ]; then
        kill $PYTHON_PID
    fi
    exit
}

# Trap SIGINT (Ctrl+C)
trap cleanup SIGINT

# Activate virtual environment
# Checks for .venv or venv, and Windows (Scripts) or Unix (bin) structure
if [ -d ".venv" ]; then
    if [ -f ".venv/Scripts/activate" ]; then
        source .venv/Scripts/activate
    elif [ -f ".venv/bin/activate" ]; then
        source .venv/bin/activate
    fi
elif [ -d "venv" ]; then
    if [ -f "venv/Scripts/activate" ]; then
        source venv/Scripts/activate
    elif [ -f "venv/bin/activate" ]; then
        source venv/bin/activate
    fi
else
    echo "Virtual environment (.venv or venv) not found."
    exit 1
fi

# Start Python backend
echo "Starting Python backend..."
# Add the api folder to PYTHONPATH so imports work correctly
export PYTHONPATH="${PYTHONPATH:+$PYTHONPATH:}./crossword_api-main"
python crossword_api-main/main.py &
PYTHON_PID=$!

# Start Node.js server
echo "Starting Node.js server..."
node server.js

# Wait for background processes (if node server.js exits, script continues to cleanup)
wait $PYTHON_PID
