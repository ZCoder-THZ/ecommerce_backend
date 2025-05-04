import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository';

import { registerType } from '../types/auth';
interface Payload {
    id: string;
    role: number;
    name: string;
}
class AuthService {
    generateToken(user: Payload): string {
        const payload: Payload = {
            id: user.id,
            role: user.role,
            name: user.name,
        };

        const token = jwt.sign(payload, process.env.TOKEN_SECRET as Secret, {
            expiresIn: '1h',
        });

        return token;
    }

    verifyToken(token: string): JwtPayload | string {
        try {
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET as Secret);
            return decoded;
        } catch (error) {
            return 'Invalid token';
        }
    }

    async register(userRegistrationData: registerType) {
        const existingUser = await userRepository.findUserByEmail(userRegistrationData.email);
        if (existingUser) {
            return {
                error: "Email already in use",
                data: null
            };
        }

        const newUser = await userRepository.createSingleUser(userRegistrationData);
        if (!newUser) {
            return {
                error: "Failed to create user",
                data: null
            };
        }

        const token = this.generateToken({
            id: newUser.id,
            role: newUser.role === 'ADMIN' ? 1 : 0,
            name: newUser.name ?? '',
        });

        return { token, data: newUser };
    }


}

export default new AuthService();
