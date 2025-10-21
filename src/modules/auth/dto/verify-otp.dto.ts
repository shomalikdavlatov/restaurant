import { IsEmail, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class VerifyOtpDto {
  @ApiProperty({
    example: "user@example.com",
    description: "Foydalanuvchining elektron pochtasi (OTP yuborilgan email)",
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
}
