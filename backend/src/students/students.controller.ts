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
} from "@nestjs/common";
import { StudentDto } from "./student.dto";
import { StudentsService } from "./students.service";

@Controller("students")
export class StudentsController {
  constructor(private readonly students: StudentsService) {}

  @Get()
  findAll() {
    return this.students.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.students.findOne(id);
  }

  @Post()
  create(@Body() data: StudentDto) {
    return this.students.create(data);
  }

  @Put(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() data: StudentDto) {
    return this.students.update(id, data);
  }

  @Delete(":id")
  @HttpCode(204)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.students.remove(id);
  }
}
