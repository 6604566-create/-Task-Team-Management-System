import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Tag,
  Spinner,
  useToast,
} from "@chakra-ui/react";

import api from "../../../api/axios";

function AddEmployeeModal({ isOpen, onClose }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  // ❌ No employeeId here (backend will auto-generate _id)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    residentialAddress: "",
    cnic: "",
    role: "",
    dateOfBirth: "",
    startDate: "",
    status: "Active",
    gender: "Male",
  });

  /* ================= INPUT HANDLERS ================= */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusClick = (status) => {
    setFormData({ ...formData, status });
  };

  const handleGenderClick = (gender) => {
    setFormData({ ...formData, gender });
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/employee", formData);

      toast({
        title: res.data.message || "Employee added successfully",
        status: "success",
        position: "top",
        duration: 4000,
        isClosable: true,
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        residentialAddress: "",
        cnic: "",
        role: "",
        dateOfBirth: "",
        startDate: "",
        status: "Active",
        gender: "Male",
      });

      onClose();
    } catch (error) {
      toast({
        title: error.response?.data?.message || "Failed to add employee",
        status: "error",
        position: "top",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Add Employee</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Input mt={3} name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
            <Input mt={3} name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
            <Input mt={3} type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <Input mt={3} type="number" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
            <Input mt={3} name="residentialAddress" placeholder="Residential Address" value={formData.residentialAddress} onChange={handleChange} required />
            <Input mt={3} name="cnic" placeholder="CNIC" value={formData.cnic} onChange={handleChange} required />
            <Input mt={3} name="role" placeholder="Role" value={formData.role} onChange={handleChange} required />
            <Input mt={3} type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
            <Input mt={3} type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />

            {/* STATUS */}
            <div style={{ display: "flex", gap: "10px", marginTop: "15px", alignItems: "center" }}>
              <p>Status:</p>
              {["Active", "In Active", "Terminated"].map((s) => (
                <Tag
                  key={s}
                  size="lg"
                  cursor="pointer"
                  colorScheme={formData.status === s ? "green" : "gray"}
                  borderRadius="full"
                  onClick={() => handleStatusClick(s)}
                >
                  {s}
                </Tag>
              ))}
            </div>

            {/* GENDER */}
            <div style={{ display: "flex", gap: "10px", marginTop: "15px", alignItems: "center" }}>
              <p>Gender:</p>
              {["Male", "Female"].map((g) => (
                <Tag
                  key={g}
                  size="lg"
                  cursor="pointer"
                  colorScheme={formData.gender === g ? "blue" : "gray"}
                  borderRadius="full"
                  onClick={() => handleGenderClick(g)}
                >
                  {g}
                </Tag>
              ))}
            </div>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
            <Button type="submit" colorScheme="teal">
              {loading ? <Spinner /> : "Add Employee"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default AddEmployeeModal;
