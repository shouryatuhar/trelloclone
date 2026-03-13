import prisma from "./prisma.js";

function normalizeLabels(labels = []) {
  return labels
    .map((label) => {
      if (typeof label === "string") {
        return { name: label.trim(), color: "#3b82f6" };
      }
      return {
        name: (label.name || "").trim(),
        color: label.color || "#3b82f6",
      };
    })
    .filter((l) => l.name.length > 0);
}

export async function createCard(req, res) {
  try {
    const { title, listId } = req.body;
    if (!title || !listId) {
      return res.status(400).json({ error: "title and listId required" });
    }

    const maxOrder = await prisma.card.findFirst({
      where: { listId: Number(listId) },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const card = await prisma.card.create({
      data: {
        title: title.trim(),
        order: (maxOrder?.order ?? -1) + 1,
        listId: Number(listId),
      },
      include: { labels: true, checklist: true },
    });

    res.status(201).json(card);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create card" });
  }
}

export async function updateCard(req, res) {
  try {
    const id = Number(req.params.id);
    const {
      title,
      description,
      dueDate,
      listId,
      order,
      labels,
      checklistItems,
    } = req.body;

    const data = {};
    if (title !== undefined) data.title = title.trim();
    if (description !== undefined) data.description = description;
    if (dueDate !== undefined) {
      data.dueDate = dueDate ? new Date(dueDate) : null;
    }
    if (listId !== undefined) data.listId = Number(listId);
    if (order !== undefined) data.order = Number(order);

    const labelData = normalizeLabels(labels);

    const updated = await prisma.$transaction(async (tx) => {
      if (labels !== undefined) {
        const labelRecords = await Promise.all(
          labelData.map((label) =>
            tx.label.upsert({
              where: { name: label.name },
              update: { color: label.color },
              create: label,
            })
          )
        );

        await tx.card.update({
          where: { id },
          data: {
            ...data,
            labels: {
              set: labelRecords.map((l) => ({ id: l.id })),
            },
          },
        });
      } else {
        await tx.card.update({ where: { id }, data });
      }

      if (checklistItems !== undefined) {
        await tx.checklistItem.deleteMany({ where: { cardId: id } });
        if (Array.isArray(checklistItems) && checklistItems.length > 0) {
          await tx.checklistItem.createMany({
            data: checklistItems.map((item) => ({
              text: item.text,
              completed: Boolean(item.completed),
              cardId: id,
            })),
          });
        }
      }

      return tx.card.findUnique({
        where: { id },
        include: { labels: true, checklist: true },
      });
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update card" });
  }
}

export async function deleteCard(req, res) {
  try {
    const id = Number(req.params.id);
    await prisma.card.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete card" });
  }
}
