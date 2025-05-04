import { z } from 'zod';
import { BaseDto } from './base.dto';

import { registerSchema } from '../schemas/auth.schema';


// ✅ This ensures 'role' is NOT possibly undefined after default applied
export type CreateUserDto = z.output<typeof registerSchema>;

export class UserCreateDto extends BaseDto<CreateUserDto> {
    constructor() {
        super(
            registerSchema
        );
    }
}

export const createUserDto = () => new UserCreateDto();
