import React, { useState, useEffect } from "react";
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

function AddTimesheetModal({ isOpen, onClose }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [employeesData, setEmployeesData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [tasksData, setTasksData] = useState([]);

  const [formData, setFormData] = useState({
    notes: "",
    employee: "",
    project: "",
    task: "",
    progress: 0,
    timeSpent: 0, // ✅ FIXED
    workDate: "",
    type: "Development",
  });

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "progress" || name === "timeSpent"
          ? Number(value)
          : value,
    }));
  };

  const handleTypeClick = (type) => {
    setFormData((prev) => ({ ...prev, type }));
  };

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!isOpen) return;

    api.get("/api/employees").then((res) => setEmployeesData(res.data));
    api.get("/api/projects").then((res) => setProjectsData(res.data));
    api.get("/api/tasks").then((res) => setTasksData(res.data));
  }, [isOpen]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { employee, project, task, workDate, timeSpent, notes, type } =
      formData;

    if (!employee || !project || !task || !workDate || !timeSpent) {
      toast({
        title: "All fields are required",
        status: "error",
        position: "top",
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        employee,
        project,
        task,
        workDate,
        timeSpent: Number(timeSpent),
        notes,
        type,
      };

      await api.post("/api/timesheet", payload);

      await api.patch(`/api/task/${task}/progress`, {
        progress: Number(formData.progress),
      });

      toast({
        title: "Timesheet added successfully",
        status: "success",
        position: "top",
      });

      setFormData({
        notes: "",
        employee: "",
        project: "",
        task: "",
        progress: 0,
        timeSpent: 0,
        workDate: "",
        type: "Development",
      });

      onClose();
    } catch (err) {
      toast({
        title:
          err.response?.data?.message ||
          "Invalid data sent to server (400 Bad Request)",
        status: "error",
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER TASKS ================= */
  const filteredTasks = tasksData.filter(
    (t) => t.project?._id === formData.project
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Add Timesheet</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Textarea
              mt={3}
              placeholder="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />

            <Select
              mt={3}
              placeholder="Employee"
              name="employee"
              value={formData.employee}
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

            <Select
              mt={3}
              placeholder="Task"
              name="task"
              value={formData.task}
              onChange={handleChange}
              isDisabled={!formData.project}
              required
            >
              {filteredTasks.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.title}
                </option>
              ))}
            </Select>

            <Input
              mt={3}
              type="number"
              name="progress"
              placeholder="Progress (%)"
              value={formData.progress}
              onChange={handleChange}
            />

            <Input
              mt={3}
              type="number"
              name="timeSpent"
              placeholder="Time Spent (hours)"
              value={formData.timeSpent}
              onChange={handleChange}
              required
            />

            <Input
              mt={3}
              type="date"
              name="workDate"
              value={formData.workDate}
              onChange={handleChange}
              required
            />

            <div style={{ marginTop: "12px" }}>
              {["Development", "Testing", "Other"].map((t) => (
                <Tag
                  key={t}
                  size="lg"
                  mr={2}
                  cursor="pointer"
                  colorScheme={formData.type === t ? "green" : "gray"}
                  onClick={() => handleTypeClick(t)}
                >
                  {t}
                </Tag>
              ))}
            </div>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
            <Button type="submit" colorScheme="teal">
              {loading ? <Spinner /> : "Add Timesheet"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default AddTimesheetModal;
