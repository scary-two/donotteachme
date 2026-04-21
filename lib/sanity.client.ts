import {createClient} from "next-sanity";

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "wooaj8n0";
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-04-19",
  useCdn: true,
  perspective: "published",
});

export const sanityConfig = {
  projectId,
  dataset,
  apiVersion: "2026-04-19",
};
