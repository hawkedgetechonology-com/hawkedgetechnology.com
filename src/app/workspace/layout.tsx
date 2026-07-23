// These pages have their own full-screen layout — no global Navbar/Footer
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
