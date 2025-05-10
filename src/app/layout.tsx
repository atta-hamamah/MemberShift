import type { Metadata } from "next";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "MemberShift - Buy & Sell Subscriptions",
  description: "Marketplace for new and used memberships and subscriptions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`font-sans bg-background text-foreground antialiased`}>
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-230px)] md:min-h-[calc(100vh-194px)]  ">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-200 py-6 mt-12">
          <div className="container  mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 text-sm mb-4 md:mb-0">© {new Date().getFullYear()} MemberShift. All rights reserved.</p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-500 hover:text-blue-500 transition-colors">Terms</a>
                <a href="#" className="text-gray-500 hover:text-blue-500 transition-colors">Privacy</a>
                <a href="#" className="text-gray-500 hover:text-blue-500 transition-colors">Help</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
