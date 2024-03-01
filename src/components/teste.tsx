import { ReactNode } from "react";

type TesteProps = {
  children: (props: { value: string }) => ReactNode;
};

export const Teste = ({ children }: TesteProps) => {
  const value = "exampleValue";
  return children({ value });
};
