import { Link } from "react-router";

const links: { label: string; id: string; link: string }[] = [
  {
    label: "Home",
    id: "home",
    link: "/",
  },
  {
    label: "About Us",
    id: "about-us",
    link: "/about",
  },
  {
    label: "Contact Us",
    id: "contact",
    link: "/contact-us",
  },
  {
    label: "Product ",
    id: "product",
    link: "/product",
  }
];

const NavLinks = () => {
  return <div className="flex gap-24"  >
    {
        links.map((item) => {
            return (
                <Link key={item.id} to={item.link}>
                    <span className="text-[17px] font-bold hover:text-blue-500 transition-all duration-300">{item.label}</span>
                </Link>
            )
        })
    }
  </div>;
};

export default NavLinks;
