import { IsEmail, IsString, Length, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
  @ApiProperty({
    example: "user@example.com",
    description: "Parolni tiklash uchun foydalanuvchining elektron pochtasi",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "123456",
    description: "Email orqali yuborilgan 6 xonali OTP kodi",
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @Length(6, 6)
  otp: string;

  @ApiProperty({
    example: "newPassword123",
    description: "Yangi parol (kamida 6 ta belgi)",
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
