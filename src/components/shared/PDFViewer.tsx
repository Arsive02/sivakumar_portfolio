import { useState, useEffect } from 'react';
import { Download, X, ExternalLink, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title?: string;
}

const PDFViewer = ({ isOpen, onClose, pdfUrl, title = "Document" }: PDFViewerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mouseIdle, setMouseIdle] = useState(false);
  let mouseTimer: number | null = null;

  useEffect(() => {
    const handleMouseMove = () => {
      setMouseIdle(false);
      if (mouseTimer) {
        window.clearTimeout(mouseTimer);
      }
      mouseTimer = window.setTimeout(() => {
        setMouseIdle(true);
      }, 2000);
    };

    if (isOpen) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseTimer) {
        window.clearTimeout(mouseTimer);
      }
    };
  }, [isOpen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (document.fullscreenElement) {
          document.exitFullscreen();
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      {/* Header Controls */}
      <div 
        className={`absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent 
                   p-4 flex items-center justify-between transition-opacity duration-300 
                   ${mouseIdle ? 'opacity-0' : 'opacity-100'}`}
        onMouseEnter={() => setMouseIdle(false)}
      >
        <h2 className="text-white font-medium truncate flex-1">{title}</h2>
        <div className="flex items-center gap-2">
          {/* Download Button */}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              const link = document.createElement('a');
              link.href = pdfUrl;
              link.download = title;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
            title="Download PDF"
          >
            <Download className="w-5 h-5" />
          </Button>

          {/* Open in New Tab Button */}
          <Button
            size="icon"
            variant="ghost"
            asChild
            className="text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
            title="Open in new tab"
          >
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-5 h-5" />
            </a>
          </Button>

          {/* Fullscreen Toggle */}
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleFullscreen}
            className="text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </Button>

          {/* Close Button */}
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
            title="Close"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* PDF Display */}
      <ScrollArea className="h-full p-4">
        <iframe
          src={`${pdfUrl}#view=FitH`}
          className="w-full h-full min-h-screen rounded-lg border border-white/10 bg-white"
          title={title}
        />
      </ScrollArea>

      {/* Bottom Close Button */}
      <div 
        className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 
                   transition-opacity duration-300 ${mouseIdle ? 'opacity-0' : 'opacity-100'}`}
        onMouseEnter={() => setMouseIdle(false)}
      >
        <Button
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 text-white px-8 py-2 rounded-full 
                     backdrop-blur-sm transition-all duration-300 
                     hover:scale-105 active:scale-95"
        >
          Close Viewer
          <X className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default PDFViewer;