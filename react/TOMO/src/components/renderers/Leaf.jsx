import React from 'react';

export default function Leaf({ leaf, attributes, children }) {
  if (leaf.bold) {
    children = <strong {...attributes}>{children}</strong>;
  }
  if (leaf.italic) {
    children = <em {...attributes}>{children}</em>;
  }
  if (leaf.underline) {
    children = <u {...attributes}>{children}</u>;
  }
  return (
    <span {...attributes}>{children}</span>
  )
};