"use client";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DarkModeProvider } from "@/components/DarkModeProvider";
import { DarkModeToggle } from "@/components/DarkModeToggle";

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
    <html lang="en" className="font-poppins">
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
      <body className={`${geistSans.className} font-poppins transition-colors duration-200`} style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <DarkModeProvider>
          <div className="container max-w-[100vw]">
            {pathname != "/" && (
              <div className="sidebar" style={{ backgroundColor: 'var(--bg-primary)', borderRightColor: 'var(--border-color)' }}>
                <div className="flex items-center justify-between mb-4">
                  <Link className="logo" href="/" style={{ color: 'var(--primary)' }}>
                    CHITTI.
                  </Link>
                  <DarkModeToggle />
                </div>
                <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                  Your last minute exam prep
                </p>
                <nav className="navbar">
                  <h3 className="text-sm font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>Resources</h3>
                  <Link
                    href="/university-core"
                    className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${
                      pathname.includes("/university-core") 
                        ? "font-semibold" 
                        : ""
                    }`}
                    style={{
                      color: pathname.includes("/university-core") ? 'var(--primary)' : 'var(--text-primary)',
                      backgroundColor: pathname.includes("/university-core") ? 'rgba(242, 110, 12, 0.1)' : 'transparent'
                    }}
                  >
                    <span className="material-symbols-outlined">school</span>
                    University Core
                  </Link>
                  <Link
                    href="/faculty-core"
                    className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${
                      pathname.includes("/faculty-core") 
                        ? "font-semibold" 
                        : ""
                    }`}
                    style={{
                      color: pathname.includes("/faculty-core") ? 'var(--primary)' : 'var(--text-primary)',
                      backgroundColor: pathname.includes("/faculty-core") ? 'rgba(242, 110, 12, 0.1)' : 'transparent'
                    }}
                  >
                    <span className="material-symbols-outlined">face_4</span>
                    Faculty Core
                  </Link>
                  <Link
                    href="/program-core"
                    className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${
                      pathname.includes("/program-core") 
                        ? "font-semibold" 
                        : ""
                    }`}
                    style={{
                      color: pathname.includes("/program-core") ? 'var(--primary)' : 'var(--text-primary)',
                      backgroundColor: pathname.includes("/program-core") ? 'rgba(242, 110, 12, 0.1)' : 'transparent'
                    }}
                  >
                    <span className="material-symbols-outlined">code</span>
                    Program Core
                  </Link>
                  <Link
                    href="/program-elective"
                    className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${
                      pathname.includes("/program-elective") 
                        ? "font-semibold" 
                        : ""
                    }`}
                    style={{
                      color: pathname.includes("/program-elective") ? 'var(--primary)' : 'var(--text-primary)',
                      backgroundColor: pathname.includes("/program-elective") ? 'rgba(242, 110, 12, 0.1)' : 'transparent'
                    }}
                  >
                    <span className="material-symbols-outlined">head_mounted_device</span>
                    Program Elective
                  </Link>
                  <Link
                    href="/open-elective"
                    className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${
                      pathname.includes("/open-elective") 
                        ? "font-semibold" 
                        : ""
                    }`}
                    style={{
                      color: pathname.includes("/open-elective") ? 'var(--primary)' : 'var(--text-primary)',
                      backgroundColor: pathname.includes("/open-elective") ? 'rgba(242, 110, 12, 0.1)' : 'transparent'
                    }}
                  >
                    <span className="material-symbols-outlined">biotech</span>
                    Open Elective
                  </Link>
                  <Link
                    href="/management-basket"
                    className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${
                      pathname.includes("/management-basket") 
                        ? "font-semibold" 
                        : ""
                    }`}
                    style={{
                      color: pathname.includes("/management-basket") ? 'var(--primary)' : 'var(--text-primary)',
                      backgroundColor: pathname.includes("/management-basket") ? 'rgba(242, 110, 12, 0.1)' : 'transparent'
                    }}
                  >
                    <span className="material-symbols-outlined">business_center</span>
                    Management Basket
                  </Link>

                  <h3 className="text-sm font-semibold uppercase tracking-wide mb-2 mt-6" style={{ color: 'var(--text-muted)' }}>Privileges</h3>
                  <Link
                    href="/revoke-device"
                    className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${
                      pathname.includes("/revoke-device") 
                        ? "font-semibold" 
                        : ""
                    }`}
                    style={{
                      color: pathname.includes("/revoke-device") ? 'var(--primary)' : 'var(--text-primary)',
                      backgroundColor: pathname.includes("/revoke-device") ? 'rgba(242, 110, 12, 0.1)' : 'transparent'
                    }}
                  >
                    <span className="material-symbols-outlined">devices</span>
                    Revoke Device
                  </Link>
                  <Link
                    href="/instructors"
                    className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${
                      pathname.includes("/instructors") 
                        ? "font-semibold" 
                        : ""
                    }`}
                    style={{
                      color: pathname.includes("/instructors") ? 'var(--primary)' : 'var(--text-primary)',
                      backgroundColor: pathname.includes("/instructors") ? 'rgba(242, 110, 12, 0.1)' : 'transparent'
                    }}
                  >
                    <span className="material-symbols-outlined">communication</span>
                    Manage Instructors
                  </Link>
                </nav>
              </div>
            )}
            {children}
          </div>
        </DarkModeProvider>
      </body>
    </html>
  );
}
