// NotionStyleEditor.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Slate, Editable, withReact, ReactEditor, useSlate } from 'slate-react';
import {
  createEditor,
  Editor,
  Node,
  Range,
  Transforms,
  Element as SlateElement,
} from 'slate';
import Highlight, { defaultProps } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/github/index.js';
import hljs from 'highlight.js';
import { v4 as uuidv4 } from 'uuid';
import {
  Bold,
  Italic,
  Underline,
  Type as HeadingIcon,
  List as BulletedListIcon,
  ListOrdered,
  Quote,
  Code as CodeIcon,
} from 'lucide-react';

// 초기 빈 블록 한 개
const initialBlocks = [
  {
    id: uuidv4(),
    type: 'paragraph',
    content: [{ type: 'paragraph', children: [{ text: '' }] }],
  },
];

// 리스트 및 블록 토글 헬퍼
const LIST_TYPES = ['numbered-list', 'bulleted-list'];
function isBlockActive(editor, format) {
  const [match] = Editor.nodes(editor, {
    match: n =>
      SlateElement.isElement(n) &&
      n.type === (LIST_TYPES.includes(format) ? 'list-item' : format),
  });
  return !!match;
}
function toggleBlock(editor, format) {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);
  Transforms.unwrapNodes(editor, {
    match: n => SlateElement.isElement(n) && LIST_TYPES.includes(n.type),
    split: true,
  });
  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  });
  if (!isActive && isList) {
    Transforms.wrapNodes(editor, { type: format, children: [] });
  }
}

export default function NotionStyleEditor() {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [focusBlockId, setFocusBlockId] = useState(initialBlocks[0].id);
  const containerRef = useRef(null);
  const blockRefs = useRef({});

  // 특정 인덱스에 새 블록 삽입
  const insertBlockAt = useCallback(index => {
    const newId = uuidv4();
    const newBlock = {
      id: newId,
      type: 'paragraph',
      content: [{ type: 'paragraph', children: [{ text: '' }] }],
    };
    setBlocks(prev => {
      const arr = [...prev];
      arr.splice(index, 0, newBlock);
      return arr;
    });
    setFocusBlockId(newId);
  }, []);

  // 블록 삭제 및 포커스 재배치
  const deleteBlock = useCallback(blockId => {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === blockId);
      const newArr = prev.filter(b => b.id !== blockId);
      if (newArr.length) {
        setFocusBlockId(idx > 0 ? prev[idx - 1].id : newArr[0].id);
      }
      return newArr;
    });
  }, []);

  // 블록 내용 커밋
  const commitBlock = useCallback((id, content) => {
    setBlocks(prev =>
      prev.map(b => (b.id === id ? { ...b, content } : b))
    );
  }, []);

  // 빈 공간 클릭 시 새 블록 삽입
  const handleContainerClick = useCallback(
    e => {
      if (e.target !== containerRef.current) return;
      const y = e.clientY;
      const ids = blocks.map(b => b.id);
      const rects = ids.map(
        id => blockRefs.current[id]?.getBoundingClientRect() ?? { bottom: 0 }
      );
      let idx = rects.findIndex(r => y < r.bottom);
      if (idx === -1) idx = blocks.length;
      insertBlockAt(idx);
    },
    [blocks, insertBlockAt]
  );

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      style={{ minHeight: '100vh' }}
    >
      {blocks.map((block, i) => (
        <div key={block.id} ref={el => (blockRefs.current[block.id] = el)}>
          <Block
            block={block}
            autoFocus={block.id === focusBlockId}
            onInsert={() => insertBlockAt(i + 1)}
            onDelete={() => deleteBlock(block.id)}
            onCommit={c => commitBlock(block.id, c)}
          />
        </div>
      ))}
    </div>
  );
}

