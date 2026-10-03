import React from "react";
import ReactQueryProvider from "./query-client.provider";

type Props = {
  children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
};

export default Providers;
