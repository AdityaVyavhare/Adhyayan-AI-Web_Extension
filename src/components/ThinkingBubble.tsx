import React from "react";
import type { ThinkingBubbleProps } from "../types";

export const ThinkingBubble: React.FC<ThinkingBubbleProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="flex w-full mb-4 justify-start">
      <div className="message-assistant">
        <div className="flex items-center gap-2">
          <span className="text-sm opacity-70">Thinking</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-current rounded-full dot-1 opacity-70"></div>
            <div className="w-2 h-2 bg-current rounded-full dot-2 opacity-70"></div>
            <div className="w-2 h-2 bg-current rounded-full dot-3 opacity-70"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThinkingBubble;
