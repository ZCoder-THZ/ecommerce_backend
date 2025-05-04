// services/error.service.ts
import { ZodError } from "zod";

class ErrorService {
    static handle(error: any): { statusCode: number; message: string } {
        if (error instanceof ZodError) {
            console.log(error)
            return {
                statusCode: 400,
                message: error.errors
                    .map((e) => `${e.path.join(".")}: ${e.message}`)
                    .join(", "),
            };
        }



        return { statusCode: 500, message: "Something went wrong." };
    }
}

export default ErrorService;