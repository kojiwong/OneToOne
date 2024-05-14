import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLocalStorage } from "./useLocalStorage";

// NOTE: optimally move this into a separate file

export const useUser = () => {
  // const { accessToken, setAccessToken, refreshToken, setRefreshToken } = useContext(AuthContext);

  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");

  const { setItem } = useLocalStorage();

  const addUser = (accessToken, refreshToken) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken)
    setItem("accessToken", accessToken);
    setItem("refreshToken", refreshToken);
  };

  const removeUser = () => {
    setAccessToken(null);
    setRefreshToken(null)
    setItem("accessToken", "");
    setItem("refreshToken", "");
  };

  return { accessToken, setAccessToken, refreshToken, setRefreshToken, addUser, removeUser };
};