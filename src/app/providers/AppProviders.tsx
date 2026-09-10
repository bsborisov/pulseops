import {
  QueryClientProvider,
} from "@tanstack/react-query";

import { queryClient } from "@/app/query-client";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({
  children,
}: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}