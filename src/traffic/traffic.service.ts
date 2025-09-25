import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class TrafficService {
    constructor(private prisma: PrismaService) {}

    async updateTrafficData(
        userId: number,
        deviceId: number,
        inCount: number,
        outCount: number
    ) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingRecord = await this.prisma.traffic.findUnique({
            where: {
                userId_date_deviceId: {
                    userId,
                    date: today,
                    deviceId,
                },
            },
        });

        if (existingRecord) {
            const updateData: any = {};

            if (inCount > 0) {
                updateData.inCount = existingRecord.inCount + inCount;
            }

            if (outCount > 0) {
                updateData.outCount = existingRecord.outCount + outCount;
            }

            if (Object.keys(updateData).length > 0) {
                return this.prisma.traffic.update({
                    where: {
                        userId_date_deviceId: {
                            userId,
                            date: today,
                            deviceId,
                        },
                    },
                    data: updateData,
                });
            }

            return existingRecord;
        } else {
            return this.prisma.traffic.create({
                data: {
                    userId,
                    date: today,
                    inCount: inCount > 0 ? inCount : 0,
                    outCount: outCount > 0 ? outCount : 0,
                    deviceId,
                },
            });
        }
    }

    async getTrafficData(userId: number) {
        return this.prisma.traffic.findMany({
            where: { userId },
            orderBy: { date: "desc" },
        });
    }
}
