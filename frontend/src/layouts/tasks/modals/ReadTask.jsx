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
  Text,
} from '@chakra-ui/react';
import { MdDelete } from 'react-icons/md';

function ReadTaskModal({ isOpen, onClose, task, onDelete }) {
  if (!task) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Task Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text textAlign="center" color="gray.500">
              No task selected
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Delete this task?')) {
      onDelete(task._id);
      onClose(); // ✅ close modal after delete
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
        <ModalHeader>Task Details</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <div className="task-card-container">
            {/* Title */}
            <p className="task-title">{task.title}</p>

            {/* Description */}
            <div className="task-desc-container">
              <p className="task-desc">{task.description}</p>
            </div>

            {/* Footer */}
            <div className="task-card-footer-container">
              <Tag
                size="lg"
                borderRadius="full"
                colorScheme={
                  task.priority === 'Most Important'
                    ? 'red'
                    : task.priority === 'Important'
                    ? 'yellow'
                    : 'green'
                }
              >
                {task.priority}
              </Tag>

              <div
                className="task-read"
                style={{ cursor: 'pointer' }}
                onClick={handleDelete}
              >
                <MdDelete className="read-icon" />
              </div>
            </div>

            {/* ✅ SAFE & CONSISTENT DATE */}
            <p className="created">
              Created on:{' '}
              {task.createdAt
                ? new Date(task.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'N/A'}
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

export default ReadTaskModal;
