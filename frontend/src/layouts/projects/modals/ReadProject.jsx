import React from 'react';
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
} from '@chakra-ui/react';
import { MdDelete } from 'react-icons/md';

function ReadProjectModal({ isOpen, onClose, project, onDelete }) {
  if (!project) return null;

  const handleDelete = () => {
    onDelete(project._id);
    onClose(); // ✅ close modal after delete
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
        <ModalHeader>Project Details</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <div className="task-card-container">
            {/* Title */}
            <p className="task-title">{project.title}</p>

            {/* Description */}
            <div className="task-desc-container">
              <p className="task-desc">{project.description}</p>
            </div>

            {/* Footer */}
            <div className="task-card-footer-container">
              <div>
                <Tag
                  size="lg"
                  colorScheme={
                    project.priority === 'Most Important'
                      ? 'red'
                      : project.priority === 'Important'
                      ? 'yellow'
                      : 'green'
                  }
                  borderRadius="full"
                >
                  <p className="tag-text">{project.priority}</p>
                </Tag>
              </div>

              <div
                className="task-read"
                onClick={handleDelete}
                style={{ cursor: 'pointer' }}
              >
                <MdDelete className="read-icon" />
              </div>
            </div>

            {/* ✅ SAFE Created Date */}
            <p className="created">
              Created on:{' '}
              {project.createdAt
                ? new Date(project.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'N/A'}
            </p>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button bg="darkcyan" color="white" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ReadProjectModal;
