import { Module } from "@nestjs/common";
import { BooksModule } from "./books/books.module";
import { StudentsModule } from "./students/students.module";

@Module({ imports: [BooksModule, StudentsModule] })
export class AppModule {}
