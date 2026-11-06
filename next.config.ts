import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n.ts");

// Old page URLs, permanently redirected to their current paths. Listed
// explicitly (no catch-all) so static assets sharing the prefix are not
// redirected.
const REDIRECTED_PAGES = [
  "blog",
  "dogadjaji",
  "igre",
  "kontakt",
  "o-klubu",
  "rezervacija",
  "shop",
];

const nextConfig: NextConfig = {
  redirects() {
    return Promise.resolve([
      { source: "/irena", destination: "/", permanent: true },
      ...REDIRECTED_PAGES.map((page) => ({
        source: `/irena/${page}`,
        destination: `/${page}`,
        permanent: true,
      })),
    ]);
  },
  images: {
    // Allow-list of remote image hosts used in the Google Sheets content
    // (BlogPosts.image, Prostorije.image). Local images from /public need no
    // entry. Add a host here before using it in a sheet, otherwise
    // next/image will throw when rendering that page.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        pathname: "**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
