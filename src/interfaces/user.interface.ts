import { UserRoles, UserStatus } from "src/common/utils/enums";


export interface UserMiddlewareInterface {
    user: UserInterface,
    he
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

    sendAddress: {
        address: string;
        city: string,
        neighborhood: string;
        reference: string;
        department: string,
    };

    reference: string
}


