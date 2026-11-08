
"use client";

import { useEffect, useState, type FormEvent } from "react";

import { getAllProjects, type Project } from "../../api/projects";
import { getAllUsers, type User } from "../../api/users";
import { createAssociate } from "../../api/associates";
import styles from "./assign_user_to_project_form.module.css";

export default function AssignUserToProjectForm({
    onAssignmentAdded
}: {
    onAssignmentAdded?: () => void;
}) {
    const [projectId, setProjectId] = useState("");
    const [associateId, setAssociateId] = useState("");
    const [projects, setProjects] = useState<Project[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [allProjects, allUsers] = await Promise.all([
                    getAllProjects(),
                    getAllUsers()
                ]);

                setProjects(allProjects);
                setUsers(allUsers);
            } catch (err) {
                setError("Failed to load projects or users");
            }
        };

        void loadData();
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccess(false);

        if (!projectId || !associateId) {
            setError("Please select a project and a user");
            return;
        }

        setIsSubmitting(true);

        try {
            await createAssociate({
                project_id: Number(projectId),
                associate_id: Number(associateId)
            });

            setProjectId("");
            setAssociateId("");
            setSuccess(true);

            onAssignmentAdded?.();
        } catch (err) {
            setError("Failed to assign user to project");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Assign User to Project</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
                <label className={styles.label}>
                    Project
                    <select
                        className={styles.input}
                        value={projectId}
                        onChange={(event) => setProjectId(event.target.value)}
                        required
                    >
                        <option value="">Select a project</option>
                        {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                                {project.project_name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className={styles.label}>
                    User
                    <select
                        className={styles.input}
                        value={associateId}
                        onChange={(event) => setAssociateId(event.target.value)}
                        required
                    >
                        <option value="">Select a user</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.user_name}
                            </option>
                        ))}
                    </select>
                </label>

                {error && <p className={styles.error}>{error}</p>}

                {success && (
                    <p className={styles.success}>
                        User assigned successfully!
                    </p>
                )}

                <button
                    className={styles.button}
                    type="submit"
                    disabled={isSubmitting || projects.length === 0 || users.length === 0}
                >
                    {isSubmitting ? "Assigning..." : "Assign User"}
                </button>
            </form>
        </div>
    );
}
