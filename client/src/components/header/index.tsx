import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { FiHeart, FiMenu, FiSearch, FiShoppingBag, FiUser, FiX, FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../providers/theme.provider";

const NavBar = () => {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { label: "Discover", to: "/" },
    { label: "All Phones", to: "/products" },
    { label: "New Arrivals", to: "/products?new_arrival=true" },
    { label: "Flagship", to: "/products?featured=true" },
  ];

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
    setSearchOpen(false);
    setMenuOpen(false);
  };

  return (
    <>
      <div className="site-announcement">
        🚀 Next-gen phones are here — experience the future.{" "}
        <Link to="/products">Shop now</Link>
      </div>
      <header className="site-header">
        <div className="header-main">
          <button
            type="button"
            className="icon-button mobile-menu-toggle"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>

          <Link to="/" className="header-brand" aria-label="PhoneVault home">
            <span className="brand-mark" aria-hidden="true">P</span>
            <span>PhoneVault</span>
          </Link>

          <nav className={`header-links${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
            {links.map((link) => {
              const active = link.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith("/products");
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className="header-link"
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="header-tools">
            <button
              type="button"
              className="icon-button mobile-search"
              aria-label="Search phones"
              onClick={() => setSearchOpen((open) => !open)}
            >
              <FiSearch />
            </button>
            <Link to="/wishlist" className="icon-button" aria-label="Wishlist">
              <FiHeart />
            </Link>
            <Link to="/cart" className="icon-button" aria-label="Shopping bag">
              <FiShoppingBag />
            </Link>
            <Link to="/profile" className="icon-button" aria-label="Your account">
              <FiUser />
            </Link>
            <button
              type="button"
              className="icon-button desktop-search"
              aria-label="Search phones"
              onClick={() => setSearchOpen((open) => !open)}
            >
              <FiSearch />
            </button>
            <button
              type="button"
              className="icon-button theme-toggle"
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <FiSun /> : <FiMoon />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <form className="header-search" onSubmit={submitSearch} role="search">
            <FiSearch aria-hidden="true" />
            <input
              autoFocus
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search phones, brands, and more…"
              aria-label="Search phones"
            />
            <button type="submit" aria-label="Submit search"><FiSearch /></button>
          </form>
        )}
      </header>
    </>
  );
};

export default NavBar;
