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

const students = [
  { nim: "103022400016", name: "I Putu Gede Deva Gundhala", email: "103022400016@example.com", studyProgram: "Rekayasa Perangkat Lunak", cohort: 2024 },
  { nim: "103022400017", name: "Mahasiswa Contoh A", email: "103022400017@example.com", studyProgram: "Rekayasa Perangkat Lunak", cohort: 2024 },
  { nim: "103022400018", name: "Mahasiswa Contoh B", email: "103022400018@example.com", studyProgram: "Informatika", cohort: 2024 },
];

async function main() {
  if ((await prisma.book.count()) === 0) {
    await prisma.book.createMany({ data: books });
  }
  for (const student of students) {
    await prisma.student.upsert({
      where: { nim: student.nim },
      update: {},
      create: student,
    });
  }
  console.log(`Seed selesai: ${books.length} buku, ${students.length} mahasiswa.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
