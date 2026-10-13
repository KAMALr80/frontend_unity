import type { NextConfig } from "next";
import path from "node:path";

const configuredImagePatterns = process.env.IMAGE_CDN_URL
  ? [new URL(process.env.IMAGE_CDN_URL)]
  : [];

// Images the backend serves itself (CMS uploads in /storage, product thumbnails in /api/media), on whatever
// host NEXT_PUBLIC_API_URL points to, so a production API host works without editing this file.
const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/+$/, "").replace(/\/api$/, "");
const apiImagePatterns = [new URL(`${apiOrigin}/storage/**`), new URL(`${apiOrigin}/api/media/**`)];

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "pdfjs-dist": "pdfjs-dist/legacy/build/pdf.mjs",
    },
  },
  images: {
  dangerouslyAllowLocalIP: true,

  remotePatterns: [
    ...configuredImagePatterns,
    ...apiImagePatterns,
    new URL("https://c8.alamy.com/comp/**"),
    new URL("https://hotpink-parrot-228156.hostingersite.com/storage/**"),
    new URL("https://hotpink-parrot-228156.hostingersite.com/api/media/**"),
    new URL("https://erp.centralsmokedistro.com/uploads/**"),
    new URL("https://erp.unitywholesales.com/uploads/**"),
    new URL("https://unitywholesales.com/wp-content/uploads/**"),

    new URL("http://127.0.0.1:8000/storage/**"),
    new URL("http://localhost:8000/storage/**"),

    new URL("http://127.0.0.1:8000/api/media/**"),
    new URL("http://localhost:8000/api/media/**"),
  ],

  qualities: [75],
  // Optimized banners/logos are kept 30 days (default 4 hours). A replaced CMS image gets a new file name,
  // so this never serves an outdated picture; it only stops re-fetching the slow source hosts.
  minimumCacheTTL: 2592000,
},
  // Old WordPress address of the featured page, so existing links and bookmarks keep working.
  async redirects() {
    return [{ source: "/feature-product", destination: "/featured", permanent: true }];
  },
  webpack(config) {
    // The modern PDF.js bundle contains its own Webpack runtime and crashes
    // when Next's Webpack compiler processes it. Use PDF.js's compatibility
    // entry while preserving the same React-PDF API.
    config.resolve.alias = {
      ...config.resolve.alias,
      "pdfjs-dist$": path.resolve(
        process.cwd(),
        "node_modules/pdfjs-dist/legacy/build/pdf.mjs",
      ),
    };

    return config;
  },
};

export default nextConfig;
