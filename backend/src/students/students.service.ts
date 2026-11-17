import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { StudentDto } from "./student.dto";

interface Student {
  id: number;
  nim: string;
  name: string;
  email: string;
  studyProgram: string;
  cohort: number;
  createdAt: Date;
}
const columns =
  'id, nim, name, email, study_program AS "studyProgram", cohort, created_at AS "createdAt"';

@Injectable()
export class StudentsService {
  constructor(private readonly database: DatabaseService) {}

  async findAll() {
    const result = await this.database.query<Student>(
      `SELECT ${columns} FROM students ORDER BY id`,
    );
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.database.query<Student>(
      `SELECT ${columns} FROM students WHERE id = $1`,
      [id],
    );
    if (!result.rows[0])
      throw new NotFoundException("Mahasiswa tidak ditemukan.");
    return result.rows[0];
  }

  private async save(sql: string, values: unknown[]) {
    try {
      const result = await this.database.query<Student>(sql, values);
      if (!result.rows[0])
        throw new NotFoundException("Mahasiswa tidak ditemukan.");
      return result.rows[0];
    } catch (error) {
      if ((error as { code?: string }).code === "23505")
        throw new ConflictException("NIM atau email sudah digunakan.");
      throw error;
    }
  }

  create(data: StudentDto) {
    return this.save(
      `INSERT INTO students (nim, name, email, study_program, cohort) VALUES ($1, $2, $3, $4, $5) RETURNING ${columns}`,
      [data.nim, data.name, data.email, data.studyProgram, data.cohort],
    );
  }

  update(id: number, data: StudentDto) {
    return this.save(
      `UPDATE students SET nim=$1, name=$2, email=$3, study_program=$4, cohort=$5 WHERE id=$6 RETURNING ${columns}`,
      [data.nim, data.name, data.email, data.studyProgram, data.cohort, id],
    );
  }

  async remove(id: number) {
    const result = await this.database.query(
      "DELETE FROM students WHERE id=$1 RETURNING id",
      [id],
    );
    if (!result.rowCount)
      throw new NotFoundException("Mahasiswa tidak ditemukan.");
  }
}
