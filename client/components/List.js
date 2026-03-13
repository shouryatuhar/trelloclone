import { useState } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import Card from "./Card";

export default function List({
  list,
  onCreateCard,
  onDeleteList,
  onOpenCard,
}) {
  const { setNodeRef } = useDroppable({
    id: `list-${list.id}`,
    data: { type: "list", listId: list.id },
  });
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");

  const submitCard = () => {
    const value = title.trim();
    if (!value) return;
    onCreateCard(list.id, value);
    setTitle("");
    setIsAdding(false);
  };

  return (
    <div className="w-[280px] flex-shrink-0">
      <div className="bg-[#ebecf0] rounded-xl p-3 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-ink">{list.title}</h3>
          <button
            className="text-xs text-muted rounded-md px-3 py-1 hover:bg-gray-200 transition"
            onClick={() => onDeleteList(list.id)}
          >
            Delete
          </button>
        </div>

        <div ref={setNodeRef} className="space-y-2 min-h-[20px]">
          <SortableContext
            items={list.cards.map((c) => `card-${c.id}`)}
            strategy={verticalListSortingStrategy}
          >
            {list.cards.map((card) => (
              <Card key={card.id} card={card} onOpen={onOpenCard} />
            ))}
          </SortableContext>
        </div>

        {isAdding ? (
          <div className="space-y-2">
            <textarea
              className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              rows={2}
              placeholder="Enter a title for this card..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submitCard();
                }
              }}
            />
            <div className="flex items-center gap-2">
              <button
                className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-md shadow-sm hover:bg-blue-700 transition"
                onClick={submitCard}
              >
                Add card
              </button>
              <button
                className="text-xs text-muted rounded-md px-3 py-1 hover:bg-gray-200 transition"
                onClick={() => {
                  setIsAdding(false);
                  setTitle("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            className="w-full text-left text-xs font-semibold text-muted rounded-md px-3 py-1 hover:bg-gray-200 transition"
            onClick={() => setIsAdding(true)}
          >
            + Add a card
          </button>
        )}
      </div>
    </div>
  );
}
