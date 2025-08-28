// Allow importing .jsx modules in TypeScript without explicit type declarations
declare module '*.jsx' {
  import React from 'react';
  const Component: React.ComponentType<React.ComponentProps<React.ComponentType<unknown>>>;
  export default Component;
}


