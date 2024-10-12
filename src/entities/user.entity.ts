import {
    Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserRoles, UserStatus } from '../common/utils/enums';
import { Address } from './address.entity';

@Entity('users') // Nombre de la tabla en la base de datos
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    fullName: string;

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus;

    @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    document: string;

    @Column({ type: 'date', nullable: true })
    dateBirth: Date;

    @Column({ type: 'varchar', length: 255, nullable: true })
    photo: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    instagram: string;

    @Column({ type: 'json', nullable: true })
    questions: object[];

    @Column({ type: 'varchar', length: 20, nullable: true })
    phone: string;

    @Column({ type: 'varchar', length: 255, default: uuidv4() })
    code: string;

    @Column({ type: 'enum', enum: UserRoles, default: UserRoles.USER })
    role: UserRoles;

    @Column({ type: 'varchar', length: 255, nullable: false })
    password: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    securityToken: string;

    @OneToMany(() => Address, (address) => address.user)
    addresses: Address[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
