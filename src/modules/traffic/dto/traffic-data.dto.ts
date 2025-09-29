import { IsInt, Min } from "class-validator";

export class TrafficDataDto {
    @IsInt()
    device_id: number;

    @IsInt()
    @Min(0)
    in_count: number;

    @IsInt()
    @Min(0)
    out_count: number;
}
