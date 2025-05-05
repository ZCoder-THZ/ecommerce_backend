import { z } from 'zod';
import { BaseDto } from './base.dto';

import { registerSchema, loginSchema } from '../schemas/auth.schema';

export type CreateUserDto = z.output<typeof registerSchema>;
export type LoginUserDto = z.output<typeof loginSchema>;
export class UserCreateDto extends BaseDto<CreateUserDto> {
    constructor() {
        super(
            registerSchema
        );
    }
}
export class UserLoginDto extends BaseDto<LoginUserDto> {
    constructor() {
        super(
            loginSchema
        );
    }
}


export const createUserDto = () => new UserCreateDto();
export const loginUserDto = () => new UserLoginDto();