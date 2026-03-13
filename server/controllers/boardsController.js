import prisma from "./prisma.js";

export async function getBoards(req, res) {
  try {
    const search = (req.query.search || "").toLowerCase();
    const boards = await prisma.board.findMany({
      include: {
        lists: {
          orderBy: { order: "asc" },
          include: {
            cards: {
              orderBy: { order: "asc" },
              include: {
                labels: true,
                checklist: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    if (!search) {
      return res.json(boards);
    }

    const filtered = boards.map((board) => ({
      ...board,
      lists: board.lists.map((list) => ({
        ...list,
        cards: list.cards.filter((card) =>
          card.title.toLowerCase().includes(search)
        ),
      })),
    }));

    return res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch boards" });
  }
}

export async function createBoard(req, res) {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Board name is required" });
    }

    const board = await prisma.board.create({
      data: { name: name.trim() },
    });

    res.status(201).json(board);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create board" });
  }
}
