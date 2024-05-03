import { del, get, post, getNoToken, postNoToken, put } from "../utils/request";

export const login = async (options) => {
  const result = await postNoToken("user/login", options);
  return result;
};

export const forgotPassword = async (email) => {
  const result = await getNoToken(`user/forgotPassword?email=${email}`);
  return result;
};

export const register = async (options) => {
  const result = await postNoToken("user/register", options);
  return result;
};

export const logout = async () => {
  const result = await getNoToken("user/logout");
  return result;
};

export const editUser = async (options) => {
  const result = await put("user/updateUser", options);
  return result;
};
