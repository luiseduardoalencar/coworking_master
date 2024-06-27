import { getAuthToken } from "@/auth/cookie-auth";
import { api } from "./api-client";

export interface UpdateSeatRequestData {
  seatOwnerId: string;
  busy?: boolean;
  seatId: string;
  startTime: string;
  endTime: string;
  coworkingId: string;
}

export const UpdateSeat = async ({busy, seatOwnerId, seatId, startTime, endTime, coworkingId}: UpdateSeatRequestData) => {
  const response = await api.put("/api/coworking/update-seat", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${await getAuthToken()}`,
    },
    json: {
      seatOwnerId,
      busy,
      seatId,
      startTime,
      endTime,
      coworkingId
    },
  });

  return response;
};
