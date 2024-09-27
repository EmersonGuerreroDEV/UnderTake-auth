import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './app.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from './auth.guard';
import { Roles } from 'src/decorators/role.decorator';
import { UserRoles } from './common/utils/enums';
import { RolesGuard } from './role.guard';



@Controller('users')
export class AppController {
  constructor(private readonly userService: UserService) {}



  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.userService.create(createAuthDto);
  }
  // @UseGuards(AuthGuard('local'))
  @Post("login")
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.userService.login(loginAuthDto);
  }

  @Roles(UserRoles.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  getAll(){
    return this.userService.getAll();
  }

}
