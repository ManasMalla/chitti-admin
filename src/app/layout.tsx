"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <head>
        <title>CHITTI Admin Panel.</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="CHITTI Admin Panel" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="container max-w-[100vw]">
          {pathname != "/" && (
            <div className="sidebar">
              <Link className="logo" href="/">
                CHITTI. Admin
              </Link>
              <nav className="navbar">
                <h3>Resources</h3>
                <Link
                  href="/university-core"
                  className={
                    pathname.includes("/university-core") ? "active" : ""
                  }
                >
                  University Core
                </Link>
                <Link
                  href="/faculty-core"
                  className={pathname.includes("/faculty-core") ? "active" : ""}
                >
                  Faculty Core
                </Link>
                <Link
                  href="/program-core"
                  className={pathname.includes("/program-core") ? "active" : ""}
                >
                  Program Core
                </Link>
                <Link
                  href="/program-elective"
                  className={
                    pathname.includes("/program-elective") ? "active" : ""
                  }
                >
                  Program Elective
                </Link>
                <Link
                  href="/open-elective"
                  className={
                    pathname.includes("/open-elective") ? "active" : ""
                  }
                >
                  Open Elective
                </Link>
                <Link
                  href="/management-basket"
                  className={
                    pathname.includes("/management-basket") ? "active" : ""
                  }
                >
                  Management Basket
                </Link>

                <h3>Previlages</h3>
                <Link
                  href="/revoke-device"
                  className={
                    pathname.includes("/revoke-device") ? "active" : ""
                  }
                >
                  Revoke Device
                </Link>
              </nav>
            </div>
          )}
          {children}
        </div>
      </body>
    </html>
  );
}
