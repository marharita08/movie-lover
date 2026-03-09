import React, { useEffect, useRef, useState } from "react";

import { cn } from "@/utils";

import { Button } from "./Button";

interface ExpandableTextProps {
  text: string;
  className?: string;
}

export const ExpandableText: React.FC<ExpandableTextProps> = ({
  text,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const [heights, setHeights] = useState({ collapsed: 0, expanded: 0 });
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const lineHeight = parseInt(
          window.getComputedStyle(textRef.current).lineHeight,
        );
        const collapsedHeight = lineHeight * 4;
        const expandedHeight = textRef.current.scrollHeight;

        setHeights({ collapsed: collapsedHeight, expanded: expandedHeight });
        setShouldShowButton(expandedHeight > collapsedHeight);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, [text]);

  return (
    <div className={cn("flex w-full flex-col", className)}>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isExpanded
            ? `${heights.expanded}px`
            : `${heights.collapsed}px`,
        }}
      >
        <p ref={textRef}>{text}</p>
      </div>

      {shouldShowButton && (
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant={"link"}
          className="h-fit self-end py-0 text-sm"
        >
          {isExpanded ? "Show less" : "Show more"}
        </Button>
      )}
    </div>
  );
};
