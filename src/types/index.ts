export interface AllFontsResponse {
  axisRegistry: AxisRegistry[]
  familyMetadataList: FamilyMetadataList[]
  promotedScript: any
}

export interface AxisRegistry {
  tag: string
  displayName: string
  min: number
  defaultValue: number
  max: number
  precision: number
  description: string
  fallbackOnly: boolean
  fallbacks: Fallback[]
  illustrationUrl?: string
}

export interface Fallback {
  name: string
  value: number
  displayName: string
}

export interface FamilyMetadataList {
  family: string
  displayName?: string
  category: string
  size: number
  subsets: string[]
  fonts: FontVariants
  axes: Axis[]
  designers: string[]
  lastModified: string
  dateAdded: string
  popularity: number
  trending: number
  defaultSort: number
  androidFragment?: string
  isNoto: boolean
  colorCapabilities: string[]
  primaryScript: string
  primaryLanguage: string
}

export interface FontVariants {
  [key: string]: Fonts
}


export interface Fonts {
  thickness?: number
  slant?: number
  width?: number
  lineHeight: number
}



export interface Axis {
  tag: string
  min: number
  max: number
  defaultValue: number
}

export interface IFilterState {
  query: string
  "preview.text": string
  "preview.size": number
  "preview.text_type": "sentence" | "paragraph" | "custom"
  category: string[]
  subset: string
  stylecount: number
  vfonly: boolean
  coloronly: boolean
  sort: "newest" | "popularity" | "trending" | "name"
  [key: string]: string | string[] | number | boolean | undefined;
}
export interface IFilterStateParam {
  [key: keyof IFilterState]: string | string[] | number | boolean | undefined;
}

export interface FontResponse {
  kind: string
  items: FontItem[]
}

export interface FontItem {
  family: string
  variants: string[]
  subsets: string[]
  version: string
  lastModified: string
  files: Files
  category: string
  kind: string
  menu: string
}

export interface Files {
  [key: string]: string
}