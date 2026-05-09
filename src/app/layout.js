import { Space_Grotesk, Orbitron } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata = {
  title: "BeyClaft — Custom Beyblade Customizer",
  description: "Design your perfect Beyblade online. Swap attack rings, emblems, blades and more. See top and side views live. Save your custom builds.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${orbitron.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary-container selection:text-background">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
