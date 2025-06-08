import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor } from 'slate';
import { v4 as uuidv4 } from 'uuid';

const initialBlocks = [
  {
    id: uuidv4(),
    type: 'paragraph',
    content: [
      {
        type: 'paragraph',
        children: [{ text: 'Welcome to your Notion-style editor!' }],
      },
    ],
  },
];

const BlockEditor = () => {
  const [blocks, setBlocks] = useState(initialBlocks);

  const handleKeyDown = useCallback((e, blockId) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const newBlock = {
        id: uuidv4(),
        type: 'paragraph',
        content: [
          {
            type: 'paragraph',
            children: [{ text: '' }],
          },
        ],
      };

      setBlocks((prevBlocks) => {
        const index = prevBlocks.findIndex((block) => block.id === blockId);
        const newBlocks = [...prevBlocks];
        newBlocks.splice(index + 1, 0, newBlock);
        return newBlocks;
      });
    }
  }, []);

  const updateBlockContent = useCallback((blockId, newContent) => {
    if (!Array.isArray(newContent)) return;

    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId ? { ...block, content: newContent } : block
      )
    );
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      {blocks.map((block, index) => (
        <Block
          key={block.id}
          block={block}
          onCommit={(val) => updateBlockContent(block.id, val)}
          onKeyDown={(e) => handleKeyDown(e, block.id)}
          autoFocus={index === 0}
        />
      ))}
    </div>
  );
};

const Block = ({ block, onCommit, onKeyDown, autoFocus }) => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const refContent = useRef(block.content);

  const renderElement = useCallback(
    (props) => <p {...props.attributes}>{props.children}</p>,
    []
  );

  const renderLeaf = useCallback(
    (props) => <span {...props.attributes}>{props.children}</span>,
    []
  );

  const handleChange = useCallback((newValue) => {
    refContent.current = newValue;
  }, []);

  const handleBlur = useCallback(() => {
    if (typeof onCommit === 'function') {
      onCommit(refContent.current);
    }
  }, [onCommit]);

  return (
    <Slate editor={editor} initialValue={block.content} onChange={handleChange}>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={onKeyDown}
        onBlur={handleBlur}
        placeholder="Type something..."
        spellCheck
        autoFocus={autoFocus}
        style={{
          marginBottom: '1rem',
          padding: '0.5rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      />
    </Slate>
  );
};

export default BlockEditor;
