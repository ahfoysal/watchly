import { AuthForm } from "@/components/auth/auth-form";

export const metadata = { title: "Sign Up" };

export default function SignUpPage() {
  return <AuthForm mode="signup" />;
}
