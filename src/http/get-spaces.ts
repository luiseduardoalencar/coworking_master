import { api } from "./api-client";

export interface SpaceResponseData {
  id?: string | null;
  name: string;
  type: string;
  imageUrl?: string | null;
  Seat?: {
    busy?: boolean | null
  }[]
}

export async function GetSpaces() {
  const response = await api.get("/api/coworking/get-coworkings").json<SpaceResponseData[]>();
  return response
}