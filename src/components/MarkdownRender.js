import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";

const MarkdownRenderer = ({ content }) => {
  const components = {
    code({ node, inline, className, children, ...props }) {
      const isPreTag = node.parent && node.parent.tagName === "pre";
      const match = /language-(\w+)/.exec(className || "");

      if (!inline && match) {
        // Code blocks inside `pre` tags will be handled by `SyntaxHighlighter`
        return (
          <SyntaxHighlighter
            style={solarizedlight}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        );
      }

      // Code blocks not inside `pre` tags
      return (
        <code className={isPreTag ? "" : "inline-code"} {...props}>
          {children}
        </code>
      );
    },
    a({ node, ...props }) {
      // Render links with target="_blank" and rel="noopener noreferrer"
      return (
        <a {...props} target="_blank" rel="noopener noreferrer">
          {props.children}
        </a>
      );
    },
  };

  return (
    <div className="markdown-content">
      <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
