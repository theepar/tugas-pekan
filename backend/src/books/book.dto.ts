import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from "class-validator";

export const BOOK_CATEGORIES = [
  "Pemrograman",
  "Desain",
  "Fiksi",
  "Pengembangan diri",
  "Lainnya",
];

const trim = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim() : value;

export class BookDto {
  @Transform(trim)
  @IsString()
  @Length(1, 150)
  title!: string;

  @Transform(trim)
  @IsString()
  @Length(1, 120)
  author!: string;

  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear())
  year!: number;

  @IsIn(BOOK_CATEGORIES)
  category!: string;

  @IsOptional()
  @IsBoolean()
  available?: boolean;
}

export class BooksQueryDto {
  @IsOptional()
  @Transform(trim)
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(BOOK_CATEGORIES)
  category?: string;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    value === "true" ? true : value === "false" ? false : value,
  )
  @IsBoolean()
  available?: boolean;
}
