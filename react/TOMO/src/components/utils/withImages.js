import { Transforms } from "slate";
import { ReactEditor } from "slate-react";

export function withImages(editor) {
  const {insertData, isVoid} = editor;

  editor.isVoid = element => {
    element.type === 'image' || isVoid(element);
  };

  editor.insertData = data => {
    const {files} = data;
    if (files && files.length > 0) {
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          Transforms.insertNodes(editor, {
            type: 'image',
            url: reader.result,
            width: 300,
            height: 200,
            children: [{text: ''}],
          });
        });
        reader.readAsDataURL(file);
      };
      return;
    };
    // 그 외 HTML/텍스트 붙여넣기 기본 동작
    insertData(data);
  };

  return editor;
};