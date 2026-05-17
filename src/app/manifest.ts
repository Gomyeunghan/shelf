import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shelf-너 무슨 노래 들어?",
    short_name: "Shelf",
    description: "내가 듣는 노래를 친구들과 공유하는 앱",
    start_url: "/",
    display: "standalone", // 주소창 없는 앱 모드
    background_color: "#ffffff",
    theme_color: "#007bff",
    icons: [
      {
        src: "/public/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/public/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
