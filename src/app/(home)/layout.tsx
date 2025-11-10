import { ReactNode } from "react";

export const metadata = {
  title: "TabNews",
  description: "TabNews clone from curso.dev",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
