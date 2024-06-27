import { getAuthToken } from "@/auth/cookie-auth";
import { api } from "./api-client";


interface SeatRequestData {
  
  spaceId: string 
 
}

export interface SeatResponseData {
  id: string
  seatNumber: string
  busy: boolean
  coworkingId: string
}


export const GetSeats = async ({ spaceId}: SeatRequestData) => {
  console.log(spaceId);
  
  
  const response = await api.get("/api/coworking/get-seats", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'coworkingId': spaceId,
      "Authorization": `Bearer ${await getAuthToken()}`,
    },
  }).json<SeatResponseData[]>();
  return response
}