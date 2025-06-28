import { createEditor, Editor, Element, Transforms } from "slate";
import { withReact } from "slate-react";
import { LIST_TYPES } from "./contents";
import { deserialize } from "./deserialize";
import { withImages } from "./withImages";


// 에디터 생성 및 붙여넣기 처리
export function createEditorWithPaste() {
  let editor = withImages(withReact(createEditor()));
  const { insertData } = editor;
  editor.insertDate = data => {
    const html = data.getData("text/html");
    if (html) {
      const parsed = new DOMParser().parseFromString(html, "text/html");
      const fragment = deserialize(parsed.body);
      Transforms.insertFragment(editor, fragment);
      return;
    }
    const text = data.getData("text/plain");
    if (text.includes("\n")) {
      const lines = text.split(/\r?\n/).map(line => ({ text: line }));
      Transforms.insertNodes(editor, { type: 'code', children: lines});
      return;
    }
    insertData(data);
  };
  return editor;
};

// 블록 활성화 여부 체크
export function isBlockActive(editor, format) {
  const [match] = Editor.nodes(editor, {
    match: n => Element.isElement(n) && n.type === (LIST_TYPES.includes(format) ? 'list-item' : format),
  });
  return !!match;
};

// 블록 타입 토글
export function toggleBlock(editor, format) {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);
  Transforms.unwrapNodes(editor, {
    match: n => Element.isElement(n) && LIST_TYPES.includes(n.type),
    split: true,
  });
  Transforms.setNodes(editor, { type: isActive ? 'paragraph' : isList ? 'list-item' : format });
  if (!isActive && isList) {
    Transforms.wrapNodes(editor, { type: format, children: [] });
  }
}