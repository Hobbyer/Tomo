import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createEditor, Transforms } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

// Slate와 Yjs를 통합하기 위한 커스텀 에디터
import { withYjs } from '@slate-yjs/core';

// 블록 드래그&드롭 (react-beautiful-dnd)
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { withHistory } from 'slate-history';

// ========================
// 1) 커스텀 블록 렌더러
// ========================
const BlockRenderer = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'heading':
      return <h1 {...attributes}>{children}</h1>;
    case 'code':
      return (
        <pre {...attributes}>
          <code>{children}</code>
        </pre>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};

// =========================================
// 2) 텍스트 스타일링 렌더러 (볼드, 이탤릭 등)
// =========================================
const LeafRenderer = ({ attributes, leaf, children }) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  return <span {...attributes}>{children}</span>;
};

// ===============================
// 3) CollaborativeEditor 컴포넌트
// ===============================
export default function YjsSlateEditor({ docId }) {
  // 3-1) Yjs 문서 객체 생성 (한번만)
  const ydoc = useMemo(() => { new Y.Doc() }, []);

  // 3-2) WebSocketProvider 생성
  const provider = useMemo(
    () => { new WebsocketProvider('ws://localhost:1234', docId, ydoc), [docId, ydoc] }
  );

  // 3-3) Slate 에디터 인스턴스 생성 & 플러그인 붙이기
  const [editor] = useState(()=>{
    const sharedType = ydoc.getArray('content');
    const e = withYjs(withHistory(withReact(createEditor())), sharedType)

    return e;
  });

  // 본인 커서 정보 awareness 로 전파
  const updateMyCursor = () => {
    
  };

  // 3-4) 다른 사용자의 커서 정보 가져오기 
  const [remoteCursors, setRemoteCursors] = useState([]);

  // 3-5) 프로바이더 상태 변화 감시 & 언마운트 시 정리
  useEffect(() => {
    const onAwarenessChange = () => {
      const states = Array.from(provider.awareness.getStates().entries());
      const cursors = states
        .filter(([clientId]) => clientId !== provider.awareness.clientID)
        .map(([_, state]) => state.cursor)
        .filter(Boolean);
      setRemoteCursors(cursors);
    };

    provider.awareness.on('change', onAwarenessChange);

    return () => {
      provider.awareness.off('change', onAwarenessChange);
    };
  }, [provider]);

  // 3-6) 블록 드래그앤드롭 로직
  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;
      const fromIdx = result.source.index;
      const toIdx = result.destination.index;
      Transforms.moveNodes(editor, {
        at: [fromIdx],
        to: [toIdx + (fromIdx < toIdx ? 1 : 0)],
      })
    }, [editor]
  );

  return(
    <div style={{
      position: 'relative',
      padding: '1rem',
      border: '1px solid #ddd',
      borderRadius: '0.5rem',
    }}
    >
      {/* 3-7) Slate 컴포넌트 시작 */}
      <Slate editor={editor} value={editor.children} onChange={()=>{}}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='blocks'>
            {(provided) => {
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {editor.children.map((node, idx) => (
                  <Draggable key={node.key} draggableId={node.key} index={idx}>
                  {(prov) => (
                    <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}
                      style={{
                        marginBottom: '8px',
                        padding: '8px',
                        backgroundColor: '#fafafa',
                        borderRadius: '4px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        ...prov.draggableProps.style,
                      }}
                    >
                      <Editable renderElement={(props) => <BlockRenderer {...props} />}
                        renderLeaf={(props) => <LeafRenderer {...props} />}
                        placeholder='내용을 입력해보세요~'
                        decorate={decorate}
                        />
                    </div>
                  )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            }}
          </Droppable>
        </DragDropContext>

        {/* 3-8) 다른 사용자의 커서 표시 (예시) */}
        {cursors.map((cursor, i) => (
          <div key={i}
            style={{
              position: 'absolute',
              top: cursor.y, // 실제 좌표를 계산해야 함 (예시용)
              left: cursor.x,
              backgroundColor: cursor.color,
              padding: '2px 4px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              color: '#fff',
            }}
          >
            {cursor.name}
          </div>
        ))}
      </Slate>
    </div>
  )
};