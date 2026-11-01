import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const afacad = localFont({
  src: [
    { path: "../public/Assets/Fonts/Afacad/Afacad-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/Assets/Fonts/Afacad/Afacad-Italic.ttf", weight: "400", style: "italic" },
    { path: "../public/Assets/Fonts/Afacad/Afacad-Medium.ttf", weight: "500", style: "normal" },
    { path: "../public/Assets/Fonts/Afacad/Afacad-MediumItalic.ttf", weight: "500", style: "italic" },
    { path: "../public/Assets/Fonts/Afacad/Afacad-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../public/Assets/Fonts/Afacad/Afacad-SemiBoldItalic.ttf", weight: "600", style: "italic" },
    { path: "../public/Assets/Fonts/Afacad/Afacad-Bold.ttf", weight: "700", style: "normal" },
    { path: "../public/Assets/Fonts/Afacad/Afacad-BoldItalic.ttf", weight: "700", style: "italic" },
  ],
  variable: "--font-afacad",
  display: "swap",
});

const italiana = localFont({
  src: [{ path: "../public/Assets/Fonts/Italiana/Italiana-Regular.ttf", weight: "400", style: "normal" }],
  variable: "--font-italiana",
  display: "swap",
});

const laBelleAurore = localFont({
  src: [{ path: "../public/Assets/Fonts/La Belle Aurore/LaBelleAurore-Regular.ttf", weight: "400", style: "normal" }],
  variable: "--font-la-belle-aurore",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Casamento de João & Serpa",
  description:
    "Convite digital do casamento de João Henrick Camargos e Vitoria Serpa Fernandes, em 6 de fevereiro de 2027. Confirme sua presença e deixe sua mensagem.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${afacad.variable} ${italiana.variable} ${laBelleAurore.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}