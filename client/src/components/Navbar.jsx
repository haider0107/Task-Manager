import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Landscape Skies Photo Collage YouTube Banner.png";
import { Button, Tooltip, useDisclosure } from "@chakra-ui/react";
import AddModal from "./AddModal";

const Navbar = ({fetchAgain,setFetchAgain}) => {
  const navigate = useNavigate();
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();

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
      <AddModal
        isAddOpen={isAddOpen}
        onAddClose={onAddClose}
        onAddOpen={onAddOpen}
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
      />
      <div className="flex">
        <Tooltip label="Add Task" openDelay={500}>
          <Button
            mx="10px"
            onClick={() => {
              onAddOpen();
            }}
          >
            ADD
          </Button>
        </Tooltip>
        <Button px="20px" mx="4px" onClick={handleLogout}>
          LOGOUT
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
