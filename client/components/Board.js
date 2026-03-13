import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import List from "./List";

function parseId(id) {
  if (typeof id !== "string") return { type: null, value: null };
  const [type, value] = id.split("-");
  return { type, value: Number(value) };
}

export default function Board({
  board,
  setBoard,
  onCreateList,
  onDeleteList,
  onCreateCard,
  onOpenCard,
  onPersistCardOrders,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = parseId(active.id);
    const overId = parseId(over.id);

    if (activeId.type !== "card") return;

    const activeCardId = activeId.value;

    setBoard((prev) => {
      if (!prev) return prev;
      const lists = prev.lists.map((list) => ({ ...list, cards: [...list.cards] }));

      const sourceList = lists.find((l) => l.cards.some((c) => c.id === activeCardId));
      if (!sourceList) return prev;

      const sourceIndex = sourceList.cards.findIndex((c) => c.id === activeCardId);
      const [moved] = sourceList.cards.splice(sourceIndex, 1);

      let targetList = sourceList;
      let targetIndex = sourceList.cards.length;

      if (overId.type === "card") {
        targetList = lists.find((l) => l.cards.some((c) => c.id === overId.value)) || sourceList;
        targetIndex = targetList.cards.findIndex((c) => c.id === overId.value);
      }

      if (overId.type === "list") {
        targetList = lists.find((l) => l.id === overId.value) || sourceList;
        targetIndex = targetList.cards.length;
      }

      moved.listId = targetList.id;
      targetList.cards.splice(targetIndex, 0, moved);

      const updated = {
        ...prev,
        lists: lists.map((list) => ({
          ...list,
          cards: list.cards.map((card, index) => ({
            ...card,
            order: index,
          })),
        })),
      };

      onPersistCardOrders(updated.lists);
      return updated;
    });
  };

  if (!board) return null;

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex items-start gap-4 overflow-x-auto pb-6 pr-2 scroll-smooth">
        {board.lists
          .sort((a, b) => a.order - b.order)
          .map((list) => (
            <List
              key={list.id}
              list={list}
              onCreateCard={onCreateCard}
              onDeleteList={onDeleteList}
              onOpenCard={onOpenCard}
            />
          ))}
        <div className="w-72 flex-shrink-0">
          <button
            className="w-full bg-white rounded-md border border-dashed border-gray-300 text-blue-700 text-sm font-semibold px-3 py-1 shadow-sm hover:bg-gray-200 transition"
            onClick={onCreateList}
          >
            + Add another list
          </button>
        </div>
      </div>
    </DndContext>
  );
}
