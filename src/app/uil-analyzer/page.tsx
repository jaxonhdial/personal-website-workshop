import Link from "next/link";

export default function UILAnalyzer() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-black">
      <h1 className="mb-4 text-4xl font-semibold uppercase">UIL Analyzer</h1>
      <p className="mb-6 text-zinc-600 dark:text-zinc-400">
        Your UIL Analyzer content goes here.
      </p>
      <Link
        href="/"
        className="text-amber-600 underline hover:text-amber-500 dark:text-amber-400"
      >
        ← Back to menu
      </Link>
    </div>
  );
}
