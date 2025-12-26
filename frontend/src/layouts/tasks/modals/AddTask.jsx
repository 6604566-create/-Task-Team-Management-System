import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
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
} from "@chakra-ui/react";

import api from "../../../api/axios";

/* ================= CONSTANTS ================= */

const PRIORITY_COLORS = {
  "Most Important": "red",
  Important: "yellow",
  "Least Important": "green",
};

/* ================= COMPONENT ================= */

function AddTaskModal({ isOpen, onClose }) {
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);

  /* ================= INITIAL STATE ================= */

  const initialState = useMemo(
    () => ({
      title: "",
      description: "",
      assignTo: "",
      project: "",
      startDate: "",
      priority: "Most Important",
    }),
    []
  );

  const [formData, setFormData] = useState(initialState);

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriorityClick = (priority) => {
    setFormData((prev) => ({ ...prev, priority }));
  };

  /* ================= FETCH DATA ================= */

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast({
        title: "Failed to load employees",
        status: "error",
        position: "top",
      });
    }
  }, [toast]);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await api.get("/projects");
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast({
        title: "Failed to load projects",
        status: "error",
        position: "top",
      });
    }
  }, [toast]);

  /* ================= EFFECT ================= */

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
      fetchProjects();
    } else {
      setFormData(initialState);
    }
  }, [isOpen, fetchEmployees, fetchProjects, initialState]);

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/task", formData);

      toast({
        title: res.data?.message || "Task added successfully",
        status: "success",
        position: "top",
        duration: 4000,
        isClosable: true,
      });

      setFormData(initialState);
      onClose();
    } catch (err) {
      toast({
        title: err.response?.data?.message || "Failed to add task",
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
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.firstName} {emp.lastName}
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
              {projects.map((proj) => (
                <option key={proj._id} value={proj._id}>
                  {proj.title}
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

            {/* PRIORITY */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "15px",
                alignItems: "center",
              }}
            >
              <p>Priority:</p>
              {Object.keys(PRIORITY_COLORS).map((p) => (
                <Tag
                  key={p}
                  size="lg"
                  cursor="pointer"
                  borderRadius="full"
                  colorScheme={
                    formData.priority === p ? PRIORITY_COLORS[p] : "gray"
                  }
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
              {loading ? <Spinner size="sm" /> : "Add Task"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default AddTaskModal;
