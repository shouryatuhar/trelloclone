import { useEffect, useState } from "react";

export default function CardModal({ card, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [labels, setLabels] = useState("");
  const [checklist, setChecklist] = useState([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    if (!card) return;
    setTitle(card.title || "");
    setDescription(card.description || "");
    setDueDate(card.dueDate ? card.dueDate.slice(0, 10) : "");
    setLabels(card.labels?.map((l) => l.name).join(", ") || "");
    setChecklist(card.checklist?.map((c) => ({ ...c })) || []);
  }, [card]);

  if (!card) return null;

  const handleSave = () => {
    const labelList = labels
      .split(",")
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .map((name) => ({ name }));

    onSave(card.id, {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      labels: labelList,
      checklistItems: checklist.map((item) => ({
        text: item.text,
        completed: item.completed,
      })),
    });
  };

  const toggleChecklist = (id) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const addChecklistItem = () => {
    if (!newItem.trim()) return;
    setChecklist((prev) => [
      ...prev,
      { id: Date.now(), text: newItem.trim(), completed: false },
    ]);
    setNewItem("");
  };

  const removeChecklistItem = (id) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lift p-6">
        <div className="flex justify-between items-start">
          <input
            className="text-xl font-semibold w-full border-b border-gray-200 focus:outline-none focus:border-blue-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="ml-4 text-sm text-muted" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-xs font-semibold text-muted">Description</label>
            <textarea
              className="w-full border rounded-md p-2 mt-1 text-sm"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted">Due date</label>
            <input
              type="date"
              className="w-full border rounded-md p-2 mt-1 text-sm"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <label className="text-xs font-semibold text-muted mt-4 block">Labels</label>
            <input
              className="w-full border rounded-md p-2 mt-1 text-sm"
              placeholder="Design, Bug, Urgent"
              value={labels}
              onChange={(e) => setLabels(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted">Checklist</label>
            <button
              className="text-xs text-blue-600"
              onClick={addChecklistItem}
            >
              + Add item
            </button>
          </div>
          <div className="mt-2 space-y-2">
            {checklist.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleChecklist(item.id)}
                />
                <input
                  className="flex-1 border rounded-md px-2 py-1"
                  value={item.text}
                  onChange={(e) =>
                    setChecklist((prev) =>
                      prev.map((i) =>
                        i.id === item.id ? { ...i, text: e.target.value } : i
                      )
                    )
                  }
                />
                <button
                  className="text-xs text-red-500"
                  onClick={() => removeChecklistItem(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <input
              className="w-full border rounded-md p-2 text-sm"
              placeholder="New checklist item"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addChecklistItem();
                }
              }}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            className="text-sm text-red-600"
            onClick={() => onDelete(card.id)}
          >
            Delete card
          </button>
          <button
            className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-md"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
