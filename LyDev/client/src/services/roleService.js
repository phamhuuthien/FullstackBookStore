import * as request from "../utils/request";

export const getAllRole = async () => {
  const result = await request.get("role");
  return result;
};

export const createRole = async (data) => {
  const result = await request.post("role", data);
  return result;
};

export const updateRole = async (data) => {
  const result = await request.put(`role/${data.id}`, data);
  return result;
};

export const deleteRole = async (data) => {
  const result = await request.del(`role/${data._id}`);
  return result;
};
