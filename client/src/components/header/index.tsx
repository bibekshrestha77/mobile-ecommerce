import Logo from "../ui/logo";
import NavLinks from "./nav-links";
import IconSelection from "./icon-selection";

const NavBar = () => {
  return (
    <nav className="w-full h-10 border flex items-center justify-between px-2 shadow-xs">
      <Logo />
      {/*links*/}
      <NavLinks />
      {/*icons */}
      <IconSelection />
    </nav>
  );
};

export default NavBar;
