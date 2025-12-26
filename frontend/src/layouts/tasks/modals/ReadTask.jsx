import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Tag,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";

/* ================= COMPONENT ================= */

function ReadTaskModal({ isOpen, onClose, task, onDelete }) {
  const handleDelete = () => {
    if (!task || !onDelete) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirmDelete) {
      onDelete(task._id);
      onClose();
    }
  };

  const priorityColor =
    task?.priority === "Most Important"
      ? "red"
      : task?.priority === "Important"
      ? "yellow"
      : task?.priority === "Least Important"
      ? "green"
      : "gray";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      isCentered
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Task Details</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {!task ? (
            <Text textAlign="center" color="gray.500">
              No task selected
            </Text>
          ) : (
            <div
              style={{
                background: "rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "20px",
              }}
            >
              {/* TITLE */}
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                {task.title}
              </Text>

              {/* DESCRIPTION */}
              <Text mb={4} color="gray.600">
                {task.description || "No description provided"}
              </Text>

              {/* FOOTER */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <Tag
                  size="lg"
                  borderRadius="full"
                  colorScheme={priorityColor}
                >
                  {task.priority || "N/A"}
                </Tag>

                <IconButton
                  icon={<MdDelete />}
                  colorScheme="red"
                  variant="ghost"
                  aria-label="Delete task"
                  onClick={handleDelete}
                />
              </div>

              {/* CREATED DATE */}
              <Text fontSize="sm" color="gray.500">
                Created on:{" "}
                {task.createdAt
                  ? new Date(task.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </Text>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="teal" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ReadTaskModal;
