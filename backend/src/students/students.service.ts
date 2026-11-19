import {
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { StudentDto } from "./student.dto";

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.run(() =>
      this.prisma.student.findMany({ orderBy: { id: "asc" } }),
    );
  }

  async findOne(id: number) {
    const student = await this.run(() =>
      this.prisma.student.findUnique({ where: { id } }),
    );
    if (!student) throw new NotFoundException("Mahasiswa tidak ditemukan.");
    return student;
  }

  create(data: StudentDto) {
    return this.run(() => this.prisma.student.create({ data: this.pick(data) }));
  }

  update(id: number, data: StudentDto) {
    return this.run(() =>
      this.prisma.student.update({ where: { id }, data: this.pick(data) }),
    );
  }

  async remove(id: number) {
    await this.run(() => this.prisma.student.delete({ where: { id } }));
  }

  // Statistik sederhana: total mahasiswa dan jumlah per program studi.
  async stats() {
    const [total, groups] = await this.run(() =>
      Promise.all([
        this.prisma.student.count(),
        this.prisma.student.groupBy({
          by: ["studyProgram"],
          _count: { _all: true },
          orderBy: { studyProgram: "asc" },
        }),
      ]),
    );
    return {
      total,
      byStudyProgram: groups.map((g) => ({
        studyProgram: g.studyProgram,
        count: g._count._all,
      })),
    };
  }

  private pick(data: StudentDto) {
    const { nim, name, email, studyProgram, cohort } = data;
    return { nim, name, email, studyProgram, cohort };
  }

  // Menerjemahkan error Prisma menjadi response HTTP yang sesuai.
  private async run<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002")
          throw new ConflictException("NIM atau email sudah digunakan.");
        if (error.code === "P2025")
          throw new NotFoundException("Mahasiswa tidak ditemukan.");
      }
      console.error("Database query failed:", (error as Error).message);
      throw new ServiceUnavailableException(
        "Database belum dapat diakses. Coba lagi nanti.",
      );
    }
  }
}
