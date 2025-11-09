import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class DeleteDeviceDto {
  @ApiProperty({
    example: 42,
    description: "Device ID",
  })
  @IsNumber()
  deviceId: number;

  @ApiProperty({
    example: 3,
    description: "Yangi filial (userId)",
  })
  @IsNumber()
  userId: number;
}
