import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "preact/hooks";
import YouTubePreview from "./YouTubePreview";
import SvgGoPrevious from "./icons/GoPrevious";
import SvgGoNext from "./icons/GoNext";
import SvgClose from "./icons/Close";

const Screenshots = ({ images, videoUrl, nsfw }: { images: string[], videoUrl?: string, nsfw?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
   const [isRevealed, setIsRevealed] = useState(!nsfw);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setIsOpen(true)
  }

  const closeLightbox = () => {
    setIsOpen(false)
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex: number) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex: number) => (prevIndex - 1 + images.length) % images.length)
  }

  if (images.length === 0 && !videoUrl) {
    return <></>
  }

  return (
    <div class="relative">
      <div
        className={`absolute inset-0 backdrop-blur-md transition-opacity duration-300 ${
          isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="flex h-full items-center justify-center">
          <Button
            onClick={() => setIsRevealed(true)}
            className="text-lg font-semibold"
          >
            This app contains NSFW content, to click to reveal the screenshots.
          </Button>
        </div>
      </div>

      <div class="flex gap-4 overflow-x-auto items-end">
        {videoUrl && <YouTubePreview videoUrl={videoUrl} />}

        {
          images.map((image, index) => (
            <img
              class="max-h-96 max-w-96 h-auto w-auto rounded-2xl block border border-primary cursor-pointer"
              src={image}
              alt=""
              loading="lazy"
              onClick={() => openLightbox(index)}
            />
          ))
        }
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-(--breakpoint-lg) w-full h-screen flex items-center justify-center bg-primary/90 p-0 h-5/6 border-primary">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={images[currentImageIndex]}
              alt=""
              className="max-w-full max-h-full object-contain"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white"
              onClick={closeLightbox}
            >
              <SvgClose className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white"
              onClick={prevImage}
            >
              <SvgGoPrevious className="h-8 w-8" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
              onClick={nextImage}
            >
              <SvgGoNext className="h-8 w-8" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Screenshots;
