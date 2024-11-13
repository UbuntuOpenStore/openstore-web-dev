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
};

const FilterDialog = ({ type, onChange } : FilterDialogProps) => {
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
          <DialogTitle className="mb-4">Filter by Type</DialogTitle>
            <div class="space-y-4 text-sm text-neutral-500">
              <div class="flex items-center space-x-2">
                <input type="radio" checked={!type} onClick={() => onChangeWrapper('')} id="all" />
                <label for="all">All Types</label>
              </div>

              <div class="flex items-center space-x-2">
                <input type="radio" checked={type === AppType.APP} onClick={() => onChangeWrapper(AppType.APP)} id="apps" />
                <label for="apps">Apps</label>
              </div>

              <div class="flex items-center space-x-2">
                <input type="radio" checked={type === AppType.BOOKMARK} onClick={() => onChangeWrapper(AppType.BOOKMARK)} id="bookmarks" />
                <label for="bookmarks">Bookmarks</label>
              </div>

              <div class="flex items-center space-x-2">
                <input type="radio" checked={type === AppType.WEBAPP} onClick={() => onChangeWrapper(AppType.WEBAPP)} id="web-apps" />
                <label for="web-apps">Web Apps</label>
              </div>
            </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default FilterDialog;
