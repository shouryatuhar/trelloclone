import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import Board from "../components/Board";
import CardModal from "../components/CardModal";
import {
  getBoards,
  createBoard,
  createList,
  deleteList,
  createCard,
  updateCard,
  deleteCard,
} from "../lib/api";

export default function Home() {
  const [boards, setBoards] = useState([]);
  const [activeBoardId, setActiveBoardId] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [newBoardName, setNewBoardName] = useState("");

  const activeBoard = useMemo(
    () => boards.find((b) => b.id === activeBoardId) || boards[0],
    [boards, activeBoardId]
  );

  const loadBoards = async (query = "") => {
    const data = await getBoards(query);
    setBoards(data);
    if (data.length && !activeBoardId) {
      setActiveBoardId(data[0].id);
    }
  };

  useEffect(() => {
    loadBoards();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadBoards(search);
    }, 250);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleCreateBoard = async () => {
    const name = newBoardName.trim() || `Board ${boards.length + 1}`;
    const board = await createBoard(name);
    setNewBoardName("");
    await loadBoards();
    setActiveBoardId(board.id);
  };

  const handleCreateList = async () => {
    if (!activeBoard) return;
    await createList("New List", activeBoard.id);
    await loadBoards(search);
  };

  const handleDeleteList = async (id) => {
    await deleteList(id);
    await loadBoards(search);
  };

  const handleCreateCard = async (listId, title = "New Card") => {
    await createCard(title, listId);
    await loadBoards(search);
  };

  const handleOpenCard = (card) => {
    setSelectedCard(card);
  };

  const handleSaveCard = async (id, payload) => {
    await updateCard(id, payload);
    await loadBoards(search);
    setSelectedCard(null);
  };

  const handleDeleteCard = async (id) => {
    await deleteCard(id);
    await loadBoards(search);
    setSelectedCard(null);
  };

  const handlePersistCardOrders = async (lists) => {
    await Promise.all(
      lists.flatMap((list) =>
        list.cards.map((card, index) =>
          updateCard(card.id, { listId: list.id, order: index })
        )
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#f1f2f4] text-ink">
      <Head>
        <title>Bello – Task Management Board</title>
      </Head>

      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
              B
            </div>
            <div>
              <h1 className="font-display text-xl text-ink">Bello</h1>
              <p className="text-xs text-muted">Bello – Kanban Board</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center bg-white border border-gray-200 rounded-md px-3 py-2 shadow-sm">
              <input
                className="bg-transparent outline-none text-sm w-48 md:w-60 placeholder:text-slate-500"
                placeholder="Search cards by title"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <input
              className="bg-white border border-gray-200 rounded-md px-3 py-2 text-sm shadow-sm placeholder:text-slate-500"
              placeholder="New board name"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-md shadow-sm hover:bg-blue-700 transition"
              onClick={handleCreateBoard}
            >
              Create board
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        {boards.length === 0 ? (
          <div className="text-center text-muted">No boards yet.</div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <select
                className="bg-white border border-gray-200 rounded-md px-3 py-2 text-sm shadow-sm"
                value={activeBoard?.id || ""}
                onChange={(e) => setActiveBoardId(Number(e.target.value))}
              >
                {boards.map((board) => (
                  <option key={board.id} value={board.id}>
                    {board.name}
                  </option>
                ))}
              </select>
              <div className="text-sm text-muted">{activeBoard?.name}</div>
            </div>

            <Board
              board={activeBoard}
              setBoard={(updater) => {
                setBoards((prev) =>
                  prev.map((b) => (b.id === activeBoard.id ? updater(b) : b))
                );
              }}
              onCreateList={handleCreateList}
              onDeleteList={handleDeleteList}
              onCreateCard={handleCreateCard}
              onOpenCard={handleOpenCard}
              onPersistCardOrders={handlePersistCardOrders}
            />
          </div>
        )}
      </main>

      <CardModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        onSave={handleSaveCard}
        onDelete={handleDeleteCard}
      />
    </div>
  );
}
