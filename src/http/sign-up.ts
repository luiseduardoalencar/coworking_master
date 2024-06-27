import { api } from "./api-client";

export interface SignInBody {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

export async function signUp({email, password, name, confirmPassword}: SignInBody) {
  await api.post("/api/admin/create-admin", {
    method: "POST",
    json: {
      email,
      password,
      name,
      confirmPassword
    }
  }).json<{token: string}>();
}