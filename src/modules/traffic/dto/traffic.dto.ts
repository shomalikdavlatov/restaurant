import { IsInt, IsPositive, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTrafficDto {
  @ApiProperty({
    example: 1,
    description: "Qurilma identifikatori (device_id) — ijobiy butun son",
  })
  @IsInt()
  @IsPositive()
  device_id: number;

  @ApiProperty({
    example: 25,
    description: "Binoga kirgan odamlar soni (0 dan kichik bo‘lmasligi kerak)",
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  in_count: number;

  @ApiProperty({
    example: 18,
    description:
      "Binodan chiqqan odamlar soni (0 dan kichik bo‘lmasligi kerak)",
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  out_count: number;
}
