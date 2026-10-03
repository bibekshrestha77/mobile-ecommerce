import React from "react";
import ReactQueryProvider from "./query-client.provider";
import { ThemeProvider } from "./theme.provider";

type Props = {
  children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
  return (
    <ThemeProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </ThemeProvider>
  );
};

export default Providers;
