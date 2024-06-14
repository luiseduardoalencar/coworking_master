import { env } from "@/env";

export async function fetchWrapper<T = unknown>(
  input : RequestInfo | URL,
  init? : RequestInit | undefined
) {
  const data = await fetch(
    `${"http://localhost:3000/"}${input}`,
    init
  )
  const result = await data.json();
  return result as T
}