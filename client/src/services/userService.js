import { del, get, post, put } from "../utils/request";

export const editUser = async (options) => {
  const result = await put("user/updateUser", options);
  return result;
};
