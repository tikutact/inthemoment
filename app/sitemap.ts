import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.inthemoment.jp";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/plan/photo`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/plan/photo-movie`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/plan/movie`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/gallery`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/qa`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];
}
