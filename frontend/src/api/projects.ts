
export type Project = {
    id: number;
    project_name: string;
    project_manager_id: number;
    project_description: string;
};

export type ProjectInput = {
    name: string;
    managerId: number;
    description: string;
};

// GET /project/:id - Get project by ID
export const getProjectById = async (id: number): Promise<Project> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${id}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch project with ID ${id}`);
    }

    const data = (await response.json()) as Project;
    return data;
};

// GET /projects/all - Get all projects
export const getAllProjects = async (): Promise<Project[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/all`);

    if (!response.ok) {
        throw new Error("Failed to fetch projects");
    }

    const data = (await response.json()) as Project[];
    return data;
};

// POST /project - Create a new project
export const createProject = async (project: ProjectInput): Promise<Project> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/project`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
    });

    if (!response.ok) {
        throw new Error("Failed to create project");
    }

    const data = (await response.json()) as Project;
    return data;
};

// PUT /project/:id - Update project by ID
export const updateProjectById = async (
    id: number,
    updates: Partial<ProjectInput>
): Promise<Project> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
    });

    if (!response.ok) {
        throw new Error(`Failed to update project with ID ${id}`);
    }

    const data = (await response.json()) as Project;
    return data;
};

// DELETE /project/:id - Delete project by ID
export const deleteProjectById = async (id: number): Promise<Project> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error(`Failed to delete project with ID ${id}`);
    }

    const data = (await response.json()) as Project;
    return data;
};
