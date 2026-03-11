import React, { useEffect, useRef, useState } from "react";

import { cn } from "@/utils";

import { Button } from "./Button";

interface ExpandableTextProps {
  text: string;
  className?: string;
  previewLines?: number;
  maxExpandedHeight?: string;
}

export const ExpandableText: React.FC<ExpandableTextProps> = ({
  text,
  className,
  previewLines = 4,
  maxExpandedHeight = "40vh",
}) => {
  const [expanded, setExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);

  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      const el = textRef.current;
      if (!el) return;

      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      const collapsedHeight = lineHeight * previewLines;

      setShouldShowButton(el.scrollHeight > collapsedHeight + 1);
    };

    checkOverflow();

    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [text, previewLines]);

  return (
    <div className={cn("flex w-full flex-col gap-1", className)}>
      <div
        className="relative overflow-hidden"
        style={
          expanded
            ? {
                maxHeight: maxExpandedHeight,
                overflowY: "auto",
                paddingRight: "8px",
              }
            : undefined
        }
      >
        <p
          ref={textRef}
          style={
            !expanded
              ? {
                  display: "-webkit-box",
                  WebkitLineClamp: previewLines,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }
              : undefined
          }
        >
          {text}
        </p>
      </div>

      {shouldShowButton && (
        <Button
          variant="link"
          className="h-fit self-end py-0 text-sm"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "Show less" : "Show more"}
        </Button>
      )}
    </div>
  );
};
