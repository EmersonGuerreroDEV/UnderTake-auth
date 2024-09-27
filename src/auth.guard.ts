import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './common/utils/constans';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';  // Asegúrate de que sea la entidad de TypeORM
import { UserInterface } from './interfaces/user.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      // Obtener el usuario de la base de datos usando TypeORM
      let user: UserInterface;
      if (payload.sub) {
        user = await this.userRepository
          .createQueryBuilder('user')
          .select(['user.email', 'user.fullName', 'user.role', 'user.code', 'user.id', 'user.sendAddress']) // Selecciona solo los campos necesarios
          .where('user.id = :id', { id: payload.sub })
          .getOne();

        if (!user) {
          throw new UnauthorizedException();
        }
      }
      request['user'] = user;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
