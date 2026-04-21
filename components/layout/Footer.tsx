export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 text-gray-400">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()}</p>
        <p className="text-gray-500">
          <a href="aayush.shrestha.com.np">Aayush S.</a>
        </p>
      </div>
    </footer>
  );
}
