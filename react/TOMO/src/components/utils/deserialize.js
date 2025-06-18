export function deserialize(domNode) {
  // 텍스트 노드 처리
  if (domNode.nodeType === Node.TEXT_NODE) {
    return domNode.textContent ? [{ text: domNode.textContent }] : [];
  }
  // 엘리먼트 노드가 아니면 무시
  if (domNode.nodeType !== Node.ELEMENT_NODE) {
    return [];
  }

  const nodeName = domNode.nodeName;
  const children = Array.from(domNode.childNodes).flatMap(deserialize);

  switch (nodeName) {
    case 'BODY':
      return children;
    case 'BR':
      return [{ text: '\n' }];
    case 'P':
      return [{ type: 'paragraph', children }];
    case 'DIV':
      return [{ type: 'div', children }];
    case 'H1':
      return [{ type: 'heading-one', children }];
    case 'H2':
      return [{ type: 'heading-two', children }];
    case 'H3':
      return [{ type: 'heading-three', children }];
    case 'H4':
      return [{ type: 'heading-four', children }];
    case 'H5':
      return [{ type: 'heading-five', children }];
    case 'H6':
      return [{ type: 'heading-six', children }];
    case 'BLOCKQUOTE':
      return [{ type: 'block-quote', children }];
    case 'UL':
      return [{ type: 'bulleted-list', children }];
    case 'OL':
      return [{ type: 'numbered-list', children }];
    case 'LI':
      return [{ type: 'list-item', children }];
    case 'PRE':
      return [{ type: 'code-block', children: [{ text: '' }] }];
    case 'CODE':
      return [{ type: 'code', children: children.length ? children : [{ text: '' }] }];
    case 'STRONG':
      return [{ type: 'bold', children }];
    case 'EM':
      return [{ type: 'italic', children }];
    case 'U':
      return [{ type: 'underline', children }];
    default:
      // 알 수 없는 태그는 무시하고 자식 노드만 반환
      return children.map(child => ({ type: 'paragraph', children: [child] }));
  }
}