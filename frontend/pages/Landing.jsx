import { useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

export default function Landing() {
  useEffect(() => {
    document.title = "ROASEQ, Self-Hosted Attribution";
  }, []);

  return (
    <>
      <SEO
        title="ROASEQ, Self-Hosted Attribution"
        description="Multi-touch attribution for ecommerce. In your own Postgres."
      />
      <div className="min-h-screen bg-[#101010] text-white flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[#f2ff00]/30 bg-[#f2ff00]/10">
            <span className="w-2 h-2 rounded-full bg-[#f2ff00] animate-pulse"></span>
            <span className="text-sm font-semibold text-[#f2ff00] uppercase tracking-wider">
              Self-Hosted Attribution
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to{" "}
            <span className="text-[#f2ff00] border-b-4 border-[#f2ff00]">
              ROASEQ
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            Multi-touch attribution for ecommerce. The events are rows in
            your database. The models are in the repo. The contract is the
            AGPL. Nothing to renew.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/setup"
              className="bg-[#f2ff00] text-black px-8 py-4 font-bold hover:bg-[#e6e600] inline-block"
            >
              First-run setup
            </Link>
            <Link
              to="/dashboard"
              className="border-2 border-[#f2ff00] text-[#f2ff00] px-8 py-4 font-bold hover:bg-[#f2ff00] hover:text-black inline-block"
            >
              Go to dashboard
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-12">
            <a
              href="https://roaseq.com"
              className="text-[#f2ff00] hover:underline"
            >
              roaseq.com
            </a>{" "}
            is the marketing site.
          </p>
        </div>
      </div>
    </>
  );
}
