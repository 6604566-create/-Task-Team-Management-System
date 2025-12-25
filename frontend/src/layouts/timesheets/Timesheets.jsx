import React, { useEffect, useState } from "react";

/* COMPONENTS */
import Sidenav from "../../components/sidenav/Sidenav";
import Navbar from "../../components/navbar/Navbar";

/* MODALS */
import AddTaskModal from "../tasks/modals/AddTask";
import ReadTaskModal from "../tasks/modals/ReadTask";

/* API */
import api from "../../api/axios";

/* CHAKRA UI */
import {
  Box,
  Flex,
  Grid,
  Text,
  Button,
  Badge,
  CircularProgress,
  CircularProgressLabel,
  Spinner,
} from "@chakra-ui/react";

/* ICONS */
import { FcStatistics } from "react-icons/fc";
import { IoReaderOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";

/* ================= COMPONENT ================= */

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isReadTaskOpen, setIsReadTaskOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH TASKS ================= */

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tasks"); // ✅ CONSISTENT
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch tasks error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  /* ================= DELETE TASK ================= */

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      setIsReadTaskOpen(false);
    } catch (err) {
      console.error("Delete task error:", err);
    }
  };

  /* ================= STATS ================= */

  const total = tasks.length;
  const completed = tasks.filter((t) => t.progress === 100).length;
  const pending = total - completed;

  /* ================= UI ================= */

  return (
    <>
      {/* MODALS */}
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => {
          setIsAddTaskOpen(false);
          fetchTasks();
        }}
      />

      <ReadTaskModal
        isOpen={isReadTaskOpen}
        onClose={() => setIsReadTaskOpen(false)}
        task={selectedTask}
        onDelete={handleDeleteTask}
      />

      {/* PAGE */}
      <Flex minH="100vh" bg="linear-gradient(135deg, #0f172a, #1e293b)">
        {/* SIDENAV */}
        <Box w="240px">
          <Sidenav />
        </Box>

        {/* CONTENT */}
        <Box flex="1" p={6} overflowY="auto">
          <Navbar />

          {/* STATS */}
          <Grid templateColumns="repeat(3, 1fr)" gap={6} mt={6}>
            {[
              { label: "Total Tasks", value: total, color: "#fff" },
              { label: "Completed", value: completed, color: "#22c55e" },
              { label: "Pending", value: pending, color: "#ef4444" },
            ].map((stat) => (
              <Box key={stat.label} sx={styles.glassCard}>
                <Text fontSize="13px" color="#cbd5f5">
                  {stat.label}
                </Text>
                <Text fontSize="28px" fontWeight="700" color={stat.color}>
                  {stat.value}
                </Text>
              </Box>
            ))}
          </Grid>

          {/* MAIN GRID */}
          <Grid templateColumns="2fr 1fr" gap={6} mt={6}>
            {/* TASK LIST */}
            <Box sx={styles.glassCard}>
              <Flex justify="space-between" align="center" mb={4}>
                <Flex align="center" gap={2}>
                  <FcStatistics />
                  <Text fontWeight="600" color="#fff">
                    Tasks
                  </Text>
                </Flex>

                <Button
                  leftIcon={<IoMdAdd />}
                  sx={styles.primaryBtn}
                  onClick={() => setIsAddTaskOpen(true)}
                >
                  Add Task
                </Button>
              </Flex>

              {/* CONTENT */}
              {loading ? (
                <Flex justify="center" py={10}>
                  <Spinner color="pink.400" />
                </Flex>
              ) : tasks.length === 0 ? (
                <Text color="#cbd5f5" textAlign="center">
                  No tasks yet. Add your first task 🚀
                </Text>
              ) : (
                <Flex direction="column" gap={4}>
                  {tasks.map((task) => (
                    <Box
                      key={task._id}
                      sx={styles.taskCard}
                      _hover={{ transform: "translateY(-3px)" }}
                    >
                      <Flex justify="space-between" align="center" mb={2}>
                        <Text fontWeight="600" color="#fff">
                          {task.title}
                        </Text>

                        <IoReaderOutline
                          style={{ cursor: "pointer", color: "#fff" }}
                          onClick={() => {
                            setSelectedTask(task);
                            setIsReadTaskOpen(true);
                          }}
                        />
                      </Flex>

                      <Text fontSize="13px" color="#cbd5f5" noOfLines={2}>
                        {task.description}
                      </Text>

                      <Flex justify="space-between" align="center" mt={3}>
                        <Badge
                          colorScheme={
                            task.priority === "Most Important"
                              ? "red"
                              : task.priority === "Important"
                              ? "yellow"
                              : "green"
                          }
                        >
                          {task.priority}
                        </Badge>

                        <Text fontSize="11px" color="#94a3b8">
                          {task.createdAt
                            ? new Date(task.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "N/A"}
                        </Text>
                      </Flex>
                    </Box>
                  ))}
                </Flex>
              )}
            </Box>

            {/* PROGRESS */}
            <Box sx={styles.glassCard} textAlign="center">
              <Text fontWeight="600" color="#fff" mb={4}>
                Task Progress
              </Text>

              <Flex justify="space-around">
                <Box>
                  <CircularProgress
                    value={total ? (completed / total) * 100 : 0}
                    color="green.400"
                  >
                    <CircularProgressLabel color="#fff">
                      {total ? Math.round((completed / total) * 100) : 0}%
                    </CircularProgressLabel>
                  </CircularProgress>
                  <Text mt={2} color="#cbd5f5">
                    Completed
                  </Text>
                </Box>

                <Box>
                  <CircularProgress
                    value={total ? (pending / total) * 100 : 0}
                    color="red.400"
                  >
                    <CircularProgressLabel color="#fff">
                      {total ? Math.round((pending / total) * 100) : 0}%
                    </CircularProgressLabel>
                  </CircularProgress>
                  <Text mt={2} color="#cbd5f5">
                    Pending
                  </Text>
                </Box>
              </Flex>
            </Box>
          </Grid>
        </Box>
      </Flex>
    </>
  );
}

export default Tasks;

/* ================= STYLES ================= */

const styles = {
  glassCard: {
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(18px)",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
    border: "1px solid rgba(255,255,255,0.15)",
  },

  taskCard: {
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(14px)",
    borderRadius: "16px",
    padding: "16px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
    transition: "transform 0.3s ease",
  },

  primaryBtn: {
    background: "#ec4899",
    color: "#fff",
    borderRadius: "30px",
    padding: "8px 18px",
    _hover: { bg: "#db2777" },
  },
};
