import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes } from './NodeRegistry';
import { validateFlow } from '../utils/flowValidator';
import { saveFlow, loadFlow } from '../utils/api'; // Adjust the import path as necessary

const initialNodes = [
  {
    id: '1',
    type: 'customNode',
    data: { label: 'Frontend Entry Point', type: 'frontend' },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    type: 'customNode',
    data: { label: 'Backend Entry Point', type: 'backend' },
    position: { x: 250, y: 200 },
  },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

function BasicFlow() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'customNode',
        position,
        data: { label: `${type} node`, type },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      const isValid = validateFlow(flow);
      
      if (isValid) {
        saveFlow(flow)
          .then(response => {
            console.log('Flow saved successfully', response);
            alert('Flow saved successfully!');
          })
          .catch(error => {
            console.error('Error saving flow:', error);
            alert('Error saving flow!');
          });
      } else {
        alert('Flow validation failed! Please check your flow structure.');
      }
    }
  }, [reactFlowInstance]);

  const onLoad = useCallback(() => {
    loadFlow()
      .then(({ data }) => {
        if (data) {
          const { nodes: flowNodes, edges: flowEdges } = data;
          setNodes(flowNodes || []);
          setEdges(flowEdges || []);
          alert('Flow loaded successfully!');
        }
      })
      .catch(error => {
        console.error('Error loading flow:', error);
        alert('Error loading flow!');
      });
  }, [setNodes, setEdges]);

  return (
    <div className="dndflow" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
        <Panel position="top-right">
          <button onClick={onSave}>Save</button>
          <button onClick={onLoad}>Load</button>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default BasicFlow;