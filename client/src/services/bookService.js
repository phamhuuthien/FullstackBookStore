import { del, get, post, patch } from "../utils/request";

export const getBookList = async () => {
  const result = await get("books");
  return result;
};

export const createBook = async (options) => {
  const result = await post("books", options);
  return result;
};

export const deleteBook = async (item) => {
  const result = await del("books", item);
  return result;
};

export const editBook = async (options) => {
  const result = await patch("books", options);
  return result;
};
