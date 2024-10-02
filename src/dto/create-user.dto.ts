
import { IsArray, IsBoolean, IsDate, IsEnum, IsMongoId, IsObject, IsString } from 'class-validator';
import { UserRoles, UserStatus } from 'src/common/utils/enums';


export class CreateUserDto {
    @IsString()
    fullName?: string;

    @IsString()
    @IsEnum(UserStatus)
    status?: string;

    @IsString()
    email?: string;

    @IsString()
    document?: string;

    @IsString()
    @IsDate()
    dateBirth?: Date;

    @IsString()
    photo?: string;

    @IsString()
    instagram?: string;

    @IsArray()
    questions?: object[];

    @IsString()
    phone?: string


    @IsString()
    code?: string

    @IsString()
    @IsEnum(UserRoles)
    role?: string;

    @IsString()
    password?: string;

    @IsString()
    securityToken?: string;

    @IsObject()
    sendAddress?: {
        department: string;
        address: string;
        city:string;
        neighborhood: string;
        zipCode: string
    };

    @IsString()
    reference?: string



}
