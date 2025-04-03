from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn
import json
import os
from database import get_db, Flow

app = FastAPI(title="React Flow API")

# Add CORS middleware to allow cross-origin requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace with specific origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class FlowData(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    viewport: Optional[Dict[str, Any]] = None

# Routes
@app.get("/")
def read_root():
    return {"message": "React Flow API is running"}

@app.post("/flows")
def create_flow(flow: Dict[str, Any]):
    """Save a flow to the database"""
    db = get_db()
    
    # Parse flow data
    try:
        # Validate with our shared parser
        from utils.flow_parser import parse_flow
        parsed_flow = parse_flow(flow)
        
        # Create new flow record
        flow_record = Flow(data=json.dumps(parsed_flow))
        db.add(flow_record)
        db.commit()
        db.refresh(flow_record)
        
        return {"id": flow_record.id, "message": "Flow saved successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to save flow: {str(e)}")

@app.get("/flows/{flow_id}")
def read_flow(flow_id: str):
    """Get a flow by ID or 'latest'"""
    db = get_db()
    
    try:
        if flow_id == "latest":
            # Get the most recent flow
            flow_record = db.query(Flow).order_by(Flow.created_at.desc()).first()
        else:
            # Get specific flow by ID
            flow_record = db.query(Flow).filter(Flow.id == flow_id).first()
        
        if not flow_record:
            raise HTTPException(status_code=404, detail="Flow not found")
        
        return json.loads(flow_record.data)
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to load flow: {str(e)}")

@app.get("/flows")
def list_flows():
    """List all available flows"""
    db = get_db()
    
    try:
        flows = db.query(Flow).order_by(Flow.created_at.desc()).all()
        return [{"id": flow.id, "created_at": flow.created_at} for flow in flows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list flows: {str(e)}")

@app.delete("/flows/{flow_id}")
def delete_flow(flow_id: str):
    """Delete a flow by ID"""
    db = get_db()
    
    try:
        flow = db.query(Flow).filter(Flow.id == flow_id).first()
        if not flow:
            raise HTTPException(status_code=404, detail="Flow not found")
        
        db.delete(flow)
        db.commit()
        return {"message": "Flow deleted successfully"}
    except Exception as e:
        db.rollback()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to delete flow: {str(e)}")

if __name__ == "__main__":
    # Run the API server when script is executed directly
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
