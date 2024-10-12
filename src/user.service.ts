import {
  BadRequestException,
  Injectable,
  NotFoundException,
  BadGatewayException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserInterface, UserMiddlewareInterface } from './interfaces/user.interface';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  async createUser(createAuthDto: CreateAuthDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createAuthDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya está en uso.');
    }

    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);
    createAuthDto.password = hashedPassword;

    const user = this.userRepository.create(createAuthDto);
    return await this.userRepository.save(user);
  }


  async loginUser(loginAuthDto: LoginAuthDto) {
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
  // Actualizar un usuario
  async update(id: string, updateAuthDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Si el password está presente, lo ciframos
    if (updateAuthDto.password) {
      updateAuthDto.password = await bcrypt.hash(updateAuthDto.password, 10);
    }

    // Usamos Object.assign para actualizar el objeto
    Object.assign(user, updateAuthDto);

    return await this.userRepository.save(user); // Guarda el usuario actualizado
  }


  // Obtener todos los usuarios
  async findAll(): Promise<User[]> {
    return this.userRepository.find({
    });
  }

  // Obtener un solo usuario por ID
  async findOne(user: UserMiddlewareInterface): Promise<User> {

    try {
      
      if (user?.user?.id) {
        const id = user?.user?.id
        const userDetails = await this.userRepository.findOne({
          where: { id }
        });
        delete userDetails.password

        if (!userDetails) {
          throw new NotFoundException('User not found');
        }
        console.log(userDetails)
        return userDetails;
      } else {
        console.log("Hola")
        return null
      }

    } catch (error) {
      console.log(error)
    }

  }
}
