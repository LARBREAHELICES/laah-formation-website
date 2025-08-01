
import {  Link } from '@tanstack/react-router'

const navItems = [
  { label: 'Home', to: '/', name :'home' },
  { label: 'About', to: '/about', name : 'about' },
];

export default function Navigation() {
  return (
    <nav style={styles.nav}>
      <ul style={styles.list}>
        {navItems.map(({ label, to, name }) => (
          <li key={label} style={styles.item}>
             <Link to={to} className="[&.active]:font-bold">
                {name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// styles ultra-simples (à remplacer par Tailwind, CSS Modules, etc.)
const styles = {
  nav: { padding: '1rem', backgroundColor: '#f5f5f5' },
  list: { display: 'flex', gap: '1.5rem', listStyle: 'none', margin: 0, padding: 0 },
  item: {},
  link: { textDecoration: 'none', color: '#333', fontWeight: 500 },
} as const;