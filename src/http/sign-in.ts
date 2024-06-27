import { api } from "./api-client";

export interface SignInBody {
  email: string;
  password: string;
}

export async function signIn({email, password}: SignInBody) {
  await api.post("/api/admin/auth-admin", {
    method: "POST",
    json: {
      email,
      password
    }
  }).json<{token: string}>();
}