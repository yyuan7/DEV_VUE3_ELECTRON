/** Caching can enhance performance by reducing the need to re-render. */

export interface LayoutSettings {
  cacheTagsView: boolean
  maxTagsView: number
  affixTagsView: number
}

export const defaultSettings: LayoutSettings = {
  cacheTagsView: false,
  // maxTagsView: 3, // test only
  maxTagsView: 10, // affix not included
  affixTagsView: 1
}
