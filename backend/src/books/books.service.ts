import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { runQuery } from "../prisma/run-query";
import { BookDto, BooksQueryDto } from "./book.dto";

const NOT_FOUND = "Buku tidak ditemukan.";

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  // Daftar buku, bisa difilter dengan where: kata kunci, kategori, status.
  findAll(query: BooksQueryDto) {
    const where: Prisma.BookWhereInput = {};
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { author: { contains: query.search, mode: "insensitive" } },
      ];
    }
    if (query.category) where.category = query.category;
    if (query.available !== undefined) where.available = query.available;
    return runQuery(
      () => this.prisma.book.findMany({ where, orderBy: { id: "asc" } }),
      NOT_FOUND,
    );
  }

  async findOne(id: number) {
    const book = await runQuery(
      () => this.prisma.book.findUnique({ where: { id } }),
      NOT_FOUND,
    );
    if (!book) throw new NotFoundException(NOT_FOUND);
    return book;
  }

  create(data: BookDto) {
    return runQuery(() => this.prisma.book.create({ data }), NOT_FOUND);
  }

  update(id: number, data: BookDto) {
    return runQuery(
      () => this.prisma.book.update({ where: { id }, data }),
      NOT_FOUND,
    );
  }

  async remove(id: number) {
    await runQuery(() => this.prisma.book.delete({ where: { id } }), NOT_FOUND);
  }

  // Statistik sederhana: total, tersedia, dipinjam, dan jumlah per kategori.
  async stats() {
    const [total, available, groups] = await runQuery(
      () =>
        Promise.all([
          this.prisma.book.count(),
          this.prisma.book.count({ where: { available: true } }),
          this.prisma.book.groupBy({
            by: ["category"],
            _count: { _all: true },
            orderBy: { category: "asc" },
          }),
        ]),
      NOT_FOUND,
    );
    return {
      total,
      available,
      borrowed: total - available,
      byCategory: groups.map((g) => ({
        category: g.category,
        count: g._count._all,
      })),
    };
  }
}
