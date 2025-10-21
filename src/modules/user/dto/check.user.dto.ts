import { IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CheckUserDto {
  @ApiProperty({
    example: 101,
    description: "Qurilma identifikatori (device_id)",
    type: Number,
  })
  @IsNumber()
  device_id: number;

  @ApiProperty({
    example: 12,
    description: "Kirish soni (binoga kirgan odamlar soni)",
    type: Number,
  })
  @IsNumber()
  in_count: number;

  @ApiProperty({
    example: 8,
    description: "Chiqish soni (binodan chiqqan odamlar soni)",
    type: Number,
  })
  @IsNumber()
  out_count: number;
}
