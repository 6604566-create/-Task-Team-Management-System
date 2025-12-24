import React, { useState } from 'react';
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
} from '@chakra-ui/react';

import api from '../../../api/axios';

function AddProjectModal({ isOpen, onClose }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientName: '',
    startDate: '',
    status: 'On Hold',
    priority: 'Most Important',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusClick = (status) => {
    setFormData({ ...formData, status });
  };

  const handlePriorityClick = (priority) => {
    setFormData({ ...formData, priority });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/api/project', formData);

      toast({
        title: response.data.message || 'Project added successfully',
        status: 'success',
        position: 'top',
        duration: 4000,
        isClosable: true,
      });

      setFormData({
        title: '',
        description: '',
        clientName: '',
        startDate: '',
        status: 'On Hold',
        priority: 'Most Important',
      });

      onClose();
    } catch (error) {
      toast({
        title: error.response?.data?.message || 'Failed to add project',
        status: 'error',
        position: 'top',
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
              rows={6}
              mt={3}
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

            {/* Status */}
            <div className="priority-container">
              <p>Status:</p>
              {['On Hold', 'In Progress', 'Testing', 'Completed'].map((s) => (
                <Tag
                  key={s}
                  size="lg"
                  cursor="pointer"
                  colorScheme={formData.status === s ? 'blue' : 'gray'}
                  borderRadius="full"
                  onClick={() => handleStatusClick(s)}
                >
                  {s}
                </Tag>
              ))}
            </div>

            {/* Priority */}
            <div className="priority-container">
              <p>Priority:</p>
              {['Most Important', 'Important', 'Least Important'].map((p) => (
                <Tag
                  key={p}
                  size="lg"
                  cursor="pointer"
                  colorScheme={formData.priority === p ? 'red' : 'gray'}
                  borderRadius="full"
                  onClick={() => handlePriorityClick(p)}
                >
                  {p}
                </Tag>
              ))}
            </div>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
            <Button type="submit" colorScheme="teal">
              {loading ? <Spinner /> : 'Add Project'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default AddProjectModal;
