import React from "react";
import { AiFillDelete } from "react-icons/ai";
import axios from "axios";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

function DeleteModal({
  onDeleteClose,
  onDeleteOpen,
  isDeleteOpen,
  selectedId,
  fetchAgain,
  setFetchAgain,
}) {
  async function deleteTask() {
    try {
      await axios.delete(`/api/tasks/${selectedId}`, {
        headers: {
          "auth-token": JSON.parse(localStorage.getItem("token")),
        },
      });
      setFetchAgain(!fetchAgain);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>DELETE</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Are you sure ?</p>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onDeleteClose}>
              Close
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                deleteTask();
                onDeleteClose();
              }}
            >
              <AiFillDelete />
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default DeleteModal;
