import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Slate, Editable, ReactEditor } from 'slate-react';
import { Editor, Range, Transforms } from 'slate';
import { createEditorWithPaste } from '../utils/editor';
import Toolbar from './Toolbar';
import CodeElement from '../renderers/CodeElement';
import DefaultElement from '../renderers/DefaultElement';
import Leaf from '../renderers/Leaf';

export default function Block({block, autoFocus, onInsert, onDelete, onCommit}) {
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
      const rect = domRange.getBoundingClientReact();
      setPos({ top: rect.top - 45 + window.scrollY, left: rect.left + window.scrollX });
      setShow(true);
    } else {
      setShow(false);
    }
  }, [editor]);
  useEffect(() => { if (autoFocus) { ReactEditor.focus(editor); Transforms.select(editor, Editor.start(editor, [])); } }, [autoFocus, editor]);
  useEffect(() => { if (!editor.selection || Range.isCollapsed(editor.selection)) setShow(false); }, [editor.selection]);

  const handleKeyDown = useCallback(e => {
    const [inCode] = Editor.nodes(editor, { match: n => n.type === 'code' });
    if (inCode && e.key === 'Enter') { e.preventDefault(); Editor.insertText(editor, '\n'); return; }
    const text = Editor.string(editor, []);
    const sel = editor.selection;
    if (e.key === 'Backspace' && sel && Range.isCollapsed(sel) && sel.anchor.offset === 0 && text === '') { e.preventDefault(); onDelete(); return; }
    if (e.key === 'Enter' && e.shiftKey) { e.preventDefault(); Editor.insertText(editor, '\n'); return; }
    if (e.key === 'Enter') { e.preventDefault(); onInsert(); return; }
    if ((e.ctrlKey||e.metaKey) && e.key==='b') { e.preventDefault(); const m=Editor.marks(editor)||{}; m.bold?Editor.removeMark(editor,'bold'):Editor.addMark(editor,'bold',true); return; }
    if ((e.ctrlKey||e.metaKey) && e.key==='i') { e.preventDefault(); const m=Editor.marks(editor)||{}; m.italic?Editor.removeMark(editor,'italic'):Editor.addMark(editor,'italic',true); return; }
    if ((e.ctrlKey||e.metaKey) && e.key==='u') { e.preventDefault(); const m=Editor.marks(editor)||{}; m.underline?Editor.removeMark(editor,'underline'):Editor.addMark(editor,'underline',true); return; }
  }, [editor, onDelete, onInsert]);

  return (
    <Slate editor={editor} initialValue={block.content} onChange={handleChange}>
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        {show && <Toolbar style={{ position: 'absolute', top: pos.top, left: pos.left }} />}
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