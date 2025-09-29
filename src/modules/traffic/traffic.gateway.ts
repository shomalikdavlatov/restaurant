import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { TrafficService } from "./traffic.service";
import { TrafficDataDto } from "./dto/traffic-data.dto";
import { WsJwtGuard } from "src/common/guards/ws.guard";

@WebSocketGateway({
    cors: {
        origin: "*",
    },
})
export class TrafficGateway {
    @WebSocketServer()
    server: Server;

    constructor(private trafficService: TrafficService) {}

    @SubscribeMessage("traffic-data")
    @UseGuards(WsJwtGuard)
    async handleTrafficData(
        @MessageBody() data: TrafficDataDto,
        @ConnectedSocket() client: Socket
    ) {
        try {
            const user = client['user'];

            if (!user) {
                client.emit("error", { message: "Unauthorized" });
                return;
            }

            const result = await this.trafficService.updateTrafficData(
                user.sub,
                data.device_id,
                data.in_count,
                data.out_count
            );

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
        } catch (error) {
            client.emit("error", { message: error.message });
        }
    }
}
