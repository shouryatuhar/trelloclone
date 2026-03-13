import prisma from "./prisma.js";

export async function createList(req, res) {
  try {
    const { title, boardId } = req.body;
    if (!title || !boardId) {
      return res.status(400).json({ error: "title and boardId required" });
    }

    const maxOrder = await prisma.list.findFirst({
      where: { boardId: Number(boardId) },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const list = await prisma.list.create({
      data: {
        title: title.trim(),
        order: (maxOrder?.order ?? -1) + 1,
        boardId: Number(boardId),
      },
    });

    res.status(201).json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create list" });
  }
}

export async function deleteList(req, res) {
  try {
    const id = Number(req.params.id);
    await prisma.list.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete list" });
  }
}
