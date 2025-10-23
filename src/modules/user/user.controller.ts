import { Body, Controller, Put, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { AuthGuard } from "src/common/guards/auth.guard";
import { UpdateUserDto } from "./dto/update.user.dto";
import { UserService } from "./user.service";

@Controller("user")
@ApiTags("User")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Put("update")
  async updateUser(@Body() body: UpdateUserDto, @Req() req: Request) {
    const userId = req["userId"];
    return await this.userService.updateUser(body, userId);
  }
}
