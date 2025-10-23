import { IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDeviceDto {
  @ApiProperty({
    example: 1,
    description: "Qurilma egalining foydalanuvchi identifikatori (userId)",
    type: Number,
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: 42,
    description: "Qurilmaning o‘ziga xos identifikatori (deviceId)",
    type: Number,
  })
  @IsNumber()
  deviceId: number;
}
