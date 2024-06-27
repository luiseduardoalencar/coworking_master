import { getAuthToken } from "@/auth/cookie-auth";
import { api } from "./api-client";

export interface ProfileResponseData {
  name: string;
  email: string;
  id: string;
  role: string;
}

export async function Profile() {
 const response = await api
    .get("/api/admin/get-admin-profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${await getAuthToken()}`,
      },
    })
    .json<ProfileResponseData>();
    return response
}
