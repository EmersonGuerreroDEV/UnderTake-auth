import {
    Entity, Column, PrimaryGeneratedColumn, OneToMany
} from 'typeorm';
import { Address } from './address.entity';

@Entity('cities') // Nombre de la tabla en la base de datos
export class City {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @OneToMany(() => Address, (address) => address.city)
    addresses: Address[];
}
