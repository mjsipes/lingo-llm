"use client";
import { useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Chat } from "@/components/Chat";
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
import { useTextSelection, SelectionPopover } from "@/components/CopyClick";
import {
  agentPandaSystemPrompt,
  agentBeeSystemPrompt,
  agentLionSystemPrompt,
  agentOwlSystemPrompt,
  agentFrogSystemPrompt,
  camelSelfPortraitPrompt,
  pandaSelfPortraitPrompt,
  styleGuidelines,
} from "@/components/clientSystemPrompts";

export default function Home() {
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

  const selectionProps = useTextSelection();
  const [imageAgentUserPrompt, setImageAgentUserPrompt] = useState();
  const [agentLionUserPrompt, setAgentLionUserPrompt] = useState<string>();

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

  const handleImageGenerated = (imageUrl: string) => {
    setImages((prev) => [...prev, imageUrl]);
  };

  return (
    <div className="h-screen overflow-hidden">
      <SelectionPopover {...selectionProps} />
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
              selectedText={selectionProps.selectedText}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={66} className="h-full">
          <div className="flex flex-col h-full">
            <div className="py-[10px] border-b flex-shrink-0">
              <h1 className="text-4xl font-extrabold tracking-tight text-primary text-center">
                lingo llm
              </h1>
            </div>
            <div className="grid grid-rows-8 p-4 gap-2 flex-1 min-h-0 bg-gray-200">
              <div className="row-span-1 bg-red-200 flex-row gap-10 flex items-center justify-center">
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
              <div className="row-span-1 bg-green-500 flex flex-row gap-10 items-center justify-center">
                <AgentCardOwl
                  name="OW-el "
                  title="Pronunciation Coach"
                  image="/owl2.png"
                  welcomeMessage="Hello! I will help spell out words. Highlight the text you want me to pronounce, then click on my icon!"
                  userPrompt={selectionProps.selectedText || "Hello"}
                  systemPrompt={agentOwlSystemPrompt}
                  isPopoverOpen={selectionProps.isPopoverOpen}
                />
                <AgentCard
                  name="AI Lion"
                  title="Constructive Critic"
                  image="/lion2.png"
                  welcomeMessage="Hello! I specialize in providing thoughtful feedback and constructive criticism on your story."
                  userPrompt={agentLionUserPrompt || "hello"}
                  systemPrompt={agentLionSystemPrompt}
                  isPopoverOpen={selectionProps.isPopoverOpen}
                />
                <AgentCardFrog
                  name="Ribbit"
                  title="Creative Writing Assistant"
                  image="/frog.png"
                  welcomeMessage="I love to give ideas on what direction your story should go."
                  userPrompt={selectionProps.selectedText || "hello"}
                  systemPrompt={agentFrogSystemPrompt}
                  isPopoverOpen={selectionProps.isPopoverOpen}
                />
                <AgentCard
                  name="AI Bees"
                  title="Vocabulary Builder"
                  image="/bees.png"
                  welcomeMessage="We will help send your book out to the world!"
                  userPrompt="make buzzing noises like a bee"
                  systemPrompt={agentBeeSystemPrompt}
                  isPopoverOpen={selectionProps.isPopoverOpen}
                />
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
