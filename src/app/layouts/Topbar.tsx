import { Menu, Wifi } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <button
        type="button"
        className="rounded-md p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white lg:hidden"
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      <div className="hidden sm:block">
        <span className="text-sm text-zinc-400">
          Production
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-emerald-400">
        <Wifi size={15} />

        <span>Live</span>
      </div>
    </header>
  );
}