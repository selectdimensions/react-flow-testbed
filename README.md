# React Flow Testbed

A boilerplate project for creating React Flow applications with Python backend support using Poetry.

## Features

- React Flow for interactive node-based diagrams
- Poetry for Python dependency management
- FastAPI backend for data persistence
- Complete project structure for quick development
- Pre-configured with essential dependencies
- Docker support for development and production
- CI/CD pipeline with GitHub Actions

## Project Structure

```
react-flow-testbed/
├── .github/                            # GitHub-specific configurations
│   └── workflows/                      # GitHub Actions workflows
│       └── ci-cd.yml                   # CI/CD pipeline configuration
│
├── backend/                            # Python backend code
│   ├── app.py                          # FastAPI application entry point
│   └── database.py                     # Database configuration and models
│
├── public/                             # Static assets for React
│   ├── favicon.ico                     # Website favicon
│   ├── index.html                      # HTML template
│   └── manifest.json                   # Web app manifest
│
├── scripts/                            # Helper scripts
│   └── start-dev.sh                    # Script to start development environment
│
├── src/                                # React source code
│   ├── components/                     # React components
│   │   ├── nodes/                      # Custom node components
│   │   │   └── CustomNode.js           # Example custom node
│   │   ├── BasicFlow.js                # Basic React Flow implementation
│   │   └── NodeRegistry.js             # Node types registration
│   │
│   ├── utils/                          # Frontend utility functions
│   │   ├── api.js                      # API service for backend communication
│   │   └── flowValidator.js            # Flow validation utilities
│   │
│   ├── App.css                         # Main application styles
│   ├── App.js                          # Main application component
│   └── index.js                        # Application entry point
│
├── utils/                              # Shared utility functions
│   └── flow_parser.py                  # Python utility for parsing flows
│
├── .env                                # Environment variables
├── docker-compose.yml                  # Docker Compose configuration
├── Dockerfile                          # Production Docker configuration
├── Dockerfile.dev                      # Development Docker configuration
├── package.json                        # JavaScript project configuration
└── pyproject.toml                      # Python project configuration
```

## Prerequisites

- Node.js and npm
- Python 3.12+
- Poetry (Python package manager)
- Docker (optional, for containerized development)

## Installation

### Option 1: Standard Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/react-flow-testbed.git
   cd react-flow-testbed
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies using Poetry:
   ```bash
   poetry install
   poetry shell
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file to configure your environment.

### Option 2: Docker Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/react-flow-testbed.git
   cd react-flow-testbed
   ```

2. Build and start containers:
   ```bash
   docker-compose up -d dev
   ```

## Running the Application

### Running Locally

1. Start the backend server:
   ```bash
   # Make sure you're in the Poetry shell
   cd backend
   uvicorn app:app --reload --port 8000
   ```

2. In another terminal, start the frontend server:
   ```bash
   npm start
   ```

3. Alternatively, use the development script:
   ```bash
   # Make the script executable
   chmod +x scripts/start-dev.sh
   
   # Run the script
   ./scripts/start-dev.sh
   ```

4. Access the application at http://localhost:3000

### Running with Docker

```bash
# For development
docker-compose up dev

# For production
docker-compose up prod
```

## Using the React Flow Interface

1. The interface allows you to create, save, and load flow diagrams.
2. Drag nodes onto the canvas to create a flow.
3. Connect nodes by dragging from one handle to another.
4. Use the panel buttons to save your flow to the backend or load a previously saved flow.

## Custom Nodes

You can create custom node types by:

1. Creating a new component in the `src/components/nodes/` directory
2. Registering the node type in `src/components/NodeRegistry.js`

Example custom node:

```jsx
// In src/components/nodes/MyCustomNode.js
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

function MyCustomNode({ data }) {
  return (
    <div style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default memo(MyCustomNode);

// Then in src/components/NodeRegistry.js
import MyCustomNode from './nodes/MyCustomNode';

export const nodeTypes = {
  customNode: CustomNode,
  myCustomNode: MyCustomNode,
};
```

## API Endpoints

The backend provides the following endpoints:

- `GET /`: Check if the API is running
- `GET /flows`: List all saved flows
- `GET /flows/{flow_id}`: Get a specific flow (use "latest" for the most recent)
- `POST /flows`: Save a new flow
- `DELETE /flows/{flow_id}`: Delete a flow

## Deployment

### Manual Deployment

1. Build the React frontend:
   ```bash
   npm run build
   ```

2. Configure your production environment variables.

3. Start the backend server:
   ```bash
   cd backend
   uvicorn app:app --host 0.0.0.0 --port 8000
   ```

### Docker Deployment

```bash
# Build production image
docker build -t react-flow-testbed .

# Run container
docker run -p 8000:8000 react-flow-testbed
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.