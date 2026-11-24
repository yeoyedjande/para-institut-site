"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/cart-context";
import { BrandLogo } from "./brand-logo";
import { BagIcon, CloseIcon, MenuIcon, SearchIcon, UserIcon } from "./icons";
import { NAV_ITEMS } from "./nav-items";
import { SearchDialog, type SearchEntry } from "./search-dialog";
import styles from "./site-header.module.css";

export function SiteHeader({ searchIndex }: { searchIndex: SearchEntry[] }) {
  const pathname = usePathname();
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fermer le menu à chaque navigation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronisation avec le routeur
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    document.documentElement.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Raccourci « / » pour la recherche
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header className={styles.header} data-scrolled={scrolled || undefined} data-menu={menuOpen || undefined}>
        <div className={styles.bar}>
          <Link href="/" className={styles.plaque} aria-label="Para-Institut Palm Club — accueil">
            <BrandLogo width={120} priority className={styles.logo} />
          </Link>

          <nav className={styles.nav} aria-label="Navigation principale">
            <ul role="list">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.link} aria-current={isActive(item.href) ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.tools}>
            <button type="button" className={styles.tool} onClick={() => setSearchOpen(true)} aria-label="Rechercher" aria-keyshortcuts="/">
              <SearchIcon className={styles.icon} />
            </button>
            <Link href="/compte" className={`${styles.tool} ${styles.hideSm}`} aria-label="Compte client">
              <UserIcon className={styles.icon} />
            </Link>
            <button type="button" className={styles.tool} onClick={() => setOpen(true)} aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`}>
              <BagIcon className={styles.icon} />
              {count > 0 ? (
                <span className={styles.count} aria-hidden="true">
                  {count}
                </span>
              ) : null}
            </button>
            <button
              ref={menuButton}
              type="button"
              className={`${styles.tool} ${styles.menuButton}`}
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <CloseIcon className={styles.icon} /> : <MenuIcon className={styles.icon} />}
              <span className="sr-only">{menuOpen ? "Fermer le menu" : "Ouvrir le menu"}</span>
            </button>
          </div>
        </div>
      </header>

      <div id="menu-mobile" ref={menuRef} className={styles.menu} data-open={menuOpen || undefined} hidden={!menuOpen} data-theme="inverse">
        <nav aria-label="Navigation mobile">
          <ol role="list" className={styles.menuList}>
            {NAV_ITEMS.map((item, i) => (
              <li key={item.href} style={{ "--i": i } as React.CSSProperties}>
                <Link href={item.href} className={styles.menuLink} aria-current={isActive(item.href) ? "page" : undefined}>
                  <span className={styles.menuIndex}>{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
                </Link>
              </li>
            ))}
            <li style={{ "--i": NAV_ITEMS.length } as React.CSSProperties}>
              <Link href="/compte" className={styles.menuLink}>
                <span className={styles.menuIndex}>{String(NAV_ITEMS.length + 1).padStart(2, "0")}</span>
                Compte client
              </Link>
            </li>
          </ol>
        </nav>
        <Link href="/soins/reservation" className={styles.menuCta}>
          Demander un rendez-vous
        </Link>
      </div>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} index={searchIndex} />
    </>
  );
}
