export function getAuthToken() {
  return localStorage.getItem("access_token") || "";
}

export const getHeaders = (isFormData = false) => {
  const token = getAuthToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};
