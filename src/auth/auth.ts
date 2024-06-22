
import  {getCookie} from "cookies-next";

export  function  isAuthenticated() {
  return !!getCookie("token");
}

export function getAuthToken() {
  return getCookie('token');
}