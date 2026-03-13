import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.checklistItem.deleteMany();
  await prisma.card.deleteMany();
  await prisma.list.deleteMany();
  await prisma.label.deleteMany();
  await prisma.board.deleteMany();

  const board = await prisma.board.create({
    data: {
      name: "Project Alpha",
    },
  });

  const lists = await prisma.list.createMany({
    data: [
      { title: "To Do", order: 0, boardId: board.id },
      { title: "In Progress", order: 1, boardId: board.id },
      { title: "Done", order: 2, boardId: board.id },
    ],
  });

  const [todo, inProgress, done] = await prisma.list.findMany({
    where: { boardId: board.id },
    orderBy: { order: "asc" },
  });

  const labelUrgent = await prisma.label.create({
    data: { name: "Urgent", color: "#ef4444" },
  });

  const labelFeature = await prisma.label.create({
    data: { name: "Feature", color: "#22c55e" },
  });

  const card1 = await prisma.card.create({
    data: {
      title: "Set up project structure",
      description: "Create repo and initial folders",
      order: 0,
      listId: todo.id,
      labels: { connect: [{ id: labelFeature.id }] },
      checklist: {
        create: [
          { text: "Create client", completed: true },
          { text: "Create server", completed: false },
        ],
      },
    },
  });

  await prisma.card.create({
    data: {
      title: "Design Kanban UI",
      description: "Bello – Kanban Board styling",
      order: 1,
      listId: todo.id,
      labels: { connect: [{ id: labelUrgent.id }] },
    },
  });

  await prisma.card.create({
    data: {
      title: "Implement drag and drop",
      description: "Use dnd-kit for lists and cards",
      order: 0,
      listId: inProgress.id,
    },
  });

  await prisma.card.create({
    data: {
      title: "Ship MVP",
      description: "Deploy and test",
      order: 0,
      listId: done.id,
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
