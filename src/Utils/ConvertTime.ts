import moment from "moment";
export default function ConvertTime(input: string) {
  return moment(input).format("llll");
}
