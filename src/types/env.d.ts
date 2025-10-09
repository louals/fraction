// Vite (prefixe VITE_)
interface ImportMetaEnv {
  readonly VITE_MAPBOX_TOKEN?: string;
  readonly VITE_MAPBOX_API_KEY?: string; // ← on supporte aussi ce nom
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// CRA / Next (process.env côté client)
declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_MAPBOX_TOKEN?: string;
    readonly NEXT_PUBLIC_MAPBOX_TOKEN?: string;
  }
}
