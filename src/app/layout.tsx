import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
           <a className="logo" href="/">CHITTI.</a>
            <nav className="navbar">
              <h3>Resources</h3>
              <a href="/university-core">University Core</a>
              <a href="/faculty-core">Faculty Core</a>
              <a href="/program-core">Program Core</a>
              <a href="/program-elective">Program Elective</a>
              <a href="/open-elective">Open Elective</a>
              <a href="/management-basket">Management Basket</a>

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
