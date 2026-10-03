import { Link } from "react-router";

const Logo = () => {
  return (
    <div className="h-full w-25">
        <Link to={'/'} className={"w-full"}>
      <img src="logo.jpg" alt="logo" className="h-full w-full object-contain" />
      </Link>
    </div>
  );
};

export default Logo;
