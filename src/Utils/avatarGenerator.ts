import multiavatar from "@multiavatar/multiavatar";
import { generate, count } from "random-words";

const avatarGenerator = (text: string) => {
  //TODO: implement random text generator
  // const svg = multiavatar(generate({minLength:16}));

  const svg = multiavatar(generate() as string);
  const svgBase64 = `data:image/svg+xml;base64,${btoa(svg)}`;
  return svgBase64;
};

export default avatarGenerator;
