import { Image } from "@chakra-ui/react";

export default function SSpinner2({
  imageUrl,
  width,
  height,
  borderRadius,
}: {
  imageUrl: string;
  width: string;
  height: string;
  borderRadius?: string;
}) {
  return (
    <div
      style={{
        fontSize: "50px",
        animation: "spin 1s linear infinite",
      }}
    >
      <style>
        {`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}
      </style>
      <Image
        src={imageUrl} //"https://cdn.discordapp.com/attachments/1101852772120399873/1192639654458052658/IMG_5662.png?ex=65a9cf3b&is=65975a3b&hm=10f0ade7f47935e5b3a6ac691cc51a4453b78dbae5b807aa3007d5a957a87e57&" //"/images/gifs/Ranch.gif" //"https://cdn.discordapp.com/attachments/1101852772120399873/1192639408210444298/Genius.png?ex=65a9cf01&is=65975a01&hm=825b4302d167bdc5da8a724d527f1d25e0807dba64e2dcffe608bb7e83784c53&"
        h={height}
        w={width}
        borderRadius={borderRadius}
      />
    </div>
  );
}
