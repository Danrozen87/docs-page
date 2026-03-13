import { Link, useLocation } from 'react-router-dom';
import { navigation } from '../docs/registry';

export function DocsSidebar() {
  const { pathname } = useLocation();

  return (
    <nav className="docs-nav">
      {navigation.map((group) => (
        <div key={group.title} className="docs-nav-group">
          <h3 className="docs-nav-title">{group.title}</h3>
          <ul className="docs-nav-list">
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={`docs-nav-link${active ? ' docs-nav-link--active' : ''}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
