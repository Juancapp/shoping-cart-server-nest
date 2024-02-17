import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createProduct(
    @Body()
    user,
  ): Promise<User> {
    return this.userService.createUser(user);
  }

  @Get(':productId')
  async findByProductId(
    @Param('productId')
    id: string,
  ): Promise<User> {
    return this.userService.getUser(id);
  }
}
