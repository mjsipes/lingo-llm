"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, ArrowUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatProps {
  messages: any[];
  input: string;
  handleInputChange: (e: any) => void;
  handleSubmit: (e: any) => void;
  isLoading: boolean;
  setMessages: (messages: any[]) => void;
  selectedText: string;
}

export function Chat({ 
  messages, 
  input, 
  handleInputChange, 
  handleSubmit, 
  isLoading, 
  setMessages,
  selectedText 
}: ChatProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);


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

  const handleNewChat = () => {
    setMessages([]);
  };

  const pinguWelcomeMessage =  "Hi! I'm your main storytelling buddy! Tell me about your adventures and I'll help bring your ideas to life!"
  const pinguTitle ="Story Companion";

  return (
    <div className="flex flex-col h-full w-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b">
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/penguin.png" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <img
              src="/penguin.png"
              alt="penguin avatar"
              className="h-48 w-48 rounded-md"
            />
          </TooltipContent>
        </Tooltip>
        <div className="flex-1">
          <div className="flex items-baseline gap-1">
            <span className="font-medium text-sm">Pingu Penguin</span>
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={handleNewChat}>
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>New chat</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-hidden w-full">
        <ScrollArea className="h-full w-full px-4 py-2" ref={scrollAreaRef}>
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
                        : "bg-muted mr-auto"
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
      <div className="px-4 pb-4 pt-2 w-full">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex gap-2">
            <Textarea
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