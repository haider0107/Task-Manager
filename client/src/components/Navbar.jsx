import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar">
      <Link to="/" className="navbar_title">Tasky</Link>
      <div>
        <Link to="/">HOME</Link>
        <Link to="/">About</Link>
      </div>
    </div>
  );
};

export default Navbar;
