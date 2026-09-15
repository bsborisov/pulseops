import { X } from "lucide-react";
import {
  NavLink,
  useLocation
} from "react-router";

import {
  mainNavigation,
  type NavigationItem,
} from "@/app/navigation";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  open: boolean;
  onClose: () => void;
}

interface MobileNavigationItemProps {
  item: NavigationItem;
  search: string;
  onClose: () => void;
}

function MobileNavigationItem({
  item,
  search,
  onClose,
}: MobileNavigationItemProps) {
  const Icon = item.icon;

  return (
    <NavLink
      to={{
        pathname: item.path,
        search,
      }}
      end={item.path === "/"}
      onClick={onClose}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md border px-3 py-2.5",
          "text-[13px] font-medium transition-colors",
          isActive
            ? "border-edge/[0.07] bg-accent/6 text-hi"
            : "border-transparent text-lo hover:bg-slate-900/3 hover:text-mid",
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={17}
            strokeWidth={1.75}
            className={
              isActive
                ? "text-accent"
                : "text-lo"
            }
          />

          <span>{item.label}</span>

          {isActive && (
            <span className="ml-auto size-1 rounded-full bg-accent" />
          )}
        </>
      )}
    </NavLink>
  );
}

export function MobileNavigation({
  open,
  onClose,
}: MobileNavigationProps) {
  const { search } = useLocation();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-[2px]"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className="relative flex h-full w-70 max-w-[85vw] flex-col border-r border-edge bg-surface shadow-2xl"
      >
        <div className="flex h-12 items-center gap-2.5 border-b border-edge px-3">
          <div className="flex size-6 items-center justify-center rounded-md border border-accent/30 bg-accent/20">
            <span className="text-[11px] font-bold text-accent">
              P
            </span>
          </div>

          <span className="text-[14px] font-semibold tracking-tight text-hi">
            PulseOps
          </span>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="ml-auto flex size-8 items-center justify-center rounded-md text-lo transition-colors hover:bg-slate-900/4 hover:text-mid"
          >
            <X size={17} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
          {mainNavigation.map((item) => (
            <MobileNavigationItem
              key={item.path}
              item={item}
              search={search}
              onClose={onClose}
            />
          ))}
        </nav>

        <div className="border-t border-edge p-2">
          <div className="mt-2 flex items-center gap-2.5 border-t border-edge px-3 pt-3">
            <div className="flex size-7 items-center justify-center rounded-full bg-linear-to-br from-sky-400 to-blue-600">
              <span className="text-[10px] font-bold text-white">
                JD
              </span>
            </div>

            <div>
              <div className="text-xs font-medium text-hi">
                Jamie D.
              </div>

              <div className="text-[10px] text-lo">
                Admin
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}