
export type RegisterResponse = {
    token: string;
    data: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
};

export type ErrorResponse = {
    message: string;
    data: null;
};
