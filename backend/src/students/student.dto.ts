import { Transform } from "class-transformer";
import {
  IsEmail,
  IsInt,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from "class-validator";

export class StudentDto {
  @IsString()
  @Matches(/^\d{12}$/, { message: "NIM harus terdiri dari 12 angka." })
  nim!: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === "string" ? value.trim() : value,
  )
  @IsString()
  @Length(2, 120)
  name!: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === "string" ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  @Length(3, 150)
  email!: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === "string" ? value.trim() : value,
  )
  @IsString()
  @Length(2, 100)
  studyProgram!: string;

  @IsInt()
  @Min(2000)
  @Max(2100)
  cohort!: number;
}
