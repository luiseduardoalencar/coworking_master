import { api } from "./api-client"

export const DeleteUser = async (id: string) => {
  await api.delete(`/api/users/delete-user?id=${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    }
  })
}
