import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import { CreateTrafficDto } from "./dto/traffic.dto";

@Injectable()
export class TrafficService {
    constructor(private prisma: PrismaService) {}

    async createOrUpdateTraffic(userId: number, dto: CreateTrafficDto) {
        const { device_id, in_count, out_count } = dto;

        if (in_count <= 0 && out_count <= 0) {
            return;
        }

        const now = new Date();
        const dateTime = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            now.getHours(),
            0,
            0,
            0
        );

        const traffic = await this.prisma.traffic.upsert({
            where: {
                userId_dateTime_deviceId: {
                    userId,
                    dateTime,
                    deviceId: device_id,
                },
            },
            update: {
                inCount: in_count,
                outCount: out_count,
            },
            create: {
                userId,
                dateTime,
                deviceId: device_id,
                inCount: in_count,
                outCount: out_count,
            },
        });

        return traffic;
    }
}
