export default function AboutPage() {
  return (
    <main className="bg-gray-900">
      <section className="mx-auto max-w-4xl px-5 py-16 text-gray-300 sm:py-20">
        <h1 className="text-4xl font-semibold tracking-tight text-white">About</h1>
        <p className="mt-6 text-lg leading-8 text-gray-400">
          This is a simple frontend setup for a personal tech blog. The goal
          is to keep the structure clean now so Sanity can plug in later
          without rebuilding the pages.
        </p>
      </section>
    </main>
  );
}
