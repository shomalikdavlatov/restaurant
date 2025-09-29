import { Module } from "@nestjs/common";
import { TrafficService } from "./traffic.service";
import { TrafficGateway } from "./traffic.gateway";
import { JwtService } from "@nestjs/jwt";

@Module({
    providers: [TrafficService, TrafficGateway, JwtService],
})
export class TrafficModule {}
