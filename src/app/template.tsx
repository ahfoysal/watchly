// Re-mounts on every navigation, so the page content fades/rises in on each
// route change — a lightweight, dependency-free page transition.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-rise">{children}</div>;
}
