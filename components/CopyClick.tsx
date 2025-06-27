"use client";
import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy } from "lucide-react";

export function useTextSelection() {
  const [selectedText, setSelectedText] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [triggerPosition, setTriggerPosition] = useState({ x: 0, y: 0 });
  const [isUpperHalf, setIsUpperHalf] = useState(true);

  useEffect(() => {
    const handleMouseUp = () => {
      setTimeout(() => {
        const selection = window.getSelection();
        const selectionText = selection?.toString();
        if (
          selectionText &&
          selectionText.length > 0 &&
          selection &&
          selection.rangeCount > 0
        ) {
          const range = selection.getRangeAt(0);
          console.log("selected text range: ", range);
          const rect = range.getBoundingClientRect();
          console.log("selected text rect: ", rect);
          const viewportHeight = window.innerHeight;
          const upperHalf = rect.bottom < viewportHeight / 2;
          setIsUpperHalf(upperHalf);
          setTriggerPosition({
            x: rect.left + rect.width / 2,
            y: upperHalf ? rect.bottom + 5 : rect.top - 5,
          });
          setIsPopoverOpen(true);
        } else {
          setIsPopoverOpen(false);
        }
      }, 10);
    };

    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleCopyClick = async () => {
    const selection = window.getSelection()?.toString() || "";
    if (selection) {
      try {
        await navigator.clipboard.writeText(selection);
        console.log("setting selected text to ", selection.slice(0, 60));
        setSelectedText(selection);
        setIsPopoverOpen(false);

        window.getSelection()?.removeAllRanges();

        toast("Copied Text:", {
          description:
            selection.length > 50
              ? `${selection.substring(0, 50)}...`
              : selection,
          position: "top-right",
        });
      } catch {
        console.log("Failed to copy");
      }
    }
  };

  return {
    selectedText,
    isPopoverOpen,
    setIsPopoverOpen,
    triggerPosition,
    isUpperHalf,
    handleCopyClick,
  };
}

interface SelectionPopoverProps {
  isPopoverOpen: boolean;
  setIsPopoverOpen: (open: boolean) => void;
  triggerPosition: { x: number; y: number };
  isUpperHalf: boolean;
  handleCopyClick: () => void;
}

export function SelectionPopover({
  isPopoverOpen,
  setIsPopoverOpen,
  triggerPosition,
  isUpperHalf,
  handleCopyClick,
}: SelectionPopoverProps) {
  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <div
          className="absolute w-1 h-1 pointer-events-none"
          style={{
            left: `${triggerPosition.x}px`,
            top: `${triggerPosition.y}px`,
          }}
        />
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-2 border-none"
        side={isUpperHalf ? "bottom" : "top"}
        align="center"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyClick}
          className="h-8 w-8 p-0"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </PopoverContent>
    </Popover>
  );
}
