import { Request, Response } from 'express';
import { formatZodErrorsDetailed } from '../utils/error-formatter';
import AuthService from '../services/AuthService';
import { createUserDto, loginUserDto } from '../dtos/user.dto';
import { ErrorResponse, RegisterResponse } from '../types/response/authResponse';
class AuthController {
    async register(req: Request, res: Response): Promise<void> {
        try {
            const userDto = createUserDto();
            const validationResult = userDto.safeParse(req.body);
            if (!validationResult.success) {
                res.status(400).json(
                    formatZodErrorsDetailed(validationResult.error)
                );
                return;
            }
            const userRegistrationData = validationResult.data;
            const user = await AuthService.register(userRegistrationData);

            res.json(user as RegisterResponse);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            res.status(500).json({
                message: errorMessage,
                data: null
            } as ErrorResponse);
        }
    }

    async login(req: Request, res: Response) {
        try {
            const userDto = loginUserDto();
            const validationResult = userDto.safeParse(req.body);
            if (!validationResult.success) {
                res.status(400).json(
                    formatZodErrorsDetailed(validationResult.error)
                );
                return;
            }
            const userLoginData = validationResult.data;
            const user = await AuthService.login(userLoginData);
            res.json(user);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            res.status(500).json({
                message: errorMessage,
                data: null
            } as ErrorResponse);
        }

    }
}

const authController = new AuthController();
export default authController;