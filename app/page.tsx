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
  styleGuidelines
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
  const [imageAgentUserPrompt, setImageAgentUserPrompt] = useState<string>();
  const [agentLionUserPrompt, setAgentLionUserPrompt] = useState<string>();
  const [backgroundContext, setBackgroundContext] = useState<string>("");
  const [immediateSubject, setImmediateSubject] = useState<string>("");

  // useEffect for agentLionUserPrompt (existing) - only when streaming completes
  useEffect(() => {
    console.log("isLoading useEffect called:", isLoading);
    if (isLoading) {
      console.log("isLoading - still loading, skip");
      return;
    }
    if (messages.length === 0) {
      return;
    }
    const last3Messages = messages.slice(-3);
    const formattedMessages = last3Messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");
    console.log(`agentLionUserPrompt set to: ${formattedMessages.slice(0, 20)}...`);
    setAgentLionUserPrompt(formattedMessages);
  }, [isLoading]);

  // useEffect for backgroundContext - analyzes messages for story context (only when streaming completes)
  useEffect(() => {
    console.log("backgroundContext useEffect called");
    if (isLoading) {
      console.log("backgroundContext - still loading, skip");
      return;
    }
    if (messages.length === 0) {
      console.log("backgroundContext set to: (empty)");
      setBackgroundContext("");
      return;
    }

    // Only trigger when streaming completes
    const analyzeBackgroundContext = async () => {
      try {
        const formattedMessages = messages
          .map((msg) => `${msg.role}: ${msg.content}`)
          .join("\n");

        const response = await fetch('/api/groq', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            systemPrompt: "You are an expert at analyzing story content and creating background context descriptions for image generation. Based on the conversation history, create a concise background context description suitable for an AI image generation model.",
            userPrompt: `Analyze the following conversation and create an appropriate background context description for image generation that captures the story's setting, mood, and atmosphere:\n\n${formattedMessages}`,
          }),
        });
        const data = await response.json();
        const contextResult = data.content || "";
        console.log(`backgroundContext set to: ${contextResult.slice(0, 20)}...`);
        setBackgroundContext(contextResult);
      } catch (error) {
        console.error('Error analyzing background context:', error);
        console.log("backgroundContext set to: (error - empty)");
        setBackgroundContext("");
      }
    };

    analyzeBackgroundContext();
  }, [isLoading]); // Only trigger when message count changes (new messages added)

  // useEffect for immediateSubject - analyzes selectedText (only when not empty/null)
  useEffect(() => {
    console.log("selectionProps.selectedText useEffect called");
    if (!selectionProps.selectedText || selectionProps.selectedText.trim() === "") {
      console.log("immediateSubject set to: (empty)");
      setImmediateSubject("");
      return;
    }

    const analyzeImmediateSubject = async () => {
            console.log("analyzeImmediateSubject. sending selectionProps.selectedText to groq for analysis");
            console.log("   selectionProps.selectedText: " ,selectionProps.selectedText.slice(0, 100));

      try {
        const response = await fetch('/api/groq', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            systemPrompt: "You are an expert at analyzing text content and creating immediate subject descriptions for image generation. Based on the selected text, create a concise description of what should be the main subject/focus of an image.",
            userPrompt: `Analyze the following selected text and create an appropriate immediate subject description for image generation that captures the main focus, characters, or objects that should be prominently featured in the image:\n\n${selectionProps.selectedText}`,
          }),
        });
        const data = await response.json();
        const subjectResult = data.content || "";
                console.log("   groq subject result: " , subjectResult.slice(0, 100));
        console.log(`   immediateSubject set to: ${subjectResult.slice(0, 100)}...`);
        setImmediateSubject(subjectResult);
      } catch (error) {
        console.error('Error analyzing immediate subject:', error);
        console.log("immediateSubject set to: (error - empty)");
        setImmediateSubject("");
      }
    };

    analyzeImmediateSubject();
  }, [selectionProps.selectedText]);

  // useEffect to combine backgroundContext and immediateSubject into imageAgentUserPrompt
  useEffect(() => {
    console.log("imageAgentUserPrompt useEffect called");
    if (backgroundContext || immediateSubject) {
      const prompt = `Generate an image with the following background context: ${backgroundContext}. The immediate subject of the image should be: ${immediateSubject}. Please adhere to following styleguide: ${styleGuidelines}`;
      console.log(`   imageAgentUserPrompt set w ${prompt.length} characters: ${prompt.slice(0, 100)}...`);
      setImageAgentUserPrompt(prompt);
    } else {
      console.log("   imageAgentUserPrompt set to: undefined");
      setImageAgentUserPrompt(undefined);
    }
  }, [backgroundContext, immediateSubject]);

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
              <div className="row-span-1 bg-red-200 grid grid-cols-2">
                <div className="flex items-center justify-center">
                  <AgentCardFrog
                    name="Ribbit the Writer"
                    title="Creative Writing Assistant"
                    image="/frog.png"
                    welcomeMessage="I will help you build your story! Highlight the snippet of text you want me to add, then I will add it to your story."
                    userPrompt={selectionProps.selectedText || "hello"}
                    systemPrompt={agentFrogSystemPrompt}
                    isPopoverOpen={selectionProps.isPopoverOpen}
                  />
                </div>
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
                  name="AI Owl"
                  title="Language & Pronunciation Coach"
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