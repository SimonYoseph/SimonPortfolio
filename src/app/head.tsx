import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simon Yoseph",
  description: "Interactive Portfolio of Simon Yoseph",
  icons: {
    icon: [
      { url: "/icon-backup.png", sizes: "128x128", type: "image/png" },
    ],
  },
};

export default function Head() {
  return (
    <>
      <link
        rel="icon"
        href="/icon-backup.png"
        sizes="256x256"
        type="image/png"
      />
      <link
        rel="icon"
        href="/icon-backup.png"
        sizes="128x128"
        type="image/png"
      />
      <link
        rel="icon"
        href="/icon-backup.png"
        sizes="64x64"
        type="image/png"
      />
      <link
        rel="icon"
        href="/icon-backup.png"
        sizes="32x32"
        type="image/png"
      />
      <link
        rel="icon"
        href="/icon-backup.png"
        sizes="16x16"
        type="image/png"
      />
    </>
  );
}
