import React, { useState, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import BlockList from './BlockList';
import { initialBlocks } from '../utils/contents';

export default function NotionStyleEditor() {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [focusBlockId, setFocusBlockId] = useState(initialBlocks[0].id);
  const containerRef = useRef(null);
  const blockRefs = useRef({}); // ← 여기 추가!

  const insertBlockAt = useCallback(idx => {
    const newId = uuidv4();
    const newBlock = {
      id: newId,
      type: 'paragraph',
      content: [{ type: 'paragraph', children: [{ text: '' }] }],
    };
    setBlocks(prev => {
      const arr = [...prev];
      arr.splice(idx, 0, newBlock);
      return arr;
    });
    setFocusBlockId(newId);
  }, []);

  const deleteBlock = useCallback(id => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  }, []);

  const commitBlock = useCallback((id, content) => {
    setBlocks(prev => prev.map(b => (b.id === id ? { ...b, content } : b)));
  }, []);

  const handleContainerClick = useCallback(e => {
    if (e.target !== containerRef.current) return;
    insertBlockAt(blocks.length); // 빈 공간 클릭시 마지막 뒤에 추가
  }, [blocks.length, insertBlockAt]);

  return (
    <div ref={containerRef} onClick={handleContainerClick} style={{ minHeight: '100vh' }}>
      <BlockList
        blocks={blocks}
        focusId={focusBlockId}
        onInsert={insertBlockAt}
        onDelete={deleteBlock}
        onCommit={commitBlock}
        blockRefs={blockRefs} 
      />
    </div>
  );
}
