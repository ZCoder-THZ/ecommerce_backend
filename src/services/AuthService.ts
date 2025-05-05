import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/userRepository';
import { RegisterType, LoginType } from '../types/auth';


interface TokenPayload {
    id: string;
    role: number;
    name: string;
}

class AuthService {
    private readonly saltRounds: number = 10;


    public generateToken(user: TokenPayload): string {

        const secret = process.env.TOKEN_SECRET;
        if (!secret) {
            throw new Error('TOKEN_SECRET environment variable is not set');
        }


        return jwt.sign(
            user,
            secret,
            { expiresIn: '1h' }
        );
    }

    public verifyToken(token: string): TokenPayload | null {
        try {
            const secret = process.env.TOKEN_SECRET;
            if (!secret) {
                throw new Error('TOKEN_SECRET environment variable is not set');
            }

            const decoded = jwt.verify(token, secret);
            return decoded as TokenPayload;
        } catch (error) {
            return null;
        }
    }


    public async register(userData: RegisterType) {

        const existingUser = await userRepository.findUserByEmail(userData.email);
        if (existingUser) {
            return {
                success: false,
                error: 'Email already in use',
                data: null,
            };
        }

        try {

            const hashedPassword = await bcrypt.hash(userData.password, this.saltRounds);


            const newUser = await userRepository.createSingleUser({
                ...userData,
                password: hashedPassword,
            });

            if (!newUser) {
                return {
                    success: false,
                    error: 'Failed to create user',
                    data: null,
                };
            }


            const token = this.generateToken({
                id: newUser.id,
                role: newUser.role === 'ADMIN' ? 1 : 0,
                name: newUser.name ?? '',
            });

            return {
                success: true,
                error: null,
                data: newUser,
                token,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown registration error',
                data: null,
            };
        }
    }


    public async login(credentials: LoginType) {
        try {

            const user = await userRepository.findUserByEmail(credentials.email);
            if (!user || !user.password) {
                return {
                    success: false,
                    error: 'Invalid email or password',
                    data: null,
                };
            }


            const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
            if (!isPasswordValid) {
                return {
                    success: false,
                    error: 'Invalid email or password',
                    data: null,
                };
            }


            const token = this.generateToken({
                id: user.id,
                role: user.role === 'ADMIN' ? 1 : 0,
                name: user.name ?? '',
            });

            return {
                success: true,
                error: null,
                data: user,
                token,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Authentication error',
                data: null,
            };
        }
    }
}

export default new AuthService();