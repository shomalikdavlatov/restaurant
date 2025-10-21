import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({
    example: "admin",
    description: "Foydalanuvchining login yoki usernamei",
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: "123456",
    description: "Foydalanuvchining paroli",
  })
  @IsString()
  password: string;
}
