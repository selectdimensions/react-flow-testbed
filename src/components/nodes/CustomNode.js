import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const nodeTypeStyles = {
  frontend: {
    backgroundColor: '#D4F1F9',
    borderColor: '#05445E',
  },
  backend: {
    backgroundColor: '#FFE6E6',
    borderColor: '#800000',
  },
  shared: {
    backgroundColor: '#FFF2CC',
    borderColor: '#9C6500',
  },
  config: {
    backgroundColor: '#E6F5D0',
    borderColor: '#2E6E00',
  },
  docker: {
    backgroundColor: '#E1D5E7',
    borderColor: '#6C0099',
  },
  deployment: {
    backgroundColor: '#FFCCFF',
    borderColor: '#990099',
  },
  util: {
    backgroundColor: '#DAE8FC',
    borderColor: '#0050EF',
  },
};

function CustomNode({ data }) {
  const nodeStyle = nodeTypeStyles[data.type] || nodeTypeStyles.util;

  return (
    <div
      style={{
        padding: '10px',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderRadius: '5px',
        borderColor: nodeStyle.borderColor,
        backgroundColor: nodeStyle.backgroundColor,
        textAlign: 'center',
        minWidth: '150px',
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div>
        <strong>{data.label}</strong>
      </div>
      {data.description && <div>{data.description}</div>}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default memo(CustomNode);