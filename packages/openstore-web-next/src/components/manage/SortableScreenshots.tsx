import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableScreenshotItem from './SortableScreenshotItem';
import { useCallback, useState } from 'preact/hooks';

type SortableScreenshotsProps = {
  screenshots: string[],
  onUpdate: (screenshots: string[]) => void,
};

const SortableScreenshots = ({ screenshots, onUpdate }: SortableScreenshotsProps) => {

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: any) => {
    const {active, over} = event;

    if (active.id !== over.id) {
        const oldIndex = screenshots.indexOf(active.id);
        const newIndex = screenshots.indexOf(over.id);

        onUpdate(arrayMove(screenshots, oldIndex, newIndex));
    }
  }, []);

  const removeScreenshot = useCallback((screenshot: string) => {
    onUpdate(screenshots.filter((ss) => ss !== screenshot));
  }, []);

  return (
    <div class="flex flex-row gap-4 overflow-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={screenshots}
          strategy={horizontalListSortingStrategy}
        >
          {screenshots.map(screenshot => <SortableScreenshotItem key={screenshot} screenshot={screenshot} onRemove={() => removeScreenshot(screenshot)} />)}
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default SortableScreenshots;
