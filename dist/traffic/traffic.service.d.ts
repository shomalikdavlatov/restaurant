import { PrismaService } from "../database/prisma.service";
export declare class TrafficService {
    private prisma;
    constructor(prisma: PrismaService);
    updateTrafficData(userId: number, deviceId: number, inCount: number, outCount: number): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        date: Date;
        inCount: number;
        outCount: number;
        deviceId: number;
    }>;
    getTrafficData(userId: number): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        date: Date;
        inCount: number;
        outCount: number;
        deviceId: number;
    }[]>;
}
