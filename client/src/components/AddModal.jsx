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
  taskName: yup.string().required("Enter a taskname."),
  deadline: yup.string().required("Enter a deadline."),
});

function AddModal({ isAddOpen, onAddOpen, onAddClose }) {
  const form = useForm({
    defaultValues: {
      taskName: "",
      deadline: "",
    },
    resolver: yupResolver(schema),
  });

  const { register, handleSubmit, formState, reset } = form;
  const { errors } = formState;

  async function onSubmit(data) {
    try {
      let addData = {
        taskName: data.taskName,
        deadline: data.deadline,
      };

      let res = await axios.post("/api/tasks/", addData, {
        headers: {
          "auth-token": JSON.parse(localStorage.getItem("token")),
        },
      });
      console.log(res.data.success);
    } catch (error) {
      console.log(error.response.data.error);
    }
    console.log(data);
  }

  return (
    <div>
      <Modal isOpen={isAddOpen} onClose={onAddClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form id="add-form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <FormControl my="5px" isRequired>
                <FormLabel>Task Name</FormLabel>
                <Input type="text" id="taskName" {...register("taskName")} />
                <span className=" text-[10px] text-red-500">
                  {errors.taskName?.message}
                </span>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Deadline</FormLabel>
                <Input
                  type="date"
                  min={minDate()}
                  max={maxDate()}
                  {...register("deadline")}
                />
                <span className=" text-[10px] text-red-500">
                  {errors.deadline?.message}
                </span>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button mr="150px" colorScheme="blackAlpha" onClick={() => reset()}>
              Reset
            </Button>
            <Button variant="ghost" mr={3} onClick={onAddClose}>
              Close
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              form="add-form"
              onClick={onAddClose}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default AddModal;
