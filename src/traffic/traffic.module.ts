import { Module } from "@nestjs/common";
import { TrafficService } from "./traffic.service";
import { TrafficGateway } from "./traffic.gateway";

@Module({
    providers: [TrafficService, TrafficGateway],
})
export class TrafficModule {}
