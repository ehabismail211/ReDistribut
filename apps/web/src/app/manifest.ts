import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Redistribut",
    short_name: "ReDist",
    description: "Redistribute surplus inventory before it becomes waste.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7faf6",
    theme_color: "#087e61",
    icons: [
      {
        src: "/brand/redistribut-mark.png",
        sizes: "150x136",
        type: "image/png",
      },
    ],
  };
}
