import {
  BadRequestException,
  Injectable,
  NotFoundException,
  BadGatewayException,
  UnauthorizedException
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
import { City } from './entities/city.entity';
import { Address } from './entities/address.entity';
import { jwtConstants } from './common/utils/constans';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,

    @InjectRepository(City) private cityRepository: Repository<City>,

    @InjectRepository(Address) private addressRepository: Repository<Address>,

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
    return await this.userRepository.find();
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


  async citiesList() {
    return this.cityRepository.find()
  }


  // Obtener todos los usuarios
  async findAll(): Promise<User[]> {
    return this.userRepository.find({
    });
  }

  // Obtener un solo usuario por ID
  async findOne(user: UserMiddlewareInterface): Promise<User> {

    try {
      console.log(user.user)
      if (user?.user?.id) {
        const id = user?.user?.id
        const userDetails = await this.userRepository.findOne({
          where: { id },
          relations: ['addresses', 'addresses.city']
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


  async addAddressToUser(userId: string, addressData: { address: string, cityId: string }): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['addresses'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const city = await this.cityRepository.findOne({ where: { id: addressData.cityId } });
    if (!city) {
      throw new NotFoundException(`City with id ${addressData.cityId} not found`);
    }

    const newAddress = this.addressRepository.create({
      address: addressData.address,
      city: city,
      user: user,
    });

    await this.addressRepository.save(newAddress);

    user.addresses.push(newAddress); // Agrega la nueva dirección a las existentes
    return this.userRepository.save(user);
  }


  async validateToken(token: any): Promise<any> {
    try {

      console.log(token, "ESTE ES EL TOKEN");

      const payload = await this.jwtService.verifyAsync(token.token, {
        secret: jwtConstants.secret,
      });
      return payload; // Retorna los datos del token si es válido
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }

}
