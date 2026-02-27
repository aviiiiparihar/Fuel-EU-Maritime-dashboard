import { NavLink, Outlet } from 'react-router-dom';

const tabs = [
  { to: '/routes', label: 'Routes' },
  { to: '/compare', label: 'Compare' },
  { to: '/banking', label: 'Banking' },
  { to: '/pooling', label: 'Pooling' },
] as const;

export function AppLayout() {
  return (
    <div className="flex h-full">
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-white">
        <div className="px-4 py-4">
          <div className="text-sm font-semibold tracking-wide text-slate-700">Maritime</div>
          <div className="text-xs text-slate-500">Compliance Dashboard</div>
        </div>

        <nav className="px-2 py-2">
          <ul className="space-y-1">
            {tabs.map((t) => (
              <li key={t.to}>
                <NavLink
                  to={t.to}
                  className={({ isActive }) =>
                    [
                      'block rounded-md px-3 py-2 text-sm font-medium',
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100',
                    ].join(' ')
                  }
                >
                  {t.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

