import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Card({ card, onOpen }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `card-${card.id}`,
    data: { type: "card", cardId: card.id, listId: card.listId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg p-3 shadow-sm cursor-pointer border border-transparent transition-all duration-200 hover:shadow-md hover:-translate-y-[1px] ${
        isDragging ? "opacity-70 shadow-md -translate-y-[1px]" : ""
      }`}
      onClick={() => onOpen(card)}
    >
      <div className="text-sm font-semibold mb-2 leading-snug">{card.title}</div>
      <div className="flex flex-wrap gap-1.5">
        {card.labels?.map((label) => (
          <span
            key={label.id}
            className="text-[10px] font-semibold text-white px-2.5 py-0.5 rounded-full shadow-sm"
            style={{ backgroundColor: label.color }}
          >
            {label.name}
          </span>
        ))}
      </div>
      {card.dueDate && (
        <div className="text-xs text-muted mt-2">
          Due {new Date(card.dueDate).toLocaleDateString()}
        </div>
      )}
      {card.checklist?.length > 0 && (
        <div className="text-xs text-muted mt-1">
          Checklist {card.checklist.filter((i) => i.completed).length}/
          {card.checklist.length}
        </div>
      )}
    </div>
  );
}
