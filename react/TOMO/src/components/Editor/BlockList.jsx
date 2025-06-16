import React from 'react';
import Block from './Block';

export default function BlockList({ blocks, focusId, onInsert, onDelete, onCommit, refs }) {
  return blocks.map((block, i) => (
    <div key={block.id} ref={el => (refs.current[block.id] = el )}>
      <Block
        block={block}
        autoFocus={block.id === focusId}
        onInsert={() => onInsert(i + 1)}
        onDelete={() => onDelete(block.id)}
        onCommit={(c) => onCommit(block.id, c)}
      />
    </div>
  ));
};