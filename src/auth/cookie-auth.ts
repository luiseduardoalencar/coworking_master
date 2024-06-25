'use server';

import  {getCookie} from "cookies-next";
import { cookies } from "next/headers";

export async function  isAuthenticated() {
  return !!getCookie("token");
}

export async  function getAuthToken() {
  return cookies().get("token")?.value;
}

export async function destroySession() {
  cookies().delete("token");
}