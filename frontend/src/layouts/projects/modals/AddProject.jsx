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
  Textarea,
  Tag,
  Spinner,
  useToast,
} from "@chakra-ui/react";

import fetchClient from "../../../api/fetchClient";

/* ================= COMPONENT ================= */

function AddProjectModal({ isOpen, onClose }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const initialState = {
    title: "",
    description: "",
    clientName: "",
    startDate: "",
    status: "On Hold",
    priority: "Most Important",
  };

  const [formData, setFormData] = useState(initialState);

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusClick = (status) => {
    setFormData({ ...formData, status });
  };

  const handlePriorityClick = (priority) => {
    setFormData({ ...formData, priority });
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ fetchClient usage
      const data = await fetchClient("/api/project", {
        method: "POST",
        body: formData,
      });

      toast({
        title: data?.message || "Project added successfully",
        status: "success",
        position: "top",
        duration: 4000,
        isClosable: true,
      });

      setFormData(initialState);
      onClose();
    } catch (error) {
      toast({
        title: error.message || "Failed to add project",
        status: "error",
        position: "top",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

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
          <ModalHeader>Add Project</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Input
              mt={3}
              placeholder="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <Textarea
              mt={3}
              rows={5}
              placeholder="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />

            <Input
              mt={3}
              placeholder="Client Name"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
            />

            <Input
              mt={3}
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />

            {/* STATUS */}
            <div style={{ marginTop: "16px" }}>
              <p>Status:</p>
              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                {["On Hold", "In Progress", "Testing", "Completed"].map(
                  (s) => (
                    <Tag
                      key={s}
                      size="lg"
                      cursor="pointer"
                      borderRadius="full"
                      colorScheme={formData.status === s ? "blue" : "gray"}
                      onClick={() => handleStatusClick(s)}
                    >
                      {s}
                    </Tag>
                  )
                )}
              </div>
            </div>

            {/* PRIORITY */}
            <div style={{ marginTop: "16px" }}>
              <p>Priority:</p>
              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                {["Most Important", "Important", "Least Important"].map(
                  (p) => (
                    <Tag
                      key={p}
                      size="lg"
                      cursor="pointer"
                      borderRadius="full"
                      colorScheme={formData.priority === p ? "red" : "gray"}
                      onClick={() => handlePriorityClick(p)}
                    >
                      {p}
                    </Tag>
                  )
                )}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>

            <Button type="submit" colorScheme="teal" isDisabled={loading}>
              {loading ? <Spinner size="sm" /> : "Add Project"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default AddProjectModal;
