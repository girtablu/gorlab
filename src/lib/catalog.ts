import rawConfig from "../../catalog.config.js";
import type { CatalogConfig, CustomField, FilterDimension } from "./config.js";

const cfg = rawConfig as CatalogConfig;

export const config = {
  // Identity
  title: cfg.title,
  description: cfg.description ?? "",
  siteUrl: cfg.siteUrl ?? "",

  // Appearance
  theme: cfg.theme ?? "vintage",

  // Content display
  postsPerPage: cfg.postsPerPage ?? 24,
  showCost: cfg.showCost ?? false,

  // Navigation & filters
  showTagCloud: cfg.showTagCloud ?? true,
  showFilterBar: cfg.showFilterBar ?? true,
  filters:
    cfg.filters ??
    ({} as Partial<
      Record<"category" | "author" | "genre" | "cost" | "tags", FilterDimension>
    >),

  // Custom fields
  customFields: cfg.customFields ?? ([] as CustomField[]),

  // Custom stylesheet
  customCss: cfg.customCss ?? null,

  // Community submissions
  showSubmitForm: cfg.showSubmitForm ?? false,
  staticmanUrl: cfg.staticmanUrl ?? "",
  categories: cfg.categories,
};

export type ResolvedConfig = typeof config;
