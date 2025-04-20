
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import Chatbot from "./Chatbot";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const FloatingChatButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMobile, setShowMobile] = useState(false);

  // For mobile, we'll use Dialog
  // For desktop, we'll use direct rendering with animation
  return (
    <>
      {/* Desktop version */}
      <div className="fixed bottom-4 right-4 z-50 hidden md:block">
        {isExpanded ? (
          <div className="w-96 shadow-xl rounded-lg overflow-hidden transition-all duration-300 ease-in-out">
            <Chatbot expanded onClose={() => setIsExpanded(false)} />
          </div>
        ) : (
          <Button
            className="rounded-full h-14 w-14 flex items-center justify-center shadow-lg"
            onClick={() => setIsExpanded(true)}
          >
            <MessageCircle size={24} />
          </Button>
        )}
      </div>

      {/* Mobile version */}
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        <Dialog open={showMobile} onOpenChange={setShowMobile}>
          <DialogTrigger asChild>
            <Button
              className="rounded-full h-14 w-14 flex items-center justify-center shadow-lg"
            >
              <MessageCircle size={24} />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] p-0">
            <Chatbot expanded />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default FloatingChatButton;
