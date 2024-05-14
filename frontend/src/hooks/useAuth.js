import { useEffect } from "react";
import { useUser } from "./useUser";
import { useLocalStorage } from "./useLocalStorage";

export const useAuth = () => {
  // we can re export the user methods or object from this hook
  const { accessToken, setAccessToken, refreshToken, setRefreshToken, addUser, removeUser } = useUser();
  const { getItem } = useLocalStorage();

  useEffect(() => {
    const accessToken = getItem("accessToken");
    const refreshToken = getItem("refreshToken");

    // console.log("hmmm", accessToken, accessToken);

    if (accessToken && refreshToken) {
        addUser(accessToken, refreshToken);
    }
  }, [getItem, addUser]);

  const login = (accessToken, refreshToken) => {
    addUser(accessToken, refreshToken);
  };

  const logout = () => {
    removeUser();
  };

  return { login, logout, accessToken, setAccessToken, refreshToken, setRefreshToken };
};