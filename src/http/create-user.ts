import { getAuthToken } from "@/auth/cookie-auth";
import { api } from "./api-client";

export interface UsersRequestData {
  name: string;
  email: string;
  startupName?: string;
  phone?: string ;
}


export async function CreateUser({email, startupName, name, phone}: UsersRequestData) {
  await api.post("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${await getAuthToken()}`,
    },
    json: {
      email,
      startupName,
      name,
      phone
    }
  }).json<{message: string}>();
}