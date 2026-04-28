import rawConfig from '../../catalog.config.js'
import type { CatalogConfig, CustomField, FilterDimension } from './config.js'

const cfg = rawConfig as CatalogConfig

export const config = {
  title: cfg.title,
  description: cfg.description ?? '',
  theme: cfg.theme ?? 'cerberus',
  postsPerPage: cfg.postsPerPage ?? 24,
  showSubmitForm: cfg.showSubmitForm ?? true,
  showTagCloud: cfg.showTagCloud ?? true,
  showFilterBar: cfg.showFilterBar ?? true,
  filters: cfg.filters ?? ({} as Partial<Record<'category' | 'author' | 'genre' | 'cost' | 'tags', FilterDimension>>),
  categories: cfg.categories,
  customFields: cfg.customFields ?? ([] as CustomField[]),
  staticmanUrl: cfg.staticmanUrl ?? '',
}

export type ResolvedConfig = typeof config
