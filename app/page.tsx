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
import AgentCardFrog from "@/components/AgentCardFrog";
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
  
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat();

  const [selectedText, setSelectedText] = useState('');
  const [textareaContent, setTextareaContent] = useState('');
  
  useEffect(() => {
    const handleSelection = async () => {
      console.log("handleSelection triggered");
      const selection = window.getSelection()?.toString() || '';
      console.log(' selection: ', selection);
      setSelectedText(selection);
      if (selection) {
        try {
          await navigator.clipboard.writeText(selection);
          console.log(" copied to clipboard");
        } catch (err) {
          console.log(' failed to copy');
        }
      }
    };
   
    const handleMouseUp = () => {
      const selection = window.getSelection()?.toString();
      if (selection && selection.length > 0) {
        handleSelection();
      }
    };
   
    document.addEventListener('mouseup', handleMouseUp);
   
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
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

  const handleStoryBuilderResponse = (response: string) => {
    setTextareaContent(response);
  };

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
            <div className="py-[10px] border-b flex-shrink-0">
              <h1 className="text-4xl font-extrabold tracking-tight text-primary text-center">
                lingo llm
              </h1>
            </div>
            <div className="grid grid-rows-8 p-4 gap-2 flex-1 min-h-0 bg-gray-200">
              {/* upper row of agents */}
              <div className="row-span-1 bg-red-200 grid grid-cols-2">
  <div className="flex items-center justify-center">
    <AgentCardFrog 
      name="Ribbit the Writer" 
      title="Creative Writing Assistant" 
      image="/frog.png" 
      welcomeMessage="I'll help you build stories! Click me to generate content for your story."
      userPrompt="Generate a creative story opening based on the theme of adventure"
      systemPrompt="You are a creative writing assistant. Generate engaging story content that is appropriate for language learning. Keep responses concise and imaginative."
      onResponse={handleStoryBuilderResponse}
    />
  </div>
  <div className="flex items-center justify-center">
    <div>hi</div>
  </div>
</div>
              {/* story building area */}
              <div className="row-span-6 bg-red-500 grid grid-cols-2 min-h-0">
                <Textarea 
                  className="bg-white border-0 focus-visible:ring-0 rounded-none resize-none h-full" 
                  value={textareaContent}
                  onChange={(e) => setTextareaContent(e.target.value)}
                />
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

              <div className="row-span-1 bg-green-500 flex flex-row gap-10 items-center justify-center">
                <AgentCard 
                  name="AI Owl" 
                  title="Language & Pronunciation Coach" 
                  image="/owl2.png" 
                  welcomeMessage="Hello! I will help spell out words. Highlight the text you want me to pronounce, then click on my icon!"
                  userPrompt={selectedText || "Hello"}
                  systemPrompt="Pronounce the users text in a way for a child to understand. For example: hello = huh-LOH. Only respond with the pronunciation. Do not include any other text."
                />
                <AgentCard 
                  name="AI Lion" 
                  title="Grammar & Translation Expert" 
                  image="/lion2.png" 
                  welcomeMessage="Hello! I will help with grammar and translation. Highlight the text you want me to analyze, then click on my icon!"
                  userPrompt={selectedText || "hello"}
                  systemPrompt="respond in earth noises"
                />
                <AgentCard 
                  name="AI Bees" 
                  title="Vocabulary Builder" 
                  image="/bees.png" 
                  welcomeMessage="We will help send your book out to the world!"
                  userPrompt="make buzzing noises like a bee"
                  systemPrompt="make buzzing noises like a bee"
                />
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}