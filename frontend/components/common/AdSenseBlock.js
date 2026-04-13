import { useEffect } from "react";

export default function AdSenseBlock() {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!adsenseClient || typeof window === "undefined") {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (_error) {
      // Ignore AdSense boot timing issues in local development.
    }
  }, [adsenseClient]);

  if (!adsenseClient) {
    return (
      <div className="rounded-[24px] border border-dashed border-white/15 bg-white/5 p-5 text-sm text-slate-300">
        AdSense placeholder. Add `NEXT_PUBLIC_ADSENSE_CLIENT` to render live ads on free plan pages.
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-3">
      <p className="mb-3 text-xs uppercase tracking-[0.3em] text-slate-400">Sponsored</p>
      <ins
        className="adsbygoogle block min-h-[120px] w-full"
        style={{ display: "block" }}
        data-ad-client={adsenseClient}
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
