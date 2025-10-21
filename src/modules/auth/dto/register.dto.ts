import { IsEmail, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({
    example: "test@gmail.com",
    description: "Foydalanuvchining elektron pochtasi",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "john_doe",
    description: "Foydalanuvchining login yoki foydalanuvchi nomi",
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({
    example: "password123",
    description: "Foydalanuvchining paroli (kamida 6 ta belgi)",
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
