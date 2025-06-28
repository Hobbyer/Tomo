// src/components/Toolbar.jsx
import React from 'react';
import MarkButton from './MarkButton';
import BlockButton from './BlockButton';
import ImageButton from './ImageButton';
import {
  Bold,
  Italic,
  Underline,
  Type as HeadingIcon,
  List as BulletedListIcon,
  ListOrdered,
  Quote,
  Code as CodeIcon,
  Image as ImageIcon,
} from 'lucide-react';

export default function Toolbar({ style }) {
  return (
    <div style={{ display: 'flex', gap: '0.25rem', ...style }}>
      {/* 이미지 업로드 버튼 */}
      <ImageButton icon={<ImageIcon size={16} />} />

      {/* 마크 버튼 */}
      <MarkButton format="bold" icon={<Bold size={16} />} />
      <MarkButton format="italic" icon={<Italic size={16} />} />
      <MarkButton format="underline" icon={<Underline size={16} />} />

      {/* 블록 버튼 */}
      <BlockButton format="heading-one" icon={<HeadingIcon size={16} />} />
      <BlockButton format="heading-two" icon={<HeadingIcon size={14} />} />
      <BlockButton format="heading-three" icon={<HeadingIcon size={12} />} />
      <BlockButton format="heading-four" icon={<HeadingIcon size={10} />} />
      <BlockButton format="heading-five" icon={<HeadingIcon size={8} />} />
      <BlockButton format="heading-six" icon={<HeadingIcon size={6} />} />
      <BlockButton format="block-quote" icon={<Quote size={16} />} />
      <BlockButton format="numbered-list" icon={<ListOrdered size={16} />} />
      <BlockButton format="bulleted-list" icon={<BulletedListIcon size={16} />} />
      <BlockButton format="code" icon={<CodeIcon size={16} />} />
    </div>
  );
}
