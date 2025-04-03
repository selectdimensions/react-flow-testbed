/**
 * Validates a flow structure
 * @param {Object} flow - The flow to validate
 * @returns {boolean} - Whether the flow is valid
 */
export const validateFlow = (flow) => {
    // Check if flow has nodes and edges
    if (!flow || !flow.nodes || !flow.edges) {
      console.error('Flow is missing nodes or edges');
      return false;
    }
  
    // Check if nodes have required properties
    const nodesValid = flow.nodes.every(node => {
      if (!node.id || !node.data) {
        console.error('Node is missing required properties', node);
        return false;
      }
      return true;
    });
  
    if (!nodesValid) {
      return false;
    }
  
    // Check if edges have required properties and reference existing nodes
    const nodeIds = new Set(flow.nodes.map(node => node.id));
    const edgesValid = flow.edges.every(edge => {
      if (!edge.id || !edge.source || !edge.target) {
        console.error('Edge is missing required properties', edge);
        return false;
      }
      
      if (!nodeIds.has(edge.source)) {
        console.error(`Edge references non-existent source node: ${edge.source}`, edge);
        return false;
      }
      
      if (!nodeIds.has(edge.target)) {
        console.error(`Edge references non-existent target node: ${edge.target}`, edge);
        return false;
      }
      
      return true;
    });
  
    return edgesValid;
  };