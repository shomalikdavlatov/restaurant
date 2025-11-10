import { Body, Controller, Put, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { AuthGuard } from "src/common/guards/auth.guard";
import { UpdateUserDto } from "./dto/update.user.dto";
import { UserService } from "./user.service";
import { UpdateRoleDto } from "./dto/update.role.dto";

@Controller("user")
@ApiTags("User")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth("token")
  @Put("update")
  async updateUser(@Body() body: UpdateUserDto, @Req() req: Request) {
    const userId = req["userId"];
    return await this.userService.updateUser(body, userId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth("token")
  @Put("update-role")
  async updateRole(@Body() body: UpdateRoleDto, @Req() req: Request) {
    const userId = req["userId"];
    return await this.userService.updateRole(userId, body);
  }
}
