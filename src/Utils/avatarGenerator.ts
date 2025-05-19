import multiavatar from "@multiavatar/multiavatar";

const avatarGenerator = (text: string) => {
  //TODO: implement random text generator
  const svg = multiavatar(text);
  const svgBase64 = `data:image/svg+xml;base64,${btoa(svg)}`;
  return svgBase64;
};

export default avatarGenerator;
