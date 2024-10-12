import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './common/utils/constans';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';  // Asegúrate de que sea la entidad de TypeORM
import { UserInterface } from './interfaces/user.interface';
import { RpcException } from '@nestjs/microservices'; // Importar RpcException para microservicios

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Cambiar a RpcContext
    const ctx = context.switchToRpc();
    const data = ctx.getData();

    // Supongamos que estás pasando el token en los headers del mensaje
    const token = this.extractTokenFromData(data);


    if (!token) {
      throw new RpcException('Unauthorized');
    }


    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      console.log(payload)

      // Obtener el usuario de la base de datos usando TypeORM
      let user: UserInterface;
      if (payload.sub) {
        user = await this.userRepository
          .createQueryBuilder('user')
          .select(['user.email', 'user.fullName', 'user.role', 'user.code', 'user.id', 'user.sendAddress']) // Selecciona solo los campos necesarios
          .where('user.id = :id', { id: payload.sub })
          .getOne();


        if (!user) {
          throw new RpcException('Unauthorized');
        }
      }
      // Inyectar el usuario en el contexto para usarlo después
      data.user = { ...user };
    } catch (error) {
      console.log(error)
      throw new RpcException('Unauthorized');
    }
    return true;
  }

  // Extraer el token desde los headers o el mensaje RPC
  private extractTokenFromData(data: any): string | undefined {
    const headers = data.headers || {};
    const [type, token] = headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
