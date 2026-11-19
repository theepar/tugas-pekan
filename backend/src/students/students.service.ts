import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { runQuery } from "../prisma/run-query";
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

  private run<T>(operation: () => Promise<T>) {
    return runQuery(
      operation,
      "Mahasiswa tidak ditemukan.",
      "NIM atau email sudah digunakan.",
    );
  }
}
