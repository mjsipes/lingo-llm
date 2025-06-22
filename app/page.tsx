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
import AgentCardPanda from "@/components/AgentCardPanda";
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
  // application state
  const [images, setImages] = useState(["/owl2.png", "/lion2.png", "/bees.png"]);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat();
  const [selectedText, setSelectedText] = useState("");
  const [textareaContent, setTextareaContent] = useState("");

  // use effects
  useEffect(() => {
    const handleSelection = async () => {
      console.log("handleSelection triggered");
      const selection = window.getSelection()?.toString() || "";
      console.log(" selection: ", selection);
      setSelectedText(selection);
      if (selection) {
        try {
          await navigator.clipboard.writeText(selection);
          console.log(" copied to clipboard");
        } catch (err) {
          console.log(" failed to copy");
        }
      }
    };
    const handleMouseUp = () => {
      const selection = window.getSelection()?.toString();
      if (selection && selection.length > 0) {
        handleSelection();
      }
    };
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (selectedText) {
      toast("Copied Text:", {
        description:
          selectedText.length > 50
            ? `${selectedText.substring(0, 50)}...`
            : selectedText,
        position: "top-right",
      });
    }
  }, [selectedText]);

  const handleStoryBuilderResponse = (response: string) => {
    setTextareaContent(prev => prev + response);
  };

  const handleImageGenerated = (imageUrl: string) => {
    setImages(prev => [...prev, imageUrl]);
  };

  //page
  return (
    <div className="h-screen overflow-hidden">
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
                    systemPrompt="You are a creative writing assistant. Your response will be directly added to a story in a text box. Please only output the info from the user prompt."
                    onResponse={handleStoryBuilderResponse}
                  />
                </div>
                {/* AgentCardPanda */}
                <div className="flex items-center justify-center">
                  <AgentCardPanda
                    name="Panda the Painter"
                    title="Creative Painter"
                    image="/panda.png"
                    welcomeMessage="I will help you create an image!"
                    userPrompt={selectedText || "a cute panda painting"}
                    systemPrompt={agentPandaCardSystemPrompt}
                    onImageGenerated={handleImageGenerated}
                  />
                </div>
              </div>
              {/* story building area */}
              <div className="row-span-6 bg-red-500 grid grid-cols-2 min-h-0">
                {/* <Textarea
                  className="bg-white border-0 focus-visible:ring-0 rounded-none resize-none h-full"
                  value={textareaContent}
                  onChange={(e) => setTextareaContent(e.target.value)}
                /> */}
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


const agentPandaCardSystemPrompt  = `You are a creative image generation assistant.

All characters are illustrated in a cinematic cartoon style that feels cohesive, expressive, and friendly — ideal for a learning platform for children. The visual tone is inspired by the charm of modern animated films with a soft, polished look that appeals to both kids and adults.

Core Style Attributes:
- Clean line art with polished outlines
- Vector-style cartoon illustration
- Soft, rounded shapes for all body features
- Large, expressive eyes that convey warmth and personality
- Gentle blush on cheeks for approachability
- Warm, soft lighting that casts subtle, cozy shadows under characters
- White background only, subtly textured with minimal gradients or abstract ambient shapes (like clouds, blobs, or sparkles), keeping the focus on the character
- Navy blue business suits with white shirts and black ties (unless the role calls for a specific variation, like rolled-up sleeves or art splatters)
- Each character includes a prop or pose that reinforces their role, such as:
  - Microphones for translators
  - Paintbrushes for artists
  - Notebooks for critics
  - Floating ideas for dreamers
  - Multiple objects being juggled by multitaskers

Overall Vibe:
- Professional but playful – they look like a kid-friendly startup crew
- Cohesive and stylized, as if they all come from the same cinematic universe
- Designed to be immediately readable, engaging, and emotionally expressive for children in an educational setting`
