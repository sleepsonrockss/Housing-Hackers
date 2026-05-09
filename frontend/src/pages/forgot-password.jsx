import Link from "next/link";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-[#090909] text-white font-sans flex flex-col items-center justify-center gap-4 px-6">
      <p className="text-sm text-zinc-400">Reset password (placeholder)</p>
      <Link href="/login" className="text-[13px] text-white underline">
        Back to sign in
      </Link>
    </div>
  );
}
