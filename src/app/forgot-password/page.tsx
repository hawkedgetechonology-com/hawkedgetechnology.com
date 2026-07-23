import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#020B18] flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold font-heading text-white mb-3">Reset your password</h1>
        <p className="text-[#8BA6C1] text-sm mb-8">
          Password reset is coming soon. For now, please contact our support team.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-[#00A3FF] text-white font-semibold text-sm hover:bg-[#0082CC] transition-colors"
        >
          Contact Support
        </Link>
        <div className="mt-6">
          <Link href="/login" className="text-sm text-[#4A6A8A] hover:text-[#8BA6C1] transition-colors">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
