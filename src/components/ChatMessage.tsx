import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { User, Bot } from "lucide-react";
import type { Message } from "../types";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { role, content, timestamp } = message;
  const isUser = role === "user";

  return (
    <div
      className={`flex gap-3 mb-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? "bg-gradient-to-br from-blue-500 to-blue-600"
            : "bg-gradient-to-br from-purple-500 to-purple-600"
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={`flex-1 max-w-[80%] ${isUser ? "items-end" : "items-start"}`}
      >
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-blue-600 text-white"
              : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
          }`}
        >
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                code(props) {
                  const { children, className, ...rest } = props as any;
                  const isBlock = className?.includes("language-");
                  return isBlock ? (
                    <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto my-2">
                      <code className={className} {...rest}>
                        {children}
                      </code>
                    </pre>
                  ) : (
                    <code
                      className={`${className} bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm`}
                      {...rest}
                    >
                      {children}
                    </code>
                  );
                },
                p({ children }) {
                  return <p className="mb-2 last:mb-0">{children}</p>;
                },
                a({ href, children }) {
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${
                        isUser
                          ? "text-blue-100 underline hover:text-white"
                          : "text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300"
                      }`}
                    >
                      {children}
                    </a>
                  );
                },
                ul({ children }) {
                  return <ul className="list-disc pl-4 mb-2">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="list-decimal pl-4 mb-2">{children}</ol>;
                },
                li({ children }) {
                  return <li className="mb-1">{children}</li>;
                },
                h1({ children }) {
                  return <h1 className="text-xl font-bold mb-2">{children}</h1>;
                },
                h2({ children }) {
                  return <h2 className="text-lg font-bold mb-2">{children}</h2>;
                },
                h3({ children }) {
                  return (
                    <h3 className="text-base font-bold mb-2">{children}</h3>
                  );
                },
                blockquote({ children }) {
                  return (
                    <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-2">
                      {children}
                    </blockquote>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Timestamp */}
        {timestamp && (
          <div
            className={`text-xs text-gray-400 mt-1 px-2 ${
              isUser ? "text-right" : "text-left"
            }`}
          >
            {new Date(timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
