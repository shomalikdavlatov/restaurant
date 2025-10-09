import { IsNumber } from "class-validator";

export class CheckUserDto {
  @IsNumber()
  device_id: number;

  @IsNumber()
  in_count: number;

  @IsNumber()
  out_count: number;
}
