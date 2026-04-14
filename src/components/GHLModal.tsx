import React, { useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface GHLModalProps {
  isOpen: boolean;
  onClose: () => void;
  embedCode?: string; // GoHighLevel embed code
}

export const GHLModal: React.FC<GHLModalProps> = ({ isOpen, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Load the GHL script
      const script = document.createElement('script');
      script.src = "https://knpllinks.joeyyap.com/js/form_embed.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        // Clean up script on close to prevent duplicates
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[95vh] overflow-y-auto p-0 border-none bg-[#4a0404] shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-none">
        <div className="relative bg-[#4a0404] overflow-hidden border-t-4 border-[#c5a059]">
          <DialogHeader className="p-8 pb-4">
            <DialogTitle className="text-3xl font-heading font-bold text-center uppercase tracking-tight text-[#c5a059]">Claim Your Free Spot</DialogTitle>
            <DialogDescription className="text-center font-light text-white/60 text-lg">
              Fill in your details below to receive your <span className="text-white font-medium">free ebook</span> and <span className="text-white font-medium">webinar ticket</span>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="w-full min-h-[675px] px-6 pb-10">
            <div className="bg-black/20 p-4 rounded-none border border-white/5">
              <iframe
                src="https://knpllinks.joeyyap.com/widget/form/XFhURQuOA0AZvBXeyTZ8"
                style={{ width: '100%', height: '675px', border: 'none' }}
                id="inline-XFhURQuOA0AZvBXeyTZ8" 
                data-layout="{'id':'INLINE'}"
                data-trigger-type="alwaysShow"
                data-form-name="The Art Of Date Selection - cody Test"
                data-height="675"
                data-layout-iframe-id="inline-XFhURQuOA0AZvBXeyTZ8"
                data-form-id="XFhURQuOA0AZvBXeyTZ8"
                title="The Art Of Date Selection - cody Test"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
