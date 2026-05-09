import Link from "next/link";
import { useRouter } from "next/router";

export default function GamePage() {
  const router = useRouter();
  const day = router.query.day ?? "1";

  return (
    <div className="min-h-screen bg-[#090909] text-white font-sans flex flex-col items-center justify-center gap-4 px-6">
      <p className="text-sm text-zinc-400">Game (placeholder)</p>
      <p className="text-lg">Day {day}</p>
      <Link href="/chapters" className="text-[13px] text-white underline">
        Back to chapters
      </Link>
    </div>
  );
}
