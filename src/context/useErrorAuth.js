import { useContext } from "react";
import { ErrorContext } from "./ErrorContextObject";

export function useErrorAuth() {
  return useContext(ErrorContext);
}
