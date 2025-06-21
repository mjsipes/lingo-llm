"use client";

import { useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Chat } from "@/components/Chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import AgentCard from "@/components/AgentCard";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { toast } from "sonner";

export default function Home() {
  const images = ["/owl2.png", "/lion2.png", "/bees.png"];
  
  // Lifted chat state
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat();

  // Selected text state
  const [selectedText, setSelectedText] = useState('');
  
  useEffect(() => {
    const handleSelection = async () => {
      const selection = window.getSelection()?.toString() || '';
      setSelectedText(selection);
      if (selection) {
        console.log('Selected text:', selection);
        try {
          await navigator.clipboard.writeText(selection);
          console.log('Copied to clipboard');
        } catch (err) {
          console.log('Failed to copy');
        }
      }
    };
  
    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('keyup', handleSelection);
  
    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('keyup', handleSelection);
    };
  }, []);

  useEffect(() => {
    if (selectedText) {
      toast("Copied Text:", {
        description: selectedText.length > 50 ? `${selectedText.substring(0, 50)}...` : selectedText,
        position: "top-right",
      });
    }
   }, [selectedText]);

  return (
    <div className="h-screen overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="h-screen w-full">
        <ResizablePanel defaultSize={36} minSize={25} maxSize={50}>
          <div className="h-screen overflow-hidden">
            <Chat 
              messages={messages}
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              setMessages={setMessages}
              selectedText={selectedText}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75} className="h-full">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="py-[10px] border-b flex-shrink-0">
              <h1 className="text-4xl font-extrabold tracking-tight text-primary text-center">
                lingo llm
              </h1>
            </div>
            <div className="grid grid-rows-8 p-4 gap-2 flex-1 min-h-0 bg-gray-200">
              {/* Row 1: Agent Buttons */}
              <div className="row-span-1 bg-red-200">agent buttons</div>
              {/* Row 2-5: Story Builder (4 rows) */}
              <div className="row-span-6 bg-red-500 grid grid-cols-2 min-h-0">
                <Textarea className="bg-white border-0 focus-visible:ring-0 rounded-none resize-none h-full" />
                <div className="bg-blue-500 min-h-0">
                  <ScrollArea className="h-full">
                    <div className="p-4 grid grid-cols-2 gap-2">
                      {images.map((image) => (
                        <div key={image} className="w-full">
                          <Image
                            src={image}
                            alt="image"
                            width={150}
                            height={150}
                            className="w-full h-auto"
                          />
                        </div>
                      ))}
                      {images.map((image, index) => (
                        <div key={`${image}-${index}`} className="w-full">
                          <Image
                            src={image}
                            alt="image"
                            width={150}
                            height={150}
                            className="w-full h-auto"
                          />
                        </div>
                      ))}
                      {images.map((image, index) => (
                        <div key={`${image}-${index}-2`} className="w-full">
                          <Image
                            src={image}
                            alt="image"
                            width={150}
                            height={150}
                            className="w-full h-auto"
                          />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              {/* Row 8: Agent Controls */}
              <div className="row-span-1 bg-green-500 flex flex-row gap-2 items-center justify-center">
                <AgentCard 
                  name="AI Owl" 
                  title="Language & Pronunciation Coach" 
                  image="/owl2.png" 
                  welcomeMessage="Hello! I will help spell out words. Highlight the text you want me to pronounce, then click on my icon!"
                  messages={messages}
                  selectedText={selectedText}
                />
                <AgentCard 
                  name="AI Lion" 
                  title="Grammar & Translation Expert" 
                  image="/lion2.png" 
                  welcomeMessage="Hello! I will help with grammar and translation. Highlight the text you want me to analyze, then click on my icon!"
                  messages={messages}
                  selectedText={selectedText}
                />
                <AgentCard 
                  name="AI Bees" 
                  title="Vocabulary Builder" 
                  image="/bees.png" 
                  welcomeMessage="Hello! I will help with vocabulary building. Highlight the text you want me to explain, then click on my icon!"
                  messages={messages}
                  selectedText={selectedText}
                />
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}