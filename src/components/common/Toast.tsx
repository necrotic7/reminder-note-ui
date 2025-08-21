// toast.ts
import type { MessageInstance } from "antd/es/message/interface";

let toast: MessageInstance | null = null;

export const setToast = (api: MessageInstance) => {
  toast = api;
};

export const Toast = {
  success: (msg: string) => toast?.success(msg),
  error: (msg: string) => toast?.error(msg),
  info: (msg: string) => toast?.info(msg),
  warning: (msg: string) => toast?.warning(msg),
};