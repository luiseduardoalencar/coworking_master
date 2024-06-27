import { getAuthToken } from "@/auth/cookie-auth";
import { api } from "./api-client";

export interface UsersRequestData {
  id?: string | null;
  name: string;
  email: string;
  startupName?: string | null;
  imageUrl?: string | null;
  phone?: string ;
}


export async function UpdateUser({email,id, startupName, name, phone}: UsersRequestData) {
  await api.put("/api/users/update-user", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${await getAuthToken()}`,
    },
    json: {
      email,
      startupName,
      name,
      phone,
      id
    }
  }).json<{message: string}>();
}