import { IsInt, IsPositive, Min } from "class-validator";

export class CreateTrafficDto {
    @IsInt()
    @IsPositive()
    device_id: number;

    @IsInt()
    @Min(0)
    in_count: number;

    @IsInt()
    @Min(0)
    out_count: number;
}
