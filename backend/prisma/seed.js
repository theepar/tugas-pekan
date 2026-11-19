const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const books = [
  { title: "Clean Code", author: "Robert C. Martin", year: 2008, category: "Pemrograman", available: true },
  { title: "The Pragmatic Programmer", author: "David Thomas & Andrew Hunt", year: 2019, category: "Pemrograman", available: false },
  { title: "Atomic Habits", author: "James Clear", year: 2018, category: "Pengembangan diri", available: true },
  { title: "Laskar Pelangi", author: "Andrea Hirata", year: 2005, category: "Fiksi", available: true },
  { title: "Design of Everyday Things", author: "Don Norman", year: 2013, category: "Desain", available: false },
  { title: "Filosofi Teras", author: "Henry Manampiring", year: 2018, category: "Pengembangan diri", available: true },
];

async function main() {
  if ((await prisma.book.count()) === 0) {
    await prisma.book.createMany({ data: books });
  }
  console.log(`Seed selesai: ${books.length} buku.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
