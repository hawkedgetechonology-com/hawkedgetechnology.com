import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | HawkEdge Technologies",
  description: "Sign in to your HawkEdge Technologies account.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout intentionally excludes the Navbar and Footer
  return <>{children}</>;
}
