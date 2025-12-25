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
} from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";

function ReadProjectModal({ isOpen, onClose, project, onDelete }) {
  if (!project) return null;

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (confirmDelete) {
      onDelete(project._id);
      onClose();
    }
  };

  const priorityColor =
    project.priority === "Most Important"
      ? "red"
      : project.priority === "Important"
      ? "yellow"
      : "green";

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
        <ModalHeader>Project Details</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "20px",
            }}
          >
            {/* TITLE */}
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 700,
                marginBottom: "12px",
              }}
            >
              {project.title}
            </h2>

            {/* DESCRIPTION */}
            <p
              style={{
                fontSize: "14px",
                color: "#4b5563",
                marginBottom: "16px",
              }}
            >
              {project.description || "No description provided"}
            </p>

            {/* FOOTER */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "14px",
              }}
            >
              <Tag size="lg" colorScheme={priorityColor} borderRadius="full">
                {project.priority}
              </Tag>

              <MdDelete
                size={22}
                style={{ cursor: "pointer", color: "#dc2626" }}
                title="Delete Project"
                onClick={handleDelete}
              />
            </div>

            {/* CREATED DATE */}
            <p style={{ fontSize: "13px", color: "#6b7280" }}>
              Created on:{" "}
              {project.createdAt
                ? new Date(project.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "N/A"}
            </p>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button bg="darkcyan" color="white" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ReadProjectModal;
