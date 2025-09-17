declare module '*.svg?react' {
  import * as React from 'react';
  const Component: React.FC<React.SVGProps<SVGSVGElement>>;
  export default Component;
}

// (optionnel) si un jour tu importes un SVG comme URL (sans ?react)
declare module '*.svg' {
  const src: string;
  export default src;
}
