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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrafficGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const traffic_service_1 = require("./traffic.service");
const traffic_data_dto_1 = require("./dto/traffic-data.dto");
let TrafficGateway = class TrafficGateway {
    trafficService;
    server;
    constructor(trafficService) {
        this.trafficService = trafficService;
    }
    async handleTrafficData(data, client) {
        try {
            const user = client.request.user;
            if (!user) {
                client.emit("error", { message: "Unauthorized" });
                return;
            }
            const result = await this.trafficService.updateTrafficData(user.id, data.device_id, data.in_count, data.out_count);
            client.emit("traffic-data-saved", {
                success: true,
                data: result,
            });
            this.server.emit("traffic-update", {
                userId: user.id,
                deviceId: data.device_id,
                inCount: data.in_count,
                outCount: data.out_count,
                timestamp: new Date(),
            });
        }
        catch (error) {
            client.emit("error", { message: error.message });
        }
    }
};
exports.TrafficGateway = TrafficGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], TrafficGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("traffic-data"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [traffic_data_dto_1.TrafficDataDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], TrafficGateway.prototype, "handleTrafficData", null);
exports.TrafficGateway = TrafficGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: "*",
        },
    }),
    __metadata("design:paramtypes", [traffic_service_1.TrafficService])
], TrafficGateway);
//# sourceMappingURL=traffic.gateway.js.map