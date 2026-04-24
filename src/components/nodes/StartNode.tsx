import type { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';

export default function StartNode(props: NodeProps) {
  return (
    <BaseNode
      {...props}
      icon="🚀"
      title="Start"
      color="rgba(16, 185, 129, 0.7)"
      borderColor="rgba(16, 185, 129, 0.6)"
      showTarget={false}
    />
  );
}
