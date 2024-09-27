import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UserService } from './app.service';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from './common/utils/constans';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      global: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '82.197.82.49',
      port: 3306,
      username: 'u878370420_undertake',
      password: 'Berasflow21#',
      database: 'u878370420_undertake',
      entities: [User],
      synchronize: true, // Solo para desarrollo
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController],
  providers: [UserService, JwtModule],
})
export class AppModule {}
