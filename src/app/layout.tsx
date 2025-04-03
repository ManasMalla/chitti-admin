import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CHITTI.",
  description: "Admin Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="container max-w-[100vw]">
          <div className="sidebar">
            <Link className="logo" href="/">
              CHITTI.
            </Link>
            <nav className="navbar">
              <h3>Resources</h3>
              <Link href="/university-core">University Core</Link>
              <Link href="/faculty-core">Faculty Core</Link>
              <Link href="/program-core">Program Core</Link>
              <Link href="/program-elective">Program Elective</Link>
              <Link href="/open-elective">Open Elective</Link>
              <Link href="/management-basket">Management Basket</Link>

              <h3>Statistics</h3>
            </nav>
            {/* <button className="addcourse" onClick={() => addResource()}>Add Courses</button> */}
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
