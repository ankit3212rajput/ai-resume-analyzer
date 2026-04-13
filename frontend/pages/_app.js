import Head from "next/head";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Manrope, Sora } from "next/font/google";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "@/context/AuthContext";
import "@/styles/globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
});

export default function App({ Component, pageProps }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const content = (
    <AuthProvider>
      <main className={`${manrope.variable} ${sora.variable}`}>
        <Component {...pageProps} />
        <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      </main>
    </AuthProvider>
  );

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {googleClientId ? <GoogleOAuthProvider clientId={googleClientId}>{content}</GoogleOAuthProvider> : content}
    </>
  );
}
