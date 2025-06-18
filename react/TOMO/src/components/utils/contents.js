import { v4 as uuidv4 } from 'uuid';

export const initialBlocks = [
  {
    id: uuidv4(),
    type: 'paragraph',
    content: [{ 
      type: 'paragraph',
      children: [{ text: '' }]
     }]
  },
];
export const LIST_TYPES = ['numbered-list', 'bulleted-list'];