function Block({ block, autoFocus, onInsert, onDelete, onCommit }) {
  const editor = useMemo(() => withReact(createEditor()), []);
  const contentRef = useRef(block.content);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0 });

  // 엘리먼트 렌더러
  const renderElement = useCallback(props => {
    const { element, attributes, children } = props;
    switch (element.type) {
      case 'code': {
        const codeString = Node.string(element);
        const { language = 'javascript' } = hljs.highlightAuto(codeString);
        return (
          <Highlight
            {...defaultProps}
            code={codeString}
            language={language}
            theme={theme}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre className={className} style={style} {...attributes}>
                {tokens.map((line, i) => {
                  const lp = getLineProps({ line });
                  const { key: _k, ...rest } = lp;
                  return (
                    <div key={i} {...rest}>
                      {line.map((token, j) => {
                        const tp = getTokenProps({ token });
                        const { key: _kk, ...tokProps } = tp;
                        return <span key={j} {...tokProps} />;
                      })}
                    </div>
                  );
                })}
              </pre>
            )}
          </Highlight>
        );
      }
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>;
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>;
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>;
      case 'list-item':
        return <li {...attributes}>{children}</li>;
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>;
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>;
      default:
        return <p {...attributes}>{children}</p>;
    }
  }, []);

  // 리프 렌더러
  const renderLeaf = useCallback(props => {
    let el = props.children;
    if (props.leaf.bold) el = <strong {...props.attributes}>{el}</strong>;
    if (props.leaf.italic) el = <em {...props.attributes}>{el}</em>;
    if (props.leaf.underline) el = <u {...props.attributes}>{el}</u>;
    return <span {...props.attributes}>{el}</span>;
  }, []);

  const handleChange = useCallback(val => {
    contentRef.current = val;
  }, []);

  const handleBlur = useCallback(() => {
    onCommit(contentRef.current);
    setShowToolbar(false);
  }, [onCommit]);

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

  useEffect(() => {
    if (autoFocus) {
      ReactEditor.focus(editor);
      Transforms.select(editor, Editor.start(editor, []));
    }
  }, [autoFocus, editor]);

  useEffect(() => {
    if (!editor.selection || Range.isCollapsed(editor.selection)) {
      setShowToolbar(false);
    }
  }, [editor.selection]);

  // 키 이벤트 핸들러
  const handleKeyDown = useCallback(
    e => {
      const [inCode] = Editor.nodes(editor, {
        match: n => SlateElement.isElement(n) && n.type === 'code',
      });
      if (inCode && e.key === 'Enter') {
        e.preventDefault();
        Editor.insertBreak(editor);
        return;
      }

      const text = Editor.string(editor, []);
      const sel = editor.selection;
      if (
        e.key === 'Backspace' &&
        sel &&
        Range.isCollapsed(sel) &&
        sel.anchor.offset === 0 &&
        text === ''
      ) {
        e.preventDefault();
        onDelete();
        return;
      }
      if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        Editor.insertText(editor, '\n');
        return;
      }
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onInsert();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        const marks = Editor.marks(editor) || {};
        marks.bold
          ? Editor.removeMark(editor, 'bold')
          : Editor.addMark(editor, 'bold', true);
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        const marks = Editor.marks(editor) || {};
        marks.italic
          ? Editor.removeMark(editor, 'italic')
          : Editor.addMark(editor, 'italic', true);
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        const marks = Editor.marks(editor) || {};
        marks.underline
          ? Editor.removeMark(editor, 'underline')
          : Editor.addMark(editor, 'underline', true);
        return;
      }
    },
    [editor, onDelete, onInsert]
  );

  return (
    <Slate editor={editor} initialValue={block.content} onChange={handleChange}>
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
            <ToolbarMarkButton format="bold" icon={<Bold size={16} />} />
            <ToolbarMarkButton format="italic" icon={<Italic size={16} />} />
            <ToolbarMarkButton format="underline" icon={<Underline size={16} />} />
            <ToolbarBlockButton format="heading-one" icon={<HeadingIcon size={16} />} />
            <ToolbarBlockButton format="heading-two" icon={<HeadingIcon size={14} />} />
            <ToolbarBlockButton format="heading-three" icon={<HeadingIcon size={12} />} />
            <ToolbarBlockButton format="heading-four" icon={<HeadingIcon size={10} />} />
            <ToolbarBlockButton format="heading-five" icon={<HeadingIcon size={8} />} />
            <ToolbarBlockButton format="heading-six" icon={<HeadingIcon size={6} />} />
            <ToolbarBlockButton format="code" icon={<CodeIcon size={16} />} />
            <ToolbarBlockButton format="block-quote" icon={<Quote size={16} />} />
            <ToolbarBlockButton format="numbered-list" icon={<ListOrdered size={16} />} />
            <ToolbarBlockButton format="bulleted-list" icon={<BulletedListIcon size={16} />} />
          </div>
        )}
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onMouseUp={updateToolbar}
          onKeyUp={updateToolbar}
          onClick={updateToolbar}
          spellCheck
          autoFocus={autoFocus}
          style={{
            padding: '0.5rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            minHeight: '2rem',
          }}
        />
      </div>
    </Slate>
  );
}

const ToolbarMarkButton = ({ format, icon }) => {
  const editor = useSlate();
  const marks = Editor.marks(editor) || {};
  const isActive = marks[format] === true;
  return (
    <button
      onMouseDown={e => {
        e.preventDefault();
        isActive
          ? Editor.removeMark(editor, format)
          : Editor.addMark(editor, format, true);
      }}
      style={{
        background: isActive ? '#eee' : 'transparent',
        border: 'none',
        padding: 4,
        borderRadius: 3,
        cursor: 'pointer',
      }}
      title={format}
    >
      {icon}
    </button>
  );
};

const ToolbarBlockButton = ({ format, icon }) => {
  const editor = useSlate();
  const isActive = isBlockActive(editor, format);
  return (
    <button
      onMouseDown={e => {
        e.preventDefault();
        toggleBlock(editor, format);
      }}
      style={{
        background: isActive ? '#eee' : 'transparent',
        border: 'none',
        padding: 4,
        borderRadius: 3,
        cursor: 'pointer',
      }}
      title={format}
    >
      {icon}
    </button>
  );
};
