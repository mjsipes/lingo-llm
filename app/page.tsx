"use client";
import { useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Chat } from "@/components/Chat";
import AgentCard from "@/components/AgentCard";
import AgentCardFrog from "@/components/AgentCardFrog";
import ImageAgent from "@/components/ImageAgent";
import AgentCardOwl from "@/components/AgentCardOwl";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
  const [backgroundContext, setBackgroundContext] = useState<string>("");
  const [immediateSubject, setImmediateSubject] = useState<string>("");

  // Only trigger when streaming completes
  const analyzeBackgroundContext = async () => {
    try {
      const formattedMessages = messages
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n");
      const response = await fetch("/api/groq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemPrompt:
            "You summarize stories with great detail and imagery. Take the following story imput and output a brief 3-4 sentance background of the story at hand. Capture the stories setting, mood and atmosphere. Specifically output only the summary.",
          userPrompt: formattedMessages,
        }),
      });
      const data = await response.json();
      const contextResult = data.content || "";
      console.log(`backgroundContext set to: ${contextResult}...`);
      setBackgroundContext(contextResult);
    } catch (error) {
      console.error("Error analyzing background context:", error);
      console.log("backgroundContext set to: (error - empty)");
      setBackgroundContext("");
    }
  };

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
    analyzeBackgroundContext();
  }, [isLoading]); // Only trigger when message count changes (new messages added)

  const analyzeImmediateSubject = async () => {
    console.log(
      "analyzeImmediateSubject. sending following selectionProps.selectedText to groq for analysis: ",
      selectionProps.selectedText.slice(0, 100)
    );
    try {
      const response = await fetch("/api/groq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemPrompt:
            "You are an expert at analyzing text content and creating immediate subject descriptions for image generation. Based on the selected text, create a concise description of what should be the main subject/focus of an image.",
          userPrompt: `Analyze the following selected text and create an appropriate immediate subject description for image generation that captures the main focus, characters, or objects that should be prominently featured in the image:\n\n${selectionProps.selectedText}`,
        }),
      });
      const data = await response.json();
      const subjectResult = data.content || "";
      console.log(
        `   setting immediateSubject to groq result: ${subjectResult.slice(
          0,
          100
        )}...`
      );
      setImmediateSubject(subjectResult);
    } catch (error) {
      console.error("Error analyzing immediate subject:", error);
      console.log("immediateSubject set to: (error - empty)");
      setImmediateSubject("");
    }
  };

  // useEffect for immediateSubject - analyzes selectedText (only when not empty/null)
  useEffect(() => {
    console.log("selectionProps.selectedText useEffect called");
    if (
      !selectionProps.selectedText ||
      selectionProps.selectedText.trim() === ""
    ) {
      console.log("immediateSubject set to: (empty)");
      setImmediateSubject("");
      return;
    }
    analyzeImmediateSubject();
  }, [selectionProps.selectedText]);

  // useEffect to combine backgroundContext and immediateSubject into imageAgentUserPrompt
  useEffect(() => {
    console.log("backgroundContext immediateSubject useEffect called");
    if (backgroundContext || immediateSubject) {
      let prompt = "Generate an image";
      if (backgroundContext) {
        prompt += ` with the following background context: ${backgroundContext}`;
      }
      if (immediateSubject) {
        prompt += `. The immediate subject of the image should be: ${immediateSubject}`;
      }
      prompt += `. Please adhere to following styleguide: ${styleGuidelines}`;
      console.log(
        `   imageAgentUserPrompt set w ${
          prompt.length
        } characters: ${prompt.slice(0, 100)}...`
      );
      setImageAgentUserPrompt(prompt);
    } else {
      console.log("   imageAgentUserPrompt set to: undefined");
      setImageAgentUserPrompt(undefined);
    }
  }, [backgroundContext, immediateSubject]);
  const handleImageGenerated = (imageUrl: string) => {
    setImages((prev) => [...prev, imageUrl]);
  };

  const handleDeleteImage = (indexToDelete: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <SelectionPopover {...selectionProps} />

      {/* Header - fixed height */}
      <div className="py-[10px] border-b flex-shrink-0">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary text-center">
          lingo llm
        </h1>
      </div>

      {/* Resizable area - takes remaining height */}
      <div className="flex-1 min-h-0">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={50} minSize={40} maxSize={58}>
            <div className="h-full overflow-hidden">
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
          <ResizablePanel defaultSize={50} className="h-full">
            <div className="flex flex-col h-full">
              {/* Image Agents Row */}
              <div className="flex-shrink-0 flex flex-row gap-4 items-center justify-center pt-4">
                <ImageAgent
                  name="Palette the Camel"
                  title="Creative Painter"
                  image="/camel.png"
                  welcomeMessage="Hi! I'm really good at making awesome pictures for your stories!"
                  userPrompt={imageAgentUserPrompt || camelSelfPortraitPrompt}
                  systemPrompt={agentPandaSystemPrompt}
                  onImageGenerated={handleImageGenerated}
                  image_model="dall-e-3"
                />
                <ImageAgent
                  name="Panda the Painter"
                  title="Creative Painter"
                  image="/panda.png"
                  welcomeMessage="Hi! I'm learning to paint and I love making cute, fun pictures that might be a little silly!"
                  userPrompt={imageAgentUserPrompt || pandaSelfPortraitPrompt}
                  systemPrompt={agentPandaSystemPrompt}
                  onImageGenerated={handleImageGenerated}
                  image_model="dall-e-2"
                />
              </div>

              {/* Image Gallery - takes most space */}
              <div className="flex-1 min-h-0 px-4 py-3">
                <div className="bg-sky-100 h-full rounded-lg">
                  <ScrollArea className="h-full">
                    <div className="p-4">
                      <div className="grid grid-cols-4 gap-2">
                        {images.map((image, index) => (
                          <div key={`${image}-${index}`} className="w-full">
                            <Popover>
                              <PopoverTrigger asChild>
                                <div className="cursor-pointer relative rounded-lg overflow-hidden">
                                  <Image
                                    src={image}
                                    alt="Generated artwork"
                                    width={150}
                                    height={150}
                                    className="w-full h-auto"
                                  />
                                </div>
                              </PopoverTrigger>

                              <PopoverContent
                                className="w-auto p-0 border-0"
                                side="right"
                              >
                                <div className="relative">
                                  <Image
                                    src={image}
                                    alt="Generated artwork - enlarged"
                                    width={480}
                                    height={480}
                                    className="rounded-lg"
                                  />
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>

              {/* Supporting Characters Row */}
              <div className="flex-shrink-0 flex flex-row gap-4 items-center justify-center p-4">
                <AgentCardOwl
                  name="OW-el "
                  title="Pronunciation Coach"
                  image="/owl2.png"
                  welcomeMessage="Hi there! I'll help you learn how to say words out loud. Copy any text and click on me!"
                  userPrompt={selectionProps.selectedText || "Hello"}
                  systemPrompt={agentOwlSystemPrompt}
                  isPopoverOpen={selectionProps.isPopoverOpen}
                />
                <AgentCard
                  name="Simon"
                  title="Constructive Critic"
                  image="/lion2.png"
                  welcomeMessage="Hello! I help make your stories even better by giving you helpful tips and ideas."
                  userPrompt={backgroundContext || "hello"}
                  systemPrompt={agentLionSystemPrompt}
                  isPopoverOpen={selectionProps.isPopoverOpen}
                />
                <AgentCard
                  name="Ribbit"
                  title="Creative Writing Assistant"
                  image="/frog.png"
                  welcomeMessage="I love to give ideas about what fun things could happen next in your story!"
                  userPrompt={backgroundContext || "hello"}
                  systemPrompt={agentFrogSystemPrompt}
                  isPopoverOpen={selectionProps.isPopoverOpen}
                />
                <AgentCard
                  name="AI Bees"
                  title="Task Masters"
                  image="/bees.png"
                  welcomeMessage="Buzz buzz! We will help turn your story into a book you can share with the world!"
                  userPrompt="make buzzing noises like a bee"
                  systemPrompt={agentBeeSystemPrompt}
                  isPopoverOpen={selectionProps.isPopoverOpen}
                />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
