"use client";

import { useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
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

export function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const starterMessages = [
    "get my layers",
    "what is the weather outside today",
    "rank my outfits from warmest to coolest",
    "whats my best outfit for 22 degree weather",
  ];

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

  const handleSendStarterMessage = (starterMsg: string) => {
    if (isLoading) return;
    handleInputChange({ target: { value: starterMsg } } as any);
    setTimeout(() => {
      const form = document.createElement("form");
      const event = new Event("submit", { bubbles: true, cancelable: true });
      handleSubmit(event as any);
    }, 0);
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
    {/* {isLoading && (
      <span className="text-xs text-muted-foreground">
        is thinking.
      </span>
    )} */}
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
            {messages.length === 0 && (
              <div className="flex justify-start">
                <div className="rounded-lg px-3 py-2 text-sm shadow-sm bg-muted mr-auto max-w-[80%]">
                  Hi, how can I help you today?
                </div>
              </div>
            )}
            {messages.map((message) => (
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
                      {message.parts?.map((part, index) => {
                        if (part.type === "text") {
                          return (
                            <ReactMarkdown
                              key={index}
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
                              {part.text}
                            </ReactMarkdown>
                          );
                        }
                        if (part.type === "reasoning") {
                          return null;
                        }
                        return null;
                      }) || (
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

      {/* Starter Messages */}
      {messages.length === 0 && (
        <div className="flex flex-col gap-2 px-4 pt-2 pb-1 bg-background w-full">
          <div className="flex gap-2 flex-wrap">
            {starterMessages.map((msg, idx) => (
              <button
                key={msg}
                type="button"
                onClick={() => handleSendStarterMessage(msg)}
                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50
                  ${
                    idx % 2 === 0
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary text-secondary-foreground border-secondary"
                  }
                `}
                disabled={isLoading}
              >
                {msg}
              </button>
            ))}
          </div>
        </div>
      )}

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
