import { createContext, useContext } from "react";
import { ViewportContext } from "../context/viewport";
import WindowConfig from "../interfaces/window";


export default function useViewport(): WindowConfig {
  return useContext(ViewportContext);
}