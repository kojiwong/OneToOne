import { createContext } from 'react';

export const AuthContext = createContext({
    refreshToken: "",
    accessToken: "",
    setRefreshToken: () => {},
    setAccessToken: () => {},
});
