// BlockEditor.jsx
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { createEditor, Editor, Range } from 'slate';
import { v4 as uuidv4 } from 'uuid';
import { Bold, Italic, Underline } from 'lucide-react';

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

export default function BlockEditor() {
  const [blocks, setBlocks] = useState(initialBlocks);
  // 어느 블록에 자동 포커스할지 관리
  const [focusBlockId, setFocusBlockId] = useState(initialBlocks[0].id);

  // Enter 입력 시 새 블록 생성 + 포커스 이동
  const handleKeyDown = useCallback((e, blockId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newId = uuidv4();
      const newBlock = {
        id: newId,
        type: 'paragraph',
        content: [
          {
            type: 'paragraph',
            children: [{ text: '' }],
          },
        ],
      };
      // 블록 배열에 새 블록 삽입
      setBlocks(prev => {
        const idx = prev.findIndex(b => b.id === blockId);
        const arr = [...prev];
        arr.splice(idx + 1, 0, newBlock);
        return arr;
      });
      // 생성된 블록으로 포커스 이동
      setFocusBlockId(newId);
    }
  }, []);

  // 블록 내용 커밋
  const updateBlockContent = useCallback((blockId, newContent) => {
    if (!Array.isArray(newContent)) return;
    setBlocks(prev =>
      prev.map(b => (b.id === blockId ? { ...b, content: newContent } : b))
    );
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      {blocks.map(block => (
        <Block
          key={block.id}
          block={block}
          autoFocus={block.id === focusBlockId}
          onKeyDown={e => handleKeyDown(e, block.id)}
          onCommit={val => updateBlockContent(block.id, val)}
        />
      ))}
    </div>
  );
}

function Block({ block, onKeyDown, onCommit, autoFocus }) {
  const editor = useMemo(() => withReact(createEditor()), []);
  const refContent = useRef(block.content);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0 });

  const renderElement = useCallback(
    props => <p {...props.attributes}>{props.children}</p>,
    []
  );
  const renderLeaf = useCallback(
    props => <span {...props.attributes}>{props.children}</span>,
    []
  );

  const handleChange = useCallback(newVal => {
    refContent.current = newVal;
  }, []);

  const updateToolbar = useCallback(() => {
    const { selection } = editor;
    if (selection && Range.isExpanded(selection)) {
      try {
        const domRange = ReactEditor.toDOMRange(editor, selection);
        const rect = domRange.getBoundingClientRect();
        setToolbarPos({
          top: rect.top + window.scrollY - 45,
          left: rect.left + window.scrollX,
        });
        setShowToolbar(true);
      } catch {
        setShowToolbar(false);
      }
    } else {
      setShowToolbar(false);
    }
  }, [editor]);

  const handleBlur = useCallback(() => {
    onCommit(refContent.current);
  }, [onCommit]);

  const isMarkActive = format => Editor.marks(editor)?.[format] === true;
  const toggleMark = format => {
    isMarkActive(format)
      ? Editor.removeMark(editor, format)
      : Editor.addMark(editor, format, true);
  };

  return (
    <div style={{ position: 'relative', marginBottom: '1rem' }}>
      {showToolbar && (
        <div
          style={{
            position: 'absolute',
            top: toolbarPos.top,
            left: toolbarPos.left,
            display: 'flex',
            gap: '0.25rem',
            background: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1000,
          }}
        >
          <button
            onMouseDown={e => e.preventDefault()}
            onClick={() => toggleMark('bold')}
            style={{
              background: isMarkActive('bold') ? '#eee' : 'transparent',
              border: 'none',
              padding: 4,
              borderRadius: 3,
              cursor: 'pointer',
            }}
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            onMouseDown={e => e.preventDefault()}
            onClick={() => toggleMark('italic')}
            style={{
              background: isMarkActive('italic') ? '#eee' : 'transparent',
              border: 'none',
              padding: 4,
              borderRadius: 3,
              cursor: 'pointer',
            }}
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            onMouseDown={e => e.preventDefault()}
            onClick={() => toggleMark('underline')}
            style={{
              background: isMarkActive('underline') ? '#eee' : 'transparent',
              border: 'none',
              padding: 4,
              borderRadius: 3,
              cursor: 'pointer',
            }}
            title="Underline"
          >
            <Underline size={16} />
          </button>
        </div>
      )}

      <Slate editor={editor} initialValue={block.content} onChange={handleChange}>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={onKeyDown}
          onBlur={handleBlur}
          onMouseUp={updateToolbar}
          onKeyUp={updateToolbar}
          spellCheck
          autoFocus={autoFocus}
          style={{
            padding: '0.5rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            minHeight: '2rem',
          }}
        />
      </Slate>
    </div>
  );
}
