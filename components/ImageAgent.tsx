"use client";
import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ImageAgent = ({
  name,
  title,
  image,
  welcomeMessage,
  systemPrompt,
  userPrompt,
  isPopoverOpen,
  image_model,
  onImageGenerated,
}: {
  name: string;
  title: string;
  image: string;
  welcomeMessage: string;
  systemPrompt: string;
  userPrompt: string;
  isPopoverOpen?: boolean;
  image_model: string;

  onImageGenerated?: (imageUrl: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastGeneratedImage, setLastGeneratedImage] = useState<string | null>(
    null
  );

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log(`Generating image with prompt: ${userPrompt}`);

    if (isLoading) return;

    setIsOpen(true);
    setIsLoading(true);

    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userPrompt,
          model: image_model
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      const imageUrl = data.imageUrl;

      setLastGeneratedImage(imageUrl);

      if (onImageGenerated) {
        onImageGenerated(imageUrl);
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && isPopoverOpen) {
      return;
    }
    setIsOpen(open);
  };

  return (
    <Tooltip open={isOpen} onOpenChange={handleOpenChange}>
      <TooltipTrigger asChild>
        <Button className="py-8" onClick={handleClick} disabled={isLoading}>
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
        {/* <div className="gap-2">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-white">
            {name}
          </h4>
          <span className="text-sm font-medium text-white">{title}</span>
          
        </div> */}
      </TooltipContent>
    </Tooltip>
  );
};

export default ImageAgent;
