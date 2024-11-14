import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Channel, Channels, type AppData } from "@/lib/schema";

function formatChannel(channel: string) {
  return channel.charAt(0).toUpperCase() + channel.substring(1);
}

const DownloadDialog = ({ app } : { app: AppData }) => {
  const downloads = app.downloads.filter((download) => Channels.includes(download.channel as Channel) && download.download_url && download.architecture);

  if (downloads.length === 0) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button class="btn w-full bg-ubuntu-purple text-white font-bold">Download</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-4">Download {app.name}</DialogTitle>
            <div class="mt-4 space-y-4">
              {downloads.map((download) => (
                <a href={download.download_url!} target="_blank" class="btn w-full bg-ubuntu-purple text-white font-bold">
                  {formatChannel(download.channel)} v{download.version} ({download.architecture})
                </a>
              ))}
            </div>

            <div class="pt-4 text-center">
              <a href={`/apps/${app.id}/versions`} class="underline">Older versions</a>
            </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default DownloadDialog;
