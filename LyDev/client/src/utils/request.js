const API_DOMAIN = "http://localhost:8000/api/v1/";

export const getNoToken = async (path) => {
  const response = await fetch(`${API_DOMAIN}${path}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const result = await response.json();
  return result;
};

export const get = async (path) => {
  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
  if (!token) {
    throw new Error("Access token not found in cookie.");
  }

  const response = await fetch(`${API_DOMAIN}${path}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      // Thêm token vào header
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();
  return result;
};

export const postNoToken = async (path, options) => {
  const formData = new URLSearchParams();
  for (const key in options) {
    formData.append(key, options[key]);
  }

  const response = await fetch(`${API_DOMAIN}${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    credentials: "include",
    body: formData,
  });

  const result = await response.json();
  return result;
};

export const post = async (path, options) => {
  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
  if (!token) {
    throw new Error("Access token not found in cookie.");
  }
  const formData = new URLSearchParams();
  for (const key in options) {
    formData.append(key, options[key]);
  }

  const response = await fetch(`${API_DOMAIN}${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      // Thêm token vào header
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await response.json();
  return result;
};

export const del = async (path) => {
  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
  if (!token) {
    throw new Error("Access token not found in cookie.");
  }
  const response = await fetch(`${API_DOMAIN}${path}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      // Thêm token vào header
      Authorization: `Bearer ${token}`,
    },
  });
  const result = response.json();
  return result;
};


export const put = async (path, options) => {
  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
  if (!token) {
    throw new Error("Access token not found in cookie.");
  }

  const response = await fetch(`${API_DOMAIN}${path}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      // Thêm token vào header
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(options),
  });

  const result = await response.json();
  return result;
};
