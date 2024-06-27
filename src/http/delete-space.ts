import { api } from "./api-client"

export const DeleteSpace = async (id: string) => {
  await api.delete(`/api/coworking/delete-coworking`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    json: {
      id
    }
  })
}
