import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from './auth.guard';
import { Roles } from 'src/decorators/role.decorator';
import { UserRoles } from './common/utils/enums';
import { RolesGuard } from './role.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { MessagePattern } from '@nestjs/microservices';



@Controller('users')
export class AppController {
  constructor(private readonly userService: UserService) { }


  @MessagePattern({ cmd: 'create_user' })
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.userService.createUser(createAuthDto);
  }
  // @UseGuards(AuthGuard('local'))

  @MessagePattern({ cmd: 'login_user' })
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.userService.loginUser(loginAuthDto);
  }

  // Actualizar un usuario
  // @Roles(UserRoles.USER)
  // @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAuthDto: UpdateUserDto) {
    return this.userService.update(id, updateAuthDto);
  }

  // Listar todos los usuarios
  @Roles(UserRoles.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  // Obtener un solo usuario por su ID
  @UseGuards(AuthGuard)
  @MessagePattern({ cmd: 'detail_user' })
  async findOne(data: any) {
    return this.userService.findOne(data);
  }
}
