'use client';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { EngageTrackerProvider } from '@scdp/ui/components';
import { scdpTheme } from '@scdp/ui/theme';
import { WidgetsProvider } from '@sitecore-search/react';
import sitecoreTheme, { toastOptions } from '@sitecore/blok-theme';
import { IsSearchEnabled, SEARCH_CONFIG } from '../lib/search';
const SearchWrapper = ({ children }: any) => (IsSearchEnabled() ? <WidgetsProvider {...SEARCH_CONFIG}>{children}</WidgetsProvider> : children);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SearchWrapper>
      <ChakraProvider theme={extendTheme(sitecoreTheme, scdpTheme)} toastOptions={toastOptions}>
        <EngageTrackerProvider>
          {/* <PreviewProvider hostname={window.location.host}> */}
          {children}
          {/* </PreviewProvider> */}
        </EngageTrackerProvider>
      </ChakraProvider>
    </SearchWrapper>
  );
}
