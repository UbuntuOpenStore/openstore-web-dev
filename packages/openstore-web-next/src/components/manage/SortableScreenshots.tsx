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

const SortableScreenshots = ({ screenshots }: { screenshots: string[] }) => {
  const [sortedScreenshots, setSortedScreenshots] = useState(screenshots);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: any) => {
    const {active, over} = event;

    if (active.id !== over.id) {
      setSortedScreenshots((sortedScreenshots) => {
        const oldIndex = sortedScreenshots.indexOf(active.id);
        const newIndex = sortedScreenshots.indexOf(over.id);

        return arrayMove(sortedScreenshots, oldIndex, newIndex);
      });
    }
  }, []);

  const removeScreenshot = useCallback((screenshot: string) => {
    setSortedScreenshots((sortedScreenshots) => {
      return sortedScreenshots.filter((ss) => ss !== screenshot);
    });
  }, []);

  return (
    <div class="flex flex-row gap-4 overflow-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedScreenshots}
          strategy={horizontalListSortingStrategy}
        >
          {sortedScreenshots.map(screenshot => <SortableScreenshotItem key={screenshot} screenshot={screenshot} onRemove={() => removeScreenshot(screenshot)} />)}
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default SortableScreenshots;
