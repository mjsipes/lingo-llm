
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
// import AgentCard from "@/components/AgentCard";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

export default function Home() {
  const images = ["/owl2.png", "/lion2.png", "/bees.png"]

  return (
    <div className="h-screen overflow-hidden">
      <main className="grid grid-cols-3 h-screen">
        {/* Left Side - Main Chat (1/3) */}
        <div className="h-screen overflow-hidden">
          <Chat />
        </div>

        {/* Right Side - Eight Row Grid (2/3) */}
        <div className="col-span-2 grid grid-rows-8 p-4 gap-2 h-screen bg-gray-200">
          {/* Row 1: Agent Buttons */}
          <div className="row-span-1 ">
            agent buttons
          </div>

          {/* Row 2-5: Story Builder (4 rows) */}
          <div className="row-span-4 bg-red-500 grid grid-cols-2 min-h-0">
            <Textarea className="bg-white border-0 focus-visible:ring-0 rounded-none resize-none h-full"/>
            <div className="bg-blue-500 min-h-0">
              <ScrollArea className="h-full">
                <div className="p-4 grid grid-cols-2 gap-2">
                  {images.map((image) => (
                    <div key={image} className="w-full">
                      <Image src={image} alt="image" width={150} height={150} className="w-full h-auto" />
                    </div>
                  ))}
                  {/* Add more images to test scrolling */}
                  {images.map((image, index) => (
                    <div key={`${image}-${index}`} className="w-full">
                      <Image src={image} alt="image" width={150} height={150} className="w-full h-auto" />
                    </div>
                  ))}
                  {images.map((image, index) => (
                    <div key={`${image}-${index}-2`} className="w-full">
                      <Image src={image} alt="image" width={150} height={150} className="w-full h-auto" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Row 6-7: Empty space for tooltips (2 rows) */}
          <div className="row-span-2 bg-blue-500">
            {/* Reserved space for AI agent tooltip responses */}
          </div>

          {/* Row 8: Agent Controls */}
          <div className="row-span-1 bg-green-500 flex flex-row gap-2 items-center justify-center">
            {/* <AgentCard name="AI Owl" title="Language & Pronunciation Coach" image="/owl2.png" welcomeMessage="Hello! I will help spell out words. Highlight the text you want me to pronounce, then click on my icon!" />
            <AgentCard name="AI Owl" title="Language & Pronunciation Coach" image="/lion2.png" welcomeMessage="Hello! I will help spell out words. Highlight the text you want me to pronounce, then click on my icon!" />
            <AgentCard name="AI Owl" title="Language & Pronunciation Coach" image="/bees.png" welcomeMessage="Hello! I will help spell out words. Highlight the text you want me to pronounce, then click on my icon!" /> */}
          </div>
        </div>
      </main>
    </div>
  );
}