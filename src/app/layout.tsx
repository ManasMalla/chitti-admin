"use client";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const geistSans = Plus_Jakarta_Sans({
  variable: "--font-geist-sans",
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
      <body className={`${geistSans.className} dark:bg-black dark:text-white`}>
        <div className="container max-w-[100vw]">
          {pathname != "/" && (
            <div className="sidebar">
              <div>
                <Link className="logo" href="/">
                  CHITTI.
                </Link>
                <p
                  style={{
                    fontSize: "0.7rem",
                    marginBottom: "1rem",
                  }}
                >
                  Your last minute exam prep
                </p>
              </div>
              <nav className="navbar">
                <h3>Resources</h3>
                <Link
                  href="/university-core"
                  className={
                    pathname.includes("/university-core") ? "active" : ""
                  }
                >
                  <span className="material-symbols-outlined">school</span>{" "}
                  University Core
                </Link>
                <Link
                  href="/faculty-core"
                  className={pathname.includes("/faculty-core") ? "active" : ""}
                >
                  <span className="material-symbols-outlined">face_4</span>{" "}
                  Faculty Core
                </Link>
                <Link
                  href="/program-core"
                  className={pathname.includes("/program-core") ? "active" : ""}
                >
                  <span className="material-symbols-outlined">code</span>{" "}
                  Program Core
                </Link>
                <Link
                  href="/program-elective"
                  className={
                    pathname.includes("/program-elective") ? "active" : ""
                  }
                >
                  <span className="material-symbols-outlined">
                    head_mounted_device
                  </span>{" "}
                  Program Elective
                </Link>
                <Link
                  href="/open-elective"
                  className={
                    pathname.includes("/open-elective") ? "active" : ""
                  }
                >
                  <span className="material-symbols-outlined">biotech</span>{" "}
                  Open Elective
                </Link>
                <Link
                  href="/management-basket"
                  className={
                    pathname.includes("/management-basket") ? "active" : ""
                  }
                >
                  <span className="material-symbols-outlined">
                    business_center
                  </span>{" "}
                  Management Basket
                </Link>

                <h3>Previlages</h3>
                <Link
                  href="/revoke-device"
                  className={
                    pathname.includes("/revoke-device") ? "active" : ""
                  }
                >
                  <span className="material-symbols-outlined">devices</span>{" "}
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
