const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const students = [
  { nim: "103022400016", name: "I Putu Gede Deva Gundhala", email: "103022400016@example.com", studyProgram: "Rekayasa Perangkat Lunak", cohort: 2024 },
  { nim: "103022400017", name: "Mahasiswa Contoh A", email: "103022400017@example.com", studyProgram: "Rekayasa Perangkat Lunak", cohort: 2024 },
  { nim: "103022400018", name: "Mahasiswa Contoh B", email: "103022400018@example.com", studyProgram: "Informatika", cohort: 2024 },
];

async function main() {
  for (const student of students) {
    await prisma.student.upsert({
      where: { nim: student.nim },
      update: {},
      create: student,
    });
  }
  console.log(`Seed selesai: ${students.length} mahasiswa.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
