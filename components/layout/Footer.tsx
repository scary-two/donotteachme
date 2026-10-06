export default function Footer() {
  return (
    <footer className="border-t border-(--border) bg-(--bg) text-(--fg-subtle)">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} donotteachme.com</p>
        <p>
          <a
            href="https://aayushshrestha.info.np"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-(--accent)"
          >
            Aayush S.
          </a>
        </p>
      </div>
    </footer>
  );
}
