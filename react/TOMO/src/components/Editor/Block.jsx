import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Slate, Editable, ReactEditor } from 'slate-react';
import { Editor, Element, Range, Transforms } from 'slate';
import { createEditorWithPaste } from '../utils/editor';
import Toolbar from './Toolbar';
import CodeElement from '../renderers/CodeElement';
import DefaultElement from '../renderers/DefaultElement';
import Leaf from '../renderers/Leaf';

export default function Block({block, autoFocus, onInsert, onDelete, onCommit}) {
  if (!block) {
    return null;
  }

  const editor = useRef(createEditorWithPaste()).current;
  const contentRef = useRef(block.content);
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ top:0, left:0 }); // Position for the toolbar

  const handleChange = useCallback(val => {contentRef.current = val;}, []);
  const handleBlur = useCallback(() => {onCommit(contentRef.current); setShow(false); }, [onCommit]);
  const updateToolbar = useCallback(() => {
    const { selection } = editor;
    if (selection && Range.isExpanded(selection)) {
      const domRange = ReactEditor.toDOMRange(editor, selection);
      const selectionRect = domRange.getBoundingClientRect();
      const editableEl = ReactEditor.toDOMNode(editor, editor);

      // 부모 컨테이너가 없으면 툴바를 숨깁니다.
      if (!editableEl.parentElement) {
        setShow(false);
        return;
      }

      const containerRect = editableEl.parentElement.getBoundingClientRect();
      const toolbarHeight = 40; // 툴바의 실제 높이(px)로 조정하세요.

      // 부모 컨테이너를 기준으로 상대 위치를 계산합니다.
      const top = selectionRect.top - containerRect.top - toolbarHeight;
      const left = selectionRect.left - containerRect.left;

      setPos({ top, left });
      setShow(true);
    } else {
      setShow(false);
    }
  }, [editor]);
  useEffect(() => { if (autoFocus) { ReactEditor.focus(editor); Transforms.select(editor, Editor.start(editor, [])); } }, [autoFocus, editor]);
  useEffect(() => { if (!editor.selection || Range.isCollapsed(editor.selection)) setShow(false); }, [editor.selection]);

  const handleKeyDown = useCallback(e => {
    // 1) 리스트 항목 내부에서 Enter -> 새로운 리스트 아이템으로 분할
    const [listItemEntry] = Editor.nodes(editor, {
      match: n => Element.isElement(n) && n.type === 'list-item',
    });
    if (listItemEntry && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      
      // 현재 node(list-item)를 커서 위치에서 분할(split)해서 동일한 list-item이 자동으로 이어지도록 함.
      Transforms.splitNodes(editor, {
        match: n => Element.isElement(n) && n.type === 'list-item',
        always: true,
      });
      return;
    }

    // 2) 코드 블록 내부에서 Enter -> 줄바꿈
    const [inCode] = Editor.nodes(editor, { match: n => n.type === 'code' });
    if (inCode && e.key === 'Enter') { 
      e.preventDefault();
      Editor.insertText(editor, '\n');
      return; 
    }

    // 3) 일반 텍스트 블록에서 Enter/Shift+Enter/Backspace -> 블록 추가/줄바꿈/블록삭제
    const text = Editor.string(editor, []);
    const sel = editor.selection;
    if (e.key === 'Backspace' && sel && Range.isCollapsed(sel) && sel.anchor.offset === 0 && text === '') {
      e.preventDefault();
      onDelete();
      return;
    }
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      Editor.insertText(editor, '\n');
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      onInsert();
      return;
    }
    if ((e.ctrlKey||e.metaKey) && e.key==='b') {
      e.preventDefault();
      const m=Editor.marks(editor)||{};
      m.bold?Editor.removeMark(editor,'bold'):Editor.addMark(editor,'bold',true);
      return;
    }
    if ((e.ctrlKey||e.metaKey) && e.key==='i') {
      e.preventDefault();
      const m=Editor.marks(editor)||{};
      m.italic?Editor.removeMark(editor,'italic'):Editor.addMark(editor,'italic',true);
      return;
    }
    if ((e.ctrlKey||e.metaKey) && e.key==='u') {
      e.preventDefault();
      const m=Editor.marks(editor)||{};
      m.underline?Editor.removeMark(editor,'underline'):Editor.addMark(editor,'underline',true);
      return;
    }
  }, [editor, onDelete, onInsert]);

  return (
    <Slate editor={editor} initialValue={block.content} onChange={handleChange}>
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        {show && <Toolbar style={{ position: 'absolute', top: pos.top, left: pos.left, zIndex: 1000 }} />}
        <Editable
          renderElement={props => <DefaultElement {...props} />}
          renderLeaf={props => <Leaf {...props} />}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onMouseUp={updateToolbar}
          onKeyUp={updateToolbar}
          onClick={updateToolbar}
          spellCheck
          autoFocus={autoFocus}
          style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', minHeight: '2rem' }}
        />
      </div>
    </Slate>
  );
};