
"use client";

import { useEffect, useState, type FormEvent } from "react";

import { createProject } from "../../api/projects";
import { getAllUsers, type User } from "../../api/users";
import styles from "./add_project_form.module.css";

export default function AddProjectForm({ onProjectAdded }: { onProjectAdded?: () => void }) {
    const [name, setName] = useState("");
    const [managerId, setManagerId] = useState("");
    const [description, setDescription] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const allUsers = await getAllUsers();
                setUsers(allUsers);
            } catch (err) {
                setError("Failed to load users");
            }
        };

        void loadUsers();
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccess(false);

        if (!name.trim() || !managerId || !description.trim()) {
            setError("Please fill in all fields");
            return;
        }

        setIsSubmitting(true);

        try {
            await createProject({
                name,
                managerId: Number(managerId),
                description,
            });

            setName("");
            setManagerId("");
            setDescription("");
            setSuccess(true);

            onProjectAdded?.();
        } catch (err) {
            setError("Failed to create project");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Add Project</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
                <label className={styles.label}>
                    Project Name
                    <input
                        className={styles.input}
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Enter project name"
                        required
                    />
                </label>

                <label className={styles.label}>
                    Project Manager
                    <select
                        className={styles.input}
                        value={managerId}
                        onChange={(event) => setManagerId(event.target.value)}
                        required
                    >
                        <option value="">Select a manager</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.user_name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className={styles.label}>
                    Project Description
                    <textarea
                        className={styles.textarea}
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Enter project description"
                        required
                    />
                </label>

                {error && <p className={styles.error}>{error}</p>}
                {success && (
                    <p className={styles.success}>
                        Project created successfully!
                    </p>
                )}

                <button
                    className={styles.button}
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Creating..." : "Add Project"}
                </button>
            </form>
        </div>
    );
}
