import { ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { IsNumber, IsString } from "class-validator";

export class UpdateRoleDto {
  @ApiPropertyOptional({
    example: "ADMIN",
    description: "Yangi foydalanuvchi roli ADMIN | USER",
    required: true,
  })
  @IsString()
  role: Role;

  @ApiPropertyOptional({
    example: "5",
    description: "user id si",
    required: true,
  })
  @IsNumber()
  userId: number;
}
