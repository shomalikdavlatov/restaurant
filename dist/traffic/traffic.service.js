"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrafficService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let TrafficService = class TrafficService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async updateTrafficData(userId, deviceId, inCount, outCount) {
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
            const updateData = {};
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
        }
        else {
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
    async getTrafficData(userId) {
        return this.prisma.traffic.findMany({
            where: { userId },
            orderBy: { date: "desc" },
        });
    }
};
exports.TrafficService = TrafficService;
exports.TrafficService = TrafficService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TrafficService);
//# sourceMappingURL=traffic.service.js.map