import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './app.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from './auth.guard';
import { Roles } from 'src/decorators/role.decorator';
import { UserRoles } from './common/utils/enums';
import { RolesGuard } from './role.guard';
import { UpdateUserDto } from './dto/update-user.dto';



@Controller('users')
export class AppController {
  constructor(private readonly userService: UserService) { }



  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.userService.create(createAuthDto);
  }
  // @UseGuards(AuthGuard('local'))
  @Post("login")
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.userService.login(loginAuthDto);
  }

  // Actualizar un usuario
  @Roles(UserRoles.USER)
  @UseGuards(AuthGuard, RolesGuard)
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
  @Roles(UserRoles.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
