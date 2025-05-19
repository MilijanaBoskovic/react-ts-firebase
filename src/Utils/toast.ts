import { toast } from "react-toastify";
import { setLoadingType } from "../Types";

export const toastErr = (msg: string, setLoading?: setLoadingType) => {
  toast.error(msg);
  setLoading && setLoading(false);
};
export const toastSucc = (msg: string, setLoading?: setLoadingType) => {
  toast.success(msg);
  setLoading && setLoading(false);
};
export const toastWarn = (msg: string, setLoading?: setLoadingType) => {
  toast.warn(msg);
  setLoading && setLoading(false);
};
export const toastInfo = (msg: string, setLoading?: setLoadingType) => {
  toast.info(msg);
  setLoading && setLoading(false);
};
