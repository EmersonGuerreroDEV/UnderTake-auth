


import { IsEmail, IsObject, IsString, MinLength, isString, minLength } from "class-validator";

export class addAddressDto {

    @IsString()
    @IsEmail()
    address: string


    @IsString()
    @IsEmail()
    cityId: string




}
