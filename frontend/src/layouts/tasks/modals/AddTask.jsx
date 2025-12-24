import React, { useState, useEffect } from 'react';
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
  Select,
  Spinner,
  useToast,
} from '@chakra-ui/react';

import api from '../../../api/axios';

const PRIORITY_COLORS = {
  'Most Important': 'red',
  Important: 'yellow',
  'Least Important': 'green',
};

function AddTaskModal({ isOpen, onClose }) {
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [employeesData, setEmployeesData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);

  const initialState = {
    title: '',
    description: '',
    assignTo: '',
    project: '',
    startDate: '',
    priority: 'Most Important',
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePriorityClick = (priority) =>
    setFormData({ ...formData, priority });

  // ================= FETCH DATA =================
  const fetchEmployees = async () => {
    const res = await api.get('/api/employees');
    setEmployeesData(res.data);
  };

  const fetchProjects = async () => {
    const res = await api.get('/api/projects');
    setProjectsData(res.data);
  };

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
      fetchProjects();
    } else {
      setFormData(initialState);
    }
  }, [isOpen]);

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/api/task', formData);

      toast({
        title: res.data.message || 'Task added successfully',
        status: 'success',
        position: 'top',
        duration: 4000,
        isClosable: true,
      });

      setFormData(initialState);
      onClose();
    } catch (err) {
      toast({
        title: err.response?.data?.message || 'Failed to add task',
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
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Add Task</ModalHeader>
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

            <Select
              mt={3}
              placeholder="Assign To (Employee)"
              name="assignTo"
              value={formData.assignTo}
              onChange={handleChange}
              required
            >
              {employeesData.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.firstName} {e.lastName}
                </option>
              ))}
            </Select>

            <Select
              mt={3}
              placeholder="Project"
              name="project"
              value={formData.project}
              onChange={handleChange}
              required
            >
              {projectsData.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </Select>

            <Input
              mt={3}
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />

            {/* Priority */}
            <div className="priority-container">
              <p>Priority:</p>
              {Object.keys(PRIORITY_COLORS).map((p) => (
                <Tag
                  key={p}
                  size="lg"
                  cursor="pointer"
                  colorScheme={
                    formData.priority === p ? PRIORITY_COLORS[p] : 'gray'
                  }
                  borderRadius="full"
                  onClick={() => handlePriorityClick(p)}
                >
                  {p}
                </Tag>
              ))}
            </div>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose} disabled={loading}>
              Close
            </Button>
            <Button type="submit" colorScheme="teal" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Add Task'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default AddTaskModal;
