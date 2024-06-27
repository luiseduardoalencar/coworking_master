import { getAuthToken } from "@/auth/cookie-auth";
import { api } from "./api-client";

export interface SpaceRequestData {
  id?: string | null; 
  name: string;
  type: string;
  seat: string
  
}


export async function CreateSpace({name, type, seat}: SpaceRequestData) {
  const response  = await api.post("/api/coworking", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${await getAuthToken()}`,
    },
    json: {
      name,
      type,
      seat
    }
  }).json<{id: string}>();
  return response
}