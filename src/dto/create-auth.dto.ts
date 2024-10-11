


import { IsEmail, IsString, MinLength, isString, minLength } from "class-validator";

export class CreateAuthDto {

    @IsString()
    @IsEmail()
    email:string

    @IsString()
    password:string


    @IsString()

    fullName:string

}
