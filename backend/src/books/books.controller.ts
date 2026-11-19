import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { BookDto, BooksQueryDto } from "./book.dto";
import { BooksService } from "./books.service";

@Controller("books")
export class BooksController {
  constructor(private readonly books: BooksService) {}

  @Get()
  findAll(@Query() query: BooksQueryDto) {
    return this.books.findAll(query);
  }

  @Get("stats")
  stats() {
    return this.books.stats();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.books.findOne(id);
  }

  @Post()
  create(@Body() data: BookDto) {
    return this.books.create(data);
  }

  @Put(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() data: BookDto) {
    return this.books.update(id, data);
  }

  @Delete(":id")
  @HttpCode(204)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.books.remove(id);
  }
}
