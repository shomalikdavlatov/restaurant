import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: "john_doe",
    description: "Yangi foydalanuvchi nomi (ixtiyoriy)",
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({
    example: "john@example.com",
    description: "Yangi elektron pochta (ixtiyoriy)",
  })
  @IsString()
  @IsOptional()
  email?: string;
}
