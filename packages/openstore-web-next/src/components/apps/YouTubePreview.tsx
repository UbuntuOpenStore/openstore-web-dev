import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "preact/hooks";
import SvgPlay from "../icons/Play";

const getVideoId = (url: string): string => {
  const embedMatch = url.match(/\/embed\/([^/?]+)/)
  if (embedMatch) return embedMatch[1]

  const watchMatch = url.match(/[?&]v=([^&]+)/)
  if (watchMatch) return watchMatch[1]

  return ''
}

const YouTubePreview = ({ videoUrl }: { videoUrl: string }) => {
  const [isOpen, setIsOpen] = useState(false)

  const videoId = getVideoId(videoUrl)
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : ''
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : '/placeholder.svg?height=480&width=640'

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button class="relative group overflow-hidden rounded-2xl shadow-lg focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-opacity-50">
          <img
            src={thumbnailUrl}
            alt="Video thumbnail"
            class="w-full h-auto object-cover"
          />
          <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <SvgPlay class="w-16 h-16 text-white" />
          </div>
          <span class="sr-only">Play video</span>
        </button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[800px] p-0 h-1/2 border-primary">
        <div class="aspect-w-16 aspect-h-9">
          {embedUrl && (
            <iframe
              src={embedUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              class="w-full h-full"
            ></iframe>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default YouTubePreview;
