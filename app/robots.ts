
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/trips/"],
      },
    ],
    sitemap: "https://tabidock.com/sitemap.xml",
    host: "https://tabidock.com",
  };
}
