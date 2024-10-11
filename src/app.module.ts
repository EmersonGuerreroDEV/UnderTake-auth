import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from './common/utils/constans';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfiguration } from './config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      isGlobal: true,
    }),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      global: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('host'),
        port: configService.get<number>('database.port') || 3306, // Asegúrate de usar el puerto correcto
        username: configService.get<string>('username'),
        password: configService.get<string>('password'),
        database: configService.get<string>('database'),
        // Si usas una URL en lugar de los campos separados:
        // url: configService.get<string>('database.url'),
        entities: [User], // Define tus entidades aquí
        synchronize: true, // Solo para desarrollo, desactívalo en producción
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController],
  providers: [UserService, JwtModule],
})
export class AppModule { }
