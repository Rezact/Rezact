import { UserConfig } from "vite";

interface defOptions {
  routes?: any[];
  options?: {
    useMdx?: boolean;
  };
}

export declare const configRezact: (item: defOptions) => UserConfig;
