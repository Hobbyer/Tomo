import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

// BlockEditor 컴포넌트 (에디터 디자인 및 기능 구현)
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

  // 블록 내용 업데이트 함수
  // 블록 ID와 새 내용을 받아서 해당 블록의 내용을 업데이트
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
  // Slate 에디터 인스턴스
  const editor = useMemo(() => withReact(createEditor()), []);
  // 최신 컨텐츠를 저장할 ref
  const refContent = useRef(block.content);

  // 툴바 보임 여부 + 위치 상태
  const toolbarRef = useRef(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });

  // Slate 렌더링 함수들
  const renderElement = useCallback(
    (props) => <p {...props.attributes}>{props.children}</p>,
    []);
  const renderLeaf = useCallback(
    (props) => <span {...props.attributes}>{props.children}</span>,
    []
  );

  // 에디터 변경 시 호출
  const handleChange = useCallback((newValue) => {
    refContent.current = newValue;
  }, []);

  // 선택 영역 변화 시 툴바 위치 계산
  const updateToolbar = useCallback(() => {
   console.log('📣 updateToolbar() start — selection:', editor.selection);
   console.trace();  // 호출 스택을 보고 렌더 중에 들어온 건지, 이벤트 핸들러 중인지 확인
  const { selection } = editor;
  if (selection && Range.isExpanded(selection)) {
    try {
      const domRange = ReactEditor.toDOMRange(editor, selection);
      const rect = domRange.getBoundingClientRect();
      console.log('   → domRange rect:', rect);
      setToolbarPosition({
        top: rect.top + window.scrollY - 45,
        left: rect.left + window.scrollX,
      });
      console.log('   → setToolbarPosition & setShowToolbar(true)');
      setShowToolbar(true);
    } catch (err) {
      console.log('   → updateToolbar() caught error:', err);
      setShowToolbar(false);
    }
  } else {
    console.log('   → no selection → setShowToolbar(false)');
    setShowToolbar(false);
  }
}, [editor]);

  // 포커스 아웃되면 최종 커밋
  const handleBlur = useCallback(() => {
    if (typeof onCommit === 'function') {
      onCommit(refContent.current);
    }
  }, [onCommit]);

  // 마크 토글 헬퍼
  const isMarkActive = (format) => Editor.marks(editor)?.[format] === true;
  const toggleMark = (format) => {
    isMarkActive(format)
      ? Editor.removeMark(editor, format)
      : Editor.addMark(editor, format, true);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* 툴바 */}
      {showToolbar && (
        <div
          style={{
            position: 'absolute',
            top: `${toolbarPosition.top}px`,
            left: `${toolbarPosition.left}px`,
            display: 'flex',
            gap: '0.25rem',
            background: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1000,
          }}
        >
          {/* Bold 버튼 */}
          <button onMouseDown={e => e.preventDefault()} onClick={() => toggleMark('bold')}
                  style={{ background: isMarkActive('bold') ? '#eee' : 'transparent', border: 'none', padding: 4, borderRadius: 3, cursor: 'pointer' }}
                  title="Bold"><Bold size={16} /></button>

          {/* Italic 버튼 */}
          <button onMouseDown={e => e.preventDefault()} onClick={() => toggleMark('italic')}
                  style={{ background: isMarkActive('italic') ? '#eee' : 'transparent', border: 'none', padding: 4, borderRadius: 3, cursor: 'pointer' }}
                  title="Italic"><Italic size={16} /></button>

          {/* Underline 버튼 */}
          <button onMouseDown={e => e.preventDefault()} onClick={() => toggleMark('underline')}
                  style={{ background: isMarkActive('underline') ? '#eee' : 'transparent', border: 'none', padding: 4, borderRadius: 3, cursor: 'pointer' }}
                  title="Underline"><Underline size={16} /></button>
        </div>
      )}

      {/* Slate 에디터 */}
      <Slate editor={editor} initialValue={block.content} onChange={handleChange}>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={onKeyDown}
          onBlur={handleBlur}
          onMouseUp={updateToolbar}    // 드래그 후 마우스 뗄 때
          onKeyUp={updateToolbar}      // Shift+화살표 등 키로 선택 후
          placeholder="Type something..."
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
};

export default BlockEditor;
