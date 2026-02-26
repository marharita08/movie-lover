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
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const lineHeight = parseInt(
          window.getComputedStyle(textRef.current).lineHeight,
        );
        const maxHeight = lineHeight * 4;
        const actualHeight = textRef.current.scrollHeight;

        setShouldShowButton(actualHeight > maxHeight);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, [text]);

  return (
    <div className={cn("flex w-full flex-col", className)}>
      <p
        ref={textRef}
        className={!isExpanded && shouldShowButton ? "line-clamp-4" : ""}
      >
        {text}
      </p>

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
