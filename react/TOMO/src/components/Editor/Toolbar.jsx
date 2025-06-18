import React from 'react';
import MarkButton from './MarkButton';
import BlockButton from './BlockButton';
import { Bold, Italic, Underline, Type as HeadingIcon, List as BulletedListIcon, ListOrdered, Quote, CodeIcon } from 'lucide-react';

export default function Toolbar() {
  return (
    <>
      <MarkButton format="bold" icon={<Bold />} />
      <MarkButton format="italic" icon={<Italic />} />
      <MarkButton format="underline" icon={<Underline />} />
      <BlockButton format="heading-one" icon={<HeadingIcon />} />
      <BlockButton format="heading-two" icon={<HeadingIcon size={14} />} />
      <BlockButton format="heading-three" icon={<HeadingIcon size={12} />} />
      <BlockButton format="heading-four" icon={<HeadingIcon size={10} />} />
      <BlockButton format="heading-five" icon={<HeadingIcon size={8} />} />
      <BlockButton format="heading-six" icon={<HeadingIcon size={6} />} />
      <BlockButton format="bulleted-list" icon={<BulletedListIcon />} />
      <BlockButton format="numbered-list" icon={<ListOrdered />} />
      <BlockButton format="block-quote" icon={<Quote />} />
      <BlockButton format="code-block" icon={<CodeIcon />} />
    </>
  );
}