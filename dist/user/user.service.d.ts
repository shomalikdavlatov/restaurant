import { PrismaService } from "../database/prisma.service";
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        email: string;
        username: string;
        password: string;
    }): Promise<{
        email: string;
        username: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    findById(id: number): Promise<{
        email: string;
        username: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    } | null>;
    findByEmailOrUsername(email: string, username: string): Promise<{
        email: string;
        username: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    } | null>;
    updatePassword(email: string, password: string): Promise<{
        email: string;
        username: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
}
