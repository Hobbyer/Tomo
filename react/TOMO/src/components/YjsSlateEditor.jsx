import React, { useEffect, useState } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';

import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { withYjs, YjsEditor } from '@slate-yjs/core';

// 렌더링 함수들
const BlockRenderer = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'heading':
      return <h1 {...attributes}>{children}</h1>;
    case 'code':
      return <pre {...attributes}><code>{children}</code></pre>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const LeafRenderer = ({ attributes, children, leaf }) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  return <span {...attributes}>{children}</span>;
};

export default function YjsSlateEditor({ docId, ydoc }) {
  const [editor, setEditor] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    console.log('[YjsSlateEditor] ⚙ 초기화 시작');

    const sharedType = ydoc.getText('content'); // ✅ 반드시 Y.Text여야 함
    const provider = new WebsocketProvider('ws://localhost:1234', docId, ydoc);
    console.log('[YjsSlateEditor] 🌐 WebsocketProvider 연결 중');

    provider.once('synced', () => {
      console.log('[YjsSlateEditor] ✅ Yjs synced 완료');
      console.log('[sharedType] 🔍 toString:', sharedType.toString());

      const e = withYjs(withHistory(withReact(createEditor())), sharedType);
      YjsEditor.connect(e);
      setEditor(e);
      setConnected(true);
    });

    return () => {
      provider.destroy();
      ydoc.destroy();
      console.log('[YjsSlateEditor] 🧹 정리 완료');
    };
  }, [docId, ydoc]);

  const shouldShowEditor = editor && connected && Array.isArray(editor.children);

  if (!shouldShowEditor || editor.children.length === 0) {
    return <div style={{ padding: '1rem' }}>🌀 에디터 불러오는 중...</div>;
  }

  return (
    <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}>
      <Slate editor={editor} value={editor.children} onChange={() => {}}>
        <Editable
          renderElement={(props) => <BlockRenderer {...props} />}
          renderLeaf={(props) => <LeafRenderer {...props} />}
          placeholder="내용을 입력해보세요~"
        />
      </Slate>
    </div>
  );
}
