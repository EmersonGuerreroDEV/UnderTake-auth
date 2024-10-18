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
import { addAddressDto } from './dto/add-address.dto';



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
  @MessagePattern({ cmd: 'update_user' })
  @UseGuards(AuthGuard)
  async update(data: any) {
    const id = data?.user?.id
    const body: UpdateUserDto = data?.body
    return this.userService.update(id, body);
  }

  @MessagePattern({ cmd: 'add_address_user' })
  @UseGuards(AuthGuard)
  async addAddress(
    data: any
  ) {

    const info: addAddressDto = { address: data.address, cityId: data.city }
    const userId = data.user.id
    return this.userService.addAddressToUser(userId, info);
  }


  @MessagePattern({ cmd: 'list_cities_user' })
  async listCities(
    data: any
  ) {


    return this.userService.citiesList();
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


  @MessagePattern({ cmd: 'validate_token' })
  async validateToken(data: { token: string }) {
    return this.userService.validateToken(data.token);
  }


}
