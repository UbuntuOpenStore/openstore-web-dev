import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import SvgClose from '../icons/Close';

type SortableScreenshotItemProps = {
  screenshot: string;
  onRemove: () => void;
}

const SortableScreenshotItem = ({ screenshot, onRemove }: SortableScreenshotItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: screenshot  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} class="relative">
      <div class="absolute top-0 right-0 p-1 bg-gray-200/60 cursor-pointer rounded-tr-2xl" onClick={onRemove}>
        <SvgClose />
      </div>

      <div {...attributes as any} {...listeners} class="cursor-move">
        <img src={screenshot} alt="" loading="lazy" class="max-h-36 max-w-36 h-auto w-auto rounded-2xl block border border-primary" />
        <input type="hidden" name="screenshots" value={screenshot} />
      </div>
    </div>
  );
}

export default SortableScreenshotItem;
