import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

const SortableScreenshotItem = ({ screenshot }: { screenshot: string }) => {
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
    <div ref={setNodeRef} style={style} {...attributes as any} {...listeners}>
      <img src={screenshot} alt="" loading="lazy" class="max-h-36 max-w-36 h-auto w-auto rounded-2xl block border border-primary" />
      <input type="hidden" name="screenshots[]" value={screenshot} />
    </div>
  );
}

export default SortableScreenshotItem;
