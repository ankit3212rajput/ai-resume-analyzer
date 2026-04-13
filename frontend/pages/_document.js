import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#0f172a" />
        <meta name="application-name" content="AI Resume Analyzer Pro" />
        {adsenseClient ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        ) : null}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
