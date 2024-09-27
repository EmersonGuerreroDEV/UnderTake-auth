import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Repository } from 'typeorm';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  async create(createAuthDto: CreateAuthDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createAuthDto.email },
    });

    if (existingUser) {
      // Si el correo electrónico ya está en uso, devuelve un mensaje de error
      throw new BadRequestException('El correo electrónico ya está en uso.');
    }

    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);
    createAuthDto.password = hashedPassword;

    const user = this.userRepository.create(createAuthDto);
    return await this.userRepository.save(user);
  }

  async login(loginAuthDto: LoginAuthDto) {
    try {
      const { email, password } = loginAuthDto;

      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new BadRequestException('Invalid password');
      }

      const payload = { sub: user.id };
      return {
        access_token: this.jwtService.sign(payload),
        user: user,
      };
    } catch (error) {
      console.log(error)
      throw new BadRequestException(error);
    }
  }

  async getAll() {
    return [];
  }
}
