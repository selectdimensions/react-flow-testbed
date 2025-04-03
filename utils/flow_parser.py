"""
Shared utility for parsing and validating flow data between frontend and backend
"""
from typing import Dict, Any, List

def parse_flow(flow_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Parse and validate flow data
    
    Args:
        flow_data: The flow data to parse
        
    Returns:
        The validated flow data
        
    Raises:
        ValueError: If the flow data is invalid
    """
    # Check if flow has required components
    if not isinstance(flow_data, dict):
        raise ValueError("Flow data must be a dictionary")
    
    if "nodes" not in flow_data or not isinstance(flow_data["nodes"], list):
        raise ValueError("Flow must have a 'nodes' list")
    
    if "edges" not in flow_data or not isinstance(flow_data["edges"], list):
        raise ValueError("Flow must have an 'edges' list")
    
    # Validate nodes
    validate_nodes(flow_data["nodes"])
    
    # Validate edges
    validate_edges(flow_data["edges"], flow_data["nodes"])
    
    return flow_data

def validate_nodes(nodes: List[Dict[str, Any]]) -> None:
    """
    Validate node data
    
    Args:
        nodes: The nodes to validate
        
    Raises:
        ValueError: If any node is invalid
    """
    node_ids = set()
    
    for i, node in enumerate(nodes):
        # Check required fields
        if "id" not in node:
            raise ValueError(f"Node at index {i} is missing an 'id'")
        
        if "data" not in node or not isinstance(node["data"], dict):
            raise ValueError(f"Node at index {i} is missing 'data' or it's not a dictionary")
        
        if "position" not in node or not isinstance(node["position"], dict):
            raise ValueError(f"Node at index {i} is missing 'position' or it's not a dictionary")
        
        # Check for duplicate IDs
        if node["id"] in node_ids:
            raise ValueError(f"Duplicate node ID: {node['id']}")
        
        node_ids.add(node["id"])

def validate_edges(edges: List[Dict[str, Any]], nodes: List[Dict[str, Any]]) -> None:
    """
    Validate edge data
    
    Args:
        edges: The edges to validate
        nodes: The nodes to validate against
        
    Raises:
        ValueError: If any edge is invalid
    """
    edge_ids = set()
    node_ids = {node["id"] for node in nodes}
    
    for i, edge in enumerate(edges):
        # Check required fields
        if "id" not in edge:
            raise ValueError(f"Edge at index {i} is missing an 'id'")
        
        if "source" not in edge:
            raise ValueError(f"Edge at index {i} is missing a 'source'")
        
        if "target" not in edge:
            raise ValueError(f"Edge at index {i} is missing a 'target'")
        
        # Check for duplicate IDs
        if edge["id"] in edge_ids:
            raise ValueError(f"Duplicate edge ID: {edge['id']}")
        
        edge_ids.add(edge["id"])
        
        # Check if source and target nodes exist
        if edge["source"] not in node_ids:
            raise ValueError(f"Edge {edge['id']} references non-existent source node: {edge['source']}")
        
        if edge["target"] not in node_ids:
            raise ValueError(f"Edge {edge['id']} references non-existent target node: {edge['target']}")