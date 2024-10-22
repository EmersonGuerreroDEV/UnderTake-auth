
import { IsString } from 'class-validator';


export class RestorePasswordDto {
    @IsString()
    token: string;

    @IsString()
    password: string;

}
