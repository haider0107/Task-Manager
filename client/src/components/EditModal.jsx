import React from "react";
import * as yup from "yup";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  // FormErrorMessage,
  // FormHelperText,
  Input,
} from "@chakra-ui/react";

function minDate() {
  // Get the current date
  const currentDate = new Date();

  // Calculate the date for tomorrow
  const tomorrowDate = new Date(currentDate);
  tomorrowDate.setDate(currentDate.getDate() + 1);

  return tomorrowDate.toISOString().split("T")[0];
}

function maxDate() {
  // Get the current date
  const currentDate = new Date();

  // Calculate the date for tomorrow
  const tomorrowDate = new Date(currentDate);
  tomorrowDate.setDate(currentDate.getDate() + 29);

  return tomorrowDate.toISOString().split("T")[0];
}

const schema = yup.object({
  taskName: yup.string(),
  deadline: yup.string(),
});

function EditModal({
  isEditOpen,
  onEditOpen,
  onEditClose,
  selectedId,
  fetchAgain,
  setFetchAgain,
}) {
  const form = useForm({
    defaultValues: {
      taskName: "",
      deadline: "",
    },
    resolver: yupResolver(schema),
  });

  const { register, handleSubmit, reset } = form;
  // const { errors } = formState;

  async function onSubmit(data) {
    try {
      if (data.deadline) {
        let editData = {
          taskName: data.taskName,
          deadline: data.deadline,
        };

        let res = await axios.put(`/api/tasks/${selectedId}`, editData, {
          headers: {
            "auth-token": JSON.parse(localStorage.getItem("token")),
          },
        });
        console.log(res.data.success);
        setFetchAgain(!fetchAgain)
      } else if (data.deadline === "") {
        let editData = {
          taskName: data.taskName,
        };

        let res = await axios.put(`/api/tasks/${selectedId}`, editData, {
          headers: {
            "auth-token": JSON.parse(localStorage.getItem("token")),
          },
        });
        console.log(res.data.success);
        setFetchAgain(!fetchAgain)
      }
    } catch (error) {
      console.log(error.response.data.error);
    }
  }

  return (
    <div>
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>EDIT</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form id="edit-form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <FormControl my="5px">
                <FormLabel>Task Name</FormLabel>
                <Input type="text" id="taskName" {...register("taskName")} />
              </FormControl>
              <FormControl>
                <FormLabel>Deadline</FormLabel>
                <Input
                  type="date"
                  min={minDate()}
                  max={maxDate()}
                  {...register("deadline")}
                />
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button mr="150px" colorScheme="blackAlpha" onClick={() => reset()}>
              Reset
            </Button>
            <Button variant="ghost" mr={3} onClick={onEditClose}>
              Close
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              form="edit-form"
              onClick={onEditClose}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default EditModal;
