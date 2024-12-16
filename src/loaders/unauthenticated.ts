import { LoaderFunction } from "react-router-dom";
import { GetSession } from "../pages/global-helpers";

export const Unauthenticated: LoaderFunction = () => {
  const accessToken = GetSession('auth')
  if (accessToken) {
    history.back()
    return null
  }
  return null
}