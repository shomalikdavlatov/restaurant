import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class UpdateDeviceDto {
  @ApiProperty({
    example: 5,
    description:
      "Eski filial ID (device hozirda biriktirilgan userId). Majburiy maydon.",
    required: true,
  })
  @IsNumber()
  oldUserId: number;

  @ApiProperty({
    example: 42,
    description: "Device ID. Majburiy maydon.",
    required: true,
  })
  @IsNumber()
  deviceId: number;

  @ApiProperty({
    example: 3,
    description:
      "Yangi filial ID (agar filial o'zgartirilmoqchi bo'lsa yuboriladi). Ixtiyoriy maydon – agar yuborilmasa, hech qanday o'zgarish bo'lmaydi.",
    required: false,
  })
  @IsNumber()
  @IsOptional()
  newUserId?: number;
}
