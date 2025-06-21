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
import ReactMarkdown from "react-markdown";

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
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      {!message.content && isLoading && index === messages.length - 1 ? (
                        <span className="text-muted-foreground animate-pulse">
                          Thinking...
                        </span>
                      ) : (
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => (
                              <p className="mb-2 last:mb-0">{children}</p>
                            ),
                            code: ({ children }) => (
                              <code className="bg-muted-foreground/20 px-1 py-0.5 rounded text-xs">
                                {children}
                              </code>
                            ),
                            pre: ({ children }) => (
                              <pre className="bg-muted-foreground/20 p-2 rounded overflow-x-auto text-xs">
                                {children}
                              </pre>
                            ),
                            ul: ({ children }) => (
                              <ul className="ml-4 mb-2">{children}</ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="ml-4 mb-2">{children}</ol>
                            ),
                            li: ({ children }) => (
                              <li className="mb-1">{children}</li>
                            ),
                            h1: ({ children }) => (
                              <h1 className="text-base font-bold mb-2">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-sm font-bold mb-2">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-sm font-semibold mb-1">
                                {children}
                              </h3>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
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
              placeholder="Ask me anything about your story..."
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