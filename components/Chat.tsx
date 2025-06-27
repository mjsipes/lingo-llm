"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUp } from "lucide-react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatProps {
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function Chat({ 
  messages, 
  input, 
  handleInputChange, 
  handleSubmit, 
  isLoading
}: ChatProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-slot='scroll-area-viewport']"
      ) as HTMLElement | null;
      if (scrollContainer) {
        setTimeout(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }, 0);
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handlePinguClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
    textareaRef.current?.focus();
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const pinguWelcomeMessage = "Hi! I'm your main storytelling buddy! Tell me about your adventures and I'll help bring your ideas to life!";
  const pinguTitle = "Story Companion";

  return (
    <div className="flex flex-col h-full w-full bg-background">
      {/* Pingu Header with Button Treatment */}
      <div className="flex items-center justify-center pt-4">
        <Tooltip open={isOpen} onOpenChange={handleOpenChange}>
          <TooltipTrigger asChild>
            <Button className="py-8" onClick={handlePinguClick}>
              <Avatar className="h-12 w-12">
                <AvatarImage src="/penguin.png" />
                <AvatarFallback>P</AvatarFallback>
              </Avatar>
              <h1>Pingu Penguin</h1>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="flex flex-row gap-4">
            <Image
              src="/penguin.png"
              alt="Pingu Penguin avatar"
              width={192}
              height={192}
              className="rounded-md"
            />
            <div className="gap-2">
              <div className="flex flex-row items-center gap-2">
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-white">
                  Pingu Penguin
                </h4>
                <span className="text-sm font-medium text-white">{pinguTitle}</span>
              </div>

              <div className="w-[240px] h-[160px] overflow-y-auto">
                <div className="text-white/80 text-xs">{pinguWelcomeMessage}</div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-hidden w-full">
        <ScrollArea className="h-full w-full px-4 py-3" ref={scrollAreaRef}>
          <div className="space-y-2 w-full">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg px-3 py-2 text-sm shadow-sm transition-all duration-200
                    ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-sky-100 mr-auto"
                    }
                    ${message.content.length > 120 ? "w-full" : "max-w-[80%]"}
                  `}
                >
                  {message.role === "user" ? (
                    message.content
                  ) : (
                    <div>
                      {!message.content && isLoading && index === messages.length - 1 ? (
                        <span className="text-muted-foreground animate-pulse">
                          Thinking...
                        </span>
                      ) : (
                        <span style={{ whiteSpace: 'pre-wrap' }}>
                          {message.content}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-1 w-full">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              placeholder="Start your story here..."
              className="flex-1 resize-none"
              rows={3}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={!input.trim() || isLoading}
              size="sm"
              className="h-8 w-8"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}