import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight, oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "./ThemeContext";

const MarkdownRenderer = ({ content }) => {
  const { isDarkMode } = useTheme();

  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={isDarkMode ? oneDark : oneLight}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={`rounded px-1.5 py-0.5 text-sm ${
          isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-800'
        }`} {...props}>
          {children}
        </code>
      );
    },
    a({ node, ...props }) {
      return <a target="_blank" rel="noopener noreferrer" {...props} />;
    },
  };

  return (
    <div className={`markdown-content ${isDarkMode ? 'dark' : ''}`}>
      <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;