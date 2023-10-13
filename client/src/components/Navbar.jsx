import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Landscape Skies Photo Collage YouTube Banner.png";
import { Button, Tooltip } from "@chakra-ui/react";

const Navbar = () => {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div className=" w-full h-[80px] flex justify-between items-center px-4 bg-[#337CCF] text-[#F1F0E8]">
      <Link to="/dashboard">
        <img
          src={Logo}
          className=" rounded-md"
          alt=""
          style={{ width: "200px", height: "50px" }}
        />
      </Link>
      <div className="flex">
        <Tooltip label="Add Task" openDelay={500}>
          <Button mx="10px">ADD</Button>
        </Tooltip>
        <Button px="20px" mx="4px" onClick={handleLogout}>
          LOGOUT
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
