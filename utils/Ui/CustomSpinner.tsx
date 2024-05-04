import { Image, keyframes } from "@chakra-ui/react";

const animationKeyframes = keyframes`
  0% { transform: scale(1) rotate(0); border-radius: 20%; }
  25% { transform: scale(2) rotate(0); border-radius: 20%; }
  50% { transform: scale(2) rotate(270deg); border-radius: 50%; }
  75% { transform: scale(1) rotate(270deg); border-radius: 50%; }
  100% { transform: scale(1) rotate(0); border-radius: 20%; }
`;

const animation = `${animationKeyframes} 2s ease-in-out infinite`;

export default function SSpinner({
  imageUrl,
  width,
  height,
  borderRadius,
}: {
  imageUrl: string;
  width: string | { base: string; md: string };
  height: string | { base: string; md: string };
  borderRadius?: string | number | undefined;
}) {
  return (
    <Image
      src={imageUrl} //"https://cdn.discordapp.com/attachments/1101852772120399873/1192639654458052658/IMG_5662.png?ex=65a9cf3b&is=65975a3b&hm=10f0ade7f47935e5b3a6ac691cc51a4453b78dbae5b807aa3007d5a957a87e57&" //"/images/gifs/Ranch.gif" //"https://cdn.discordapp.com/attachments/1101852772120399873/1192639408210444298/Genius.png?ex=65a9cf01&is=65975a01&hm=825b4302d167bdc5da8a724d527f1d25e0807dba64e2dcffe608bb7e83784c53&"
      h={height}
      w={width}
      borderRadius={borderRadius}
      animation={animation}
    />
  );
}
