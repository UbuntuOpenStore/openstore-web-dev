import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import SvgFilters from "./icons/Filters";
import { AppType } from "@/lib/schema";
import { useCallback, useState } from "preact/hooks";

type FilterDialogProps = {
  type: AppType | '';
  showNsfw: boolean;
  onChange: (type: AppType | '', showNsfw: boolean) => void;
  messages: {
    all: string,
    apps: string,
    bookmarks: string,
    webapps: string
    filter: string,
    showNsfwFilter: string,
  }
};

const FilterDialog = ({ type, showNsfw, onChange, messages } : FilterDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const onChangeWrapper = useCallback((type: AppType | '', showNsfw: boolean) => {
    onChange(type, showNsfw);
    setIsOpen(false);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button onClick={() => setIsOpen(true)} class="cursor-pointer">
          <SvgFilters class="ml-4 mt-2" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-4">{messages.filter}</DialogTitle>
            <div class="space-y-4 text-sm text-neutral-500">
              <div class="flex items-center space-x-2">
                <input type="radio" checked={!type} onClick={() => onChangeWrapper('', showNsfw)} id="all" />
                <label for="all">{messages.all}</label>
              </div>

              <div class="flex items-center space-x-2">
                <input type="radio" checked={type === AppType.APP} onClick={() => onChangeWrapper(AppType.APP, showNsfw)} id="apps" />
                <label for="apps">{messages.apps}</label>
              </div>

              <div class="flex items-center space-x-2">
                <input type="radio" checked={type === AppType.BOOKMARK} onClick={() => onChangeWrapper(AppType.BOOKMARK, showNsfw)} id="bookmarks" />
                <label for="bookmarks">{messages.bookmarks}</label>
              </div>

              <div class="flex items-center space-x-2">
                <input type="radio" checked={type === AppType.WEBAPP} onClick={() => onChangeWrapper(AppType.WEBAPP, showNsfw)} id="web-apps" />
                <label for="web-apps">{messages.webapps}</label>
              </div>

              <div class="w-full h-[1px] bg-ubuntu-gradient rounded-full" />

              <div class="flex items-center space-x-2">
                <input type="checkbox" checked={showNsfw} onChange={() => onChangeWrapper(type, !showNsfw)} id="show-nsfw" />
                <label for="show-nsfw">{messages.showNsfwFilter}</label>
              </div>
            </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default FilterDialog;
