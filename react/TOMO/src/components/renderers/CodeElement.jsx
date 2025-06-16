import hljs from "highlight.js";
import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/github";
import { Node } from "slate";

export default function CodeElement({ element, attributes }) {
  const code = Node.string(element);
  const { language = 'javascript' } = hljs.highlightAuto(code);
  return (
    <Highlight {...defaultProps} code={code} language={language} theme={theme}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={{...style, whiteSpace: 'pre-wrap'}} {...attributes}>
          {tokens.map((line, i) => {
            const {key, ...rest} = getLineProps({line});
            return (
              <div key={i} {...rest}>
                {line.map((token, j) => {
                  const { key: kk, ...props } = getTokenProps({token});
                  return <span key={j} {...props} />;
                })}
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
};