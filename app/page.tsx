"use client";
import { useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Chat } from "@/components/Chat";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import AgentCard from "@/components/AgentCard";
import AgentCardFrog from "@/components/AgentCardFrog";
import ImageAgent from "@/components/ImageAgent";
import AgentCardOwl from "@/components/AgentCardOwl";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { toast } from "sonner";
import { Copy } from "lucide-react";
import {
  agentPandaSystemPrompt,
  agentBeeSystemPrompt,
  agentLionSystemPrompt,
  agentOwlSystemPrompt,
  agentFrogSystemPrompt,
  camelSelfPortraitPrompt,
  pandaSelfPortraitPrompt,
  styleGuidelines
} from "@/components/clientSystemPrompts";

export default function Home() {
  // application state
  const [images, setImages] = useState([
    "/owl2.png",
    "/lion2.png",
    "/bees.png",
  ]);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat();
  const [selectedText, setSelectedText] = useState("");


  const [imageAgentUserPrompt, setImageAgentUserPrompt] = useState() ;
  const [agentLionUserPrompt, setAgentLionUserPrompt] = useState<string>();
  
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [triggerPosition, setTriggerPosition] = useState({ x: 0, y: 0 });
  const [isUpperHalf, setIsUpperHalf] = useState(true);
  

  useEffect(() => {
    if (messages.length === 0) {
      return;
    }
    const last3Messages = messages.slice(-3);
    const formattedMessages = last3Messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");
    setAgentLionUserPrompt(formattedMessages);
  }, [messages]);

  // Listen for text selection events and show copy popover when text is highlighted
useEffect(() => {
  const handleMouseUp = () => {
    setTimeout(() => {
      const selection = window.getSelection();
      const selectionText = selection?.toString();
      if (selectionText && selectionText.length > 0 && selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const upperHalf = rect.bottom < viewportHeight / 2;
        setIsUpperHalf(upperHalf);
        setTriggerPosition({
          x: rect.left + rect.width / 2,
          y: upperHalf ? rect.bottom + 5 : rect.top - 5,
        });
        setSelectedText(selectionText);
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

  // Copy selected text to clipboard and trigger toast notification
  const handleCopyClick = async () => {
    const selection = window.getSelection()?.toString() || "";
    if (selection) {
      try {
        await navigator.clipboard.writeText(selection);
        console.log("setting selected text to ", selection);
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
      } catch (err) {
        console.log("Failed to copy");
      }
    }
  };

  const handleImageGenerated = (imageUrl: string) => {
    setImages((prev) => [...prev, imageUrl]);
  };

  //page
  return (
    <div className="h-screen overflow-hidden">
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          {/* Position trigger at the selection coordinates */}
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
      <ResizablePanelGroup direction="horizontal" className="h-screen w-full">
        <ResizablePanel defaultSize={36} minSize={25} maxSize={50}>
          {/* chat */}
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
        <ResizablePanel defaultSize={66} className="h-full">
          <div className="flex flex-col h-full">
            {/* header */}
            <div className="py-[10px] border-b flex-shrink-0">
              <h1 className="text-4xl font-extrabold tracking-tight text-primary text-center">
                lingo llm
              </h1>
            </div>
            {/* grid */}
            <div className="grid grid-rows-8 p-4 gap-2 flex-1 min-h-0 bg-gray-200">
              {/* upper row of agents */}
              <div className="row-span-1 bg-red-200 grid grid-cols-2">
                {/* AgentCardFrog */}
                <div className="flex items-center justify-center">
                  <AgentCardFrog
                    name="Ribbit the Writer"
                    title="Creative Writing Assistant"
                    image="/frog.png"
                    welcomeMessage="I will help you build your story! Highlight the snippet of text you want me to add, then I will add it to your story."
                    userPrompt={selectedText || "hello"}
                    systemPrompt={agentFrogSystemPrompt}
                    isPopoverOpen={isPopoverOpen}
                  />
                </div>
                {/* ImageAgent */}
                <div className="flex items-center justify-center">
                  <ImageAgent
                    name="Palette the Camel"
                    title="Creative Painter"
                    image="/camel.png"
                    welcomeMessage="I will help you create an image!"
                    userPrompt={imageAgentUserPrompt || camelSelfPortraitPrompt}
                    systemPrompt={agentPandaSystemPrompt}
                    onImageGenerated={handleImageGenerated}
                    image_model="dall-e-3"
                  />
                  <ImageAgent
                    name="Panda the Painter"
                    title="Creative Painter"
                    image="/panda.png"
                    welcomeMessage="I will help you create an image!"
                    userPrompt={imageAgentUserPrompt || pandaSelfPortraitPrompt}
                    systemPrompt={agentPandaSystemPrompt}
                    onImageGenerated={handleImageGenerated}
                    image_model="dall-e-2"
                  />
                </div>
              </div>
              {/* story building area */}
              <div className="row-span-6 bg-red-500 grid grid-cols-2 min-h-0">
                <div className="bg-blue-500 min-h-0 col-span-2">
                  <ScrollArea className="h-full">
                    <div className="p-4 grid grid-cols-4 gap-2">
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
                    </div>
                  </ScrollArea>
                </div>
              </div>
              {/* bottom row of agents */}
              <div className="row-span-1 bg-green-500 flex flex-row gap-10 items-center justify-center">
                <AgentCardOwl
                  name="AI Owl"
                  title="Language & Pronunciation Coach"
                  image="/owl2.png"
                  welcomeMessage="Hello! I will help spell out words. Highlight the text you want me to pronounce, then click on my icon!"
                  userPrompt={selectedText || "Hello"}
                  systemPrompt={agentOwlSystemPrompt}
                  isPopoverOpen={isPopoverOpen}
                />
                <AgentCard
                  name="AI Lion"
                  title="Constructive Critic"
                  image="/lion2.png"
                  welcomeMessage="Hello! I specialize in providing thoughtful feedback and constructive criticism on your story."
                  userPrompt={agentLionUserPrompt || "hello"}
                  systemPrompt={agentLionSystemPrompt}
                  isPopoverOpen={isPopoverOpen}
                />
                <AgentCard
                  name="AI Bees"
                  title="Vocabulary Builder"
                  image="/bees.png"
                  welcomeMessage="We will help send your book out to the world!"
                  userPrompt="make buzzing noises like a bee"
                  systemPrompt={agentBeeSystemPrompt}
                  isPopoverOpen={isPopoverOpen}
                />
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
