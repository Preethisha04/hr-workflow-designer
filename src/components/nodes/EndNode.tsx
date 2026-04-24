import type { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';

export default function EndNode(props: NodeProps) {
  return (
    <BaseNode
      {...props}
      icon="🏁"
      title="End"
      color="rgba(244, 63, 94, 0.7)"
      borderColor="rgba(244, 63, 94, 0.5)"
      showSource={false}
    />
  );
}
