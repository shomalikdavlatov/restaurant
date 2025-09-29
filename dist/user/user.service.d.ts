import { PrismaService } from "../database/prisma.service";
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        email: string;
        username: string;
        password: string;
    }): Promise<any>;
    findById(id: number): Promise<any>;
    findByEmailOrUsername(email: string, username: string): Promise<any>;
    updatePassword(email: string, password: string): Promise<any>;
}
