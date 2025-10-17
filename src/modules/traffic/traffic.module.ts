import { Module } from "@nestjs/common";
import { TrafficController } from "./traffic.controller";
import { TrafficService } from "./traffic.service";

@Module({
    controllers: [TrafficController],
    providers: [TrafficService],
})
export class TrafficModule {}
