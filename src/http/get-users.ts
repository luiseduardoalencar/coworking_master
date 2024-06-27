import { api } from "./api-client";

export interface UsersResponseData {
  id: string;
  name: string;
  email: string;
  startupName?: string;
  phone?: string ;
}

export async function getUsers() {
  const response = await api.get("/api/users/get-users").json<UsersResponseData[]>();
  return response
}