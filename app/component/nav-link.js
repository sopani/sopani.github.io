'use client'

import { usePathname } from 'next/navigation';
import classes from './nav-link.module.css';
import Link from 'next/link';

export default function NavLink({href, children}) {
    const path= usePathname();

  return (
    <main>
      <nav className={classes.nav}>
        <ul>
          <li>
            <Link
              href={href}
              className={path.startsWith(href) ? `${classes.link} ${classes.active}` : `${classes.link}`}
            >
              {children}
            </Link>
          </li>
          {/* <li>
            <Link
              href={href}
              className={
                path.startsWith(href) ? classes.active : undefined
              }
            >
              Foodies Community
            </Link> */}
          {/* </li> */}
        </ul>
      </nav>
    </main>
  );
}
