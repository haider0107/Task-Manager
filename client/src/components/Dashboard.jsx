import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  useDisclosure,
  Button,
  Box,
  Checkbox,
  Heading,
} from "@chakra-ui/react";

import DeleteModal from "./DeleteModal";
import { AiFillDelete, AiTwotoneEdit } from "react-icons/ai";
import EditModal from "./EditModal";
import Navbar from "./Navbar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [fetchAgain, setFetchAgain] = useState(false);
  // const
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  useEffect(() => {
    async function authCheck() {
      try {
        await axios.get("/api/user/auth", {
          headers: {
            "auth-token": JSON.parse(localStorage.getItem("token")),
          },
        });
      } catch (error) {
        console.log(error);
        localStorage.removeItem("token");
        navigate("/");
      }
    }

    async function fetchData() {
      try {
        let res = await axios.get("/api/tasks/", {
          headers: {
            "auth-token": JSON.parse(localStorage.getItem("token")),
          },
        });

        console.log(res.data.tasks);
        setData(res.data.tasks.tasks);
      } catch (error) {
        console.log(error);
      }
    }

    authCheck();
    fetchData();
  }, [navigate, fetchAgain]);

  async function Completed(task_id, isCompleted) {
    try {
      let dataChecked = {
        isCompleted: !isCompleted,
      };

      let res = await axios.put(
        `/api/tasks/isComplete/${task_id}`,
        dataChecked,
        {
          headers: {
            "auth-token": JSON.parse(localStorage.getItem("token")),
          },
        }
      );

      let newData = data.map((ele) => {
        if (ele._id == task_id) {
          ele.isCompleted = !isCompleted;
        }
        return ele;
      });

      setData(newData);

      console.log(res.data.success);
    } catch (error) {
      console.log(error.response.data.error);
    }
  }

  return (
    <div className=" w-full h-screen">
      <Navbar fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      <DeleteModal
        isDeleteOpen={isDeleteOpen}
        onDeleteOpen={onDeleteOpen}
        onDeleteClose={onDeleteClose}
        selectedId={selectedId}
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
      />
      <EditModal
        isEditOpen={isEditOpen}
        onEditClose={onEditClose}
        onEditOpen={onEditOpen}
        selectedId={selectedId}
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
      />
      <Box p="8">
        <Heading className="underline underline-offset-8" mb={4}>
          Todo's
        </Heading>
        <Box overflowY="auto" maxHeight="600px" borderRadius="20px">
          <TableContainer>
            <Table variant="striped" colorScheme="cyan">
              <TableCaption>Task Manager</TableCaption>
              <Thead position="sticky" top={0} bgColor="#279EF2">
                <Tr>
                  <Th></Th>
                  <Th color="white">Task Name</Th>
                  <Th color="white">Deadline</Th>
                  <Th color="white">Status</Th>
                  <Th color="white">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data &&
                  data.map((ele, i) => {
                    let date = new Date(ele.deadline).toLocaleString();
                    return (
                      <Tr key={i}>
                        <Td>
                          <Checkbox
                            padding="2px"
                            isChecked={ele.isCompleted}
                            onChange={() => {
                              Completed(ele._id, ele.isCompleted);
                            }}
                          >
                            Done
                          </Checkbox>
                        </Td>
                        <Td>{ele.taskName}</Td>
                        <Td>{date}</Td>
                        <Td>{ele.isCompleted ? "Completed" : "Pending"}</Td>
                        <Td>
                          <Button
                            colorScheme="red"
                            onClick={() => {
                              setSelectedId(ele._id);
                              onDeleteOpen();
                            }}
                          >
                            <AiFillDelete />
                          </Button>
                          <Button
                            mx="5px"
                            onClick={() => {
                              setSelectedId(ele._id);
                              onEditOpen();
                            }}
                          >
                            <AiTwotoneEdit />
                          </Button>
                        </Td>
                      </Tr>
                    );
                  })}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th></Th>
                  <Th>Task Name</Th>
                  <Th>Deadline</Th>
                  <Th>Status</Th>
                  <Th>Action</Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </div>
  );
};

export default Dashboard;
