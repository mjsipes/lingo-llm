"use client";
import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const ImageAgent = ({
  name,
  image,
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

  const handleClick = async (e: React.MouseEvent) => {
    console.log("clicked. sending req to image api");
    e.preventDefault();
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
          model: image_model,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      const imageUrl = data.imageUrl;
      console.log("image recieved, adding url to array");

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
        <div className="relative">
          <Button 
            className="py-8" 
            onClick={handleClick} 
            disabled={isLoading}
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={image} />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <h1>{name}</h1>
          </Button>
          {isLoading && (
            <Skeleton
  className="absolute inset-0 rounded-md"
  style={{ opacity: 0.015 }}
/>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent className="flex flex-row gap-4">
        <img
          src={image}
          alt={`${name} avatar`}
          className="h-48 w-48 rounded-md"
        />
      </TooltipContent>
    </Tooltip>
  );
};

export default ImageAgent;