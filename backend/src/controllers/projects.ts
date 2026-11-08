import { Request, Response } from "express";
import { supabase } from "../app";

// Check section 1-2 in the README for more details on how to create this controller.

// Get project by ID

export const getProjectById = async (req: Request, res: Response) => {
    const projectId = req.params.id;
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();
    if (error) {
        console.error("Error fetching project by ID:", error);
        return res.status(500).json({ error: "Failed to fetch project" });
    }
    return res.json(data);
};

// Get all projects

export const getAllProjects = async (req: Request, res: Response) => {
    const { data, error } = await supabase
        .from("projects")
        .select("*");
    if (error) {
        console.error("Error fetching projects:", error);
        return res.status(500).json({ error: "Failed to fetch projects" });
    }
    return res.json(data);
};
// Create a new project

export const createProject = async (req: Request, res: Response) => {
    const { name, managerId, description } = req.body;

    const projectData = {
        ...(name !== undefined && { project_name: name }),
        ...(managerId !== undefined && { project_manager_id: managerId }),
        ...(description !== undefined && { project_description: description }),
    };

    if (!name || managerId == null || !description) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const { data: manager, error: managerError } = await supabase
        .from("users")
        .select("id")
        .eq("id", managerId)
        .maybeSingle();

    if (managerError) {
        return res.status(500).json({ error: "Failed to verify manager" });
    }

    if (!manager) {
        return res.status(404).json({ error: "Manager not found" });
    }

    const { data, error } = await supabase
        .from("projects")
        .insert(projectData)
        .select("*")
        .single();

    if (error) {
        console.error("Error creating project:", error);
        return res.status(500).json({ error: "Failed to create project" });
    }

    return res.status(201).json(data);
};

// Update a project

export const updateProjectById = async (req: Request, res: Response) => {
    const projectId = req.params.id;
    const { name, managerId, description } = req.body;
    const projectData = {
        ...(name !== undefined && { project_name: name }),
        ...(managerId !== undefined && { project_manager_id: managerId }),
        ...(description !== undefined && { project_description: description }),
    };

    if (managerId !== undefined) {
        const { data: manager, error: managerError } = await supabase
            .from("users")
            .select("id")
            .eq("id", managerId)
            .maybeSingle();

        if (managerError) {
            return res.status(500).json({ error: "Failed to verify manager" });
        }
        if (!manager) {
            return res.status(404).json({ error: "Manager does not exist" });
        }
    }

    const { data, error } = await supabase
        .from("projects")
        .update(projectData)
        .eq("id", projectId)
        .select("*")
        .single();
    if (error) {
        console.error("Error updating project by ID:", error);
        return res.status(500).json({ error: "Failed to update project" });
    }
    return res.json(data);
};

// Delete a project

export const deleteProjectById = async (req: Request, res: Response) => {
    const projectId = req.params.id;
    const { data, error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId)
        .select("*")
        .single();

    if (error) {
        console.error("Error deleting project by ID:", error);
        return res.status(500).json({ error: "Failed to delete project" });
    }

    return res.json(data);
};