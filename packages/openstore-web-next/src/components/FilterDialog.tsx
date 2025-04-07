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
  onChange: (type: AppType | '') => void;
  messages: {
    all: string,
    apps: string,
    bookmarks: string,
    webapps: string
    filter: string,
  }
};

const FilterDialog = ({ type, onChange, messages } : FilterDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const onChangeWrapper = useCallback((type: AppType | '') => {
    onChange(type);
    setIsOpen(false);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button onClick={() => setIsOpen(true)}>
          <SvgFilters class="ml-4 mt-2" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-4">{messages.filter}</DialogTitle>
            <div class="space-y-4 text-sm text-neutral-500">
              <div class="flex items-center space-x-2">
                <input type="radio" checked={!type} onClick={() => onChangeWrapper('')} id="all" />
                <label for="all">{messages.all}</label>
              </div>

              <div class="flex items-center space-x-2">
                <input type="radio" checked={type === AppType.APP} onClick={() => onChangeWrapper(AppType.APP)} id="apps" />
                <label for="apps">{messages.apps}</label>
              </div>

              <div class="flex items-center space-x-2">
                <input type="radio" checked={type === AppType.BOOKMARK} onClick={() => onChangeWrapper(AppType.BOOKMARK)} id="bookmarks" />
                <label for="bookmarks">{messages.bookmarks}</label>
              </div>

              <div class="flex items-center space-x-2">
                <input type="radio" checked={type === AppType.WEBAPP} onClick={() => onChangeWrapper(AppType.WEBAPP)} id="web-apps" />
                <label for="web-apps">{messages.webapps}</label>
              </div>
            </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default FilterDialog;
