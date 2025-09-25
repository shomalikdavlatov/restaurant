import { Server, Socket } from "socket.io";
import { TrafficService } from "./traffic.service";
import { TrafficDataDto } from "./dto/traffic-data.dto";
export declare class TrafficGateway {
    private trafficService;
    server: Server;
    constructor(trafficService: TrafficService);
    handleTrafficData(data: TrafficDataDto, client: Socket): Promise<void>;
}
