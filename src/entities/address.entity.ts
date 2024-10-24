import {
    Entity, Column, PrimaryGeneratedColumn, ManyToOne
} from 'typeorm';
import { City } from './city.entity';
import { User } from './user.entity';

@Entity('addresses') // Nombre de la tabla en la base de datos
export class Address {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    address: string;

    @Column({})
    postalCode: string;

    @Column({})
    neighborhood: string

    @ManyToOne(() => City, (city) => city.addresses, { nullable: false })
    city: City;

    @ManyToOne(() => User, (user) => user.addresses, { nullable: false })
    user: User;
}
