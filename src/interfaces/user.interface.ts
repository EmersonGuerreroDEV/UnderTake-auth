import { UserRoles, UserStatus } from "src/common/utils/enums";


export interface UserMiddlewareInterface {
    user: UserInterface,

}

export interface UserInterface {
    id?: string


    fullName: string;

    status: UserStatus;

    email: string;

    document: string;

    dateBirth: Date;

    photo: string;

    instagram: string;

    questions: object[];

    phone: string



    code: string


    role: UserRoles;

    password: string;

    securityToken: string;

    addresses: {
        id: string; // ID de la dirección
        address: string; // Dirección
        city: { // Relación con la ciudad
            id: string;
            name: string;
        };
    }[];

}
