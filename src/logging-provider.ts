import { createContext } from "./react";
export const LoggingProvider = createContext<{ log: (typeof console)['log'] }>({log: () => void 0});