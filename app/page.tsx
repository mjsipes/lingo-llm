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
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Home() {
  const images = ["/owl2.png", "/lion2.png", "/bees.png"];

  return (
    <div className="h-screen overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="h-screen w-full">
        <ResizablePanel defaultSize={36} minSize={25} maxSize={50}>
          <div className="h-screen overflow-hidden">
            <Chat />
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
              <div className="row-span-1">agent buttons</div>
              {/* Row 2-5: Story Builder (4 rows) */}
              <div className="row-span-4 bg-red-500 grid grid-cols-2 min-h-0">
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
                      {/* Add more images to test scrolling */}
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
              {/* Row 6-7: Empty space for tooltips (2 rows) */}
              <div className="row-span-2 bg-blue-500">
                {/* Reserved space for AI agent tooltip responses */}
              </div>

              {/* Row 8: Agent Controls */}
              <div className="row-span-1 bg-green-500 flex flex-row gap-2 items-center justify-center">
                hello world
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
