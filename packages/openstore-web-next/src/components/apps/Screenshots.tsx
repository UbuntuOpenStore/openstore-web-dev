import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "preact/hooks";
import YouTubePreview from "./YouTubePreview";
import SvgGoPrevious from "../icons/GoPrevious";
import SvgGoNext from "../icons/GoNext";
import SvgClose from "../icons/Close";

const Screenshots = ({ images, videoUrl, nsfw, messages }: { images: string[], videoUrl?: string, nsfw?: boolean, messages: { nsfw: string } }) => {
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
        class={`absolute inset-0 backdrop-blur-md transition-opacity duration-300 ${
          isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div class="flex h-full items-center justify-center">
          <div
            onClick={() => setIsRevealed(true)}
            class="text-lg font-semibold max-w-full cursor-pointer p-2 rounded-xl bg-primary text-white"
          >
            {messages.nsfw}
          </div>
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
        <DialogContent class="max-w-full md:max-w-lg h-screen flex items-center justify-center bg-primary/90 p-0 md:h-5/6 border-primary" hideClose>
          <div class="relative w-full h-full flex items-center justify-center">
            <img
              src={images[currentImageIndex]}
              alt=""
              class="max-w-full max-h-full object-contain py-8 px-16"
            />

            <Button
              variant="ghost"
              size="icon"
              class="absolute top-4 right-4 text-white cursor-pointer"
              onClick={closeLightbox}
            >
              <SvgClose class="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
              onClick={prevImage}
            >
              <SvgGoPrevious class="h-8 w-8" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
              onClick={nextImage}
            >
              <SvgGoNext class="h-8 w-8" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Screenshots;
