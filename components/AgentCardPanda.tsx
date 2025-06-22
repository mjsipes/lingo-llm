"use client";
import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChat } from "@ai-sdk/react";

const AgentCardPanda = ({
  name,
  title,
  image,
  welcomeMessage,
  systemPrompt,
  userPrompt,
  onResponse,
}: {
  name: string;
  title: string;
  image: string;
  welcomeMessage: string;
  systemPrompt: string;
  userPrompt: string;
  onResponse?: (response: string) => void;
}) => {

  const { messages, append, isLoading , setMessages} = useChat({
    api: '/api/chat',
    body: {
      model: 'groq',
      systemPrompt: systemPrompt,
    },
    onFinish: (message) => {
      if (onResponse) {
        onResponse(message.content);
      }
    }
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log(`Sending message to ${name}: \n System Prompt: ${systemPrompt} \n User Prompt: ${userPrompt}`);
    if (isLoading) return;
    setIsOpen(true);
    setMessages([]);
    await append({
      id: Date.now().toString(),
      role: 'user',
      content: userPrompt
    });
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Tooltip open={isOpen} onOpenChange={handleOpenChange}>
      <TooltipTrigger asChild>
        <Button className="py-8" onClick={handleClick}>
          <Avatar className="h-12 w-12">
            <AvatarImage src={image} />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <h1>{name}</h1>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="flex flex-row gap-4">
        <img
          src={image}
          alt={`${name} avatar`}
          className="h-48 w-48 rounded-md"
        />
        <div className="gap-2">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-white">
              {name}
            </h4>
            <span className="text-sm font-medium text-white">{title}</span>
{/* 
          <div className="w-[200px] h-[160px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-white/80 text-xs">{welcomeMessage}</div>
            ) : (
              <div>
                {(() => {
                  const lastAiMessage = messages.filter(m => m.role === 'assistant').pop();
                  return lastAiMessage ? (
                    <span className="text-white text-xs">
                      {lastAiMessage.content}
                    </span>
                  ) : null;
                })()}
              </div>
            )}
          </div> */}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default AgentCardPanda;