import { Router } from "express";
import * as projectsController from "../controllers/projects";

const router = Router();

// GET /projects/all - Get all projects
router.get("/projects/all", projectsController.getAllProjects);

// GET /project/:id - Get project by ID
router.get("/project/:id", projectsController.getProjectById);

// POST /project - Create a new project
router.post("/project", projectsController.createProject);

// PUT /project/:id - Update project by ID
router.put("/project/:id", projectsController.updateProjectById);

// DELETE /project/:id - Delete project by ID
router.delete("/project/:id", projectsController.deleteProjectById);

export default router;


