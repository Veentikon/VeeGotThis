import { useState } from 'react';
import './CreateTask.css';

type CreateTaskProps = {
  onCreate: (taskDescription: string) => void;
  onCancel: () => void;
};

export default function CreateTask({ onCreate, onCancel }: CreateTaskProps) {
    const [taskDescription, setDescription] = useState("");
    const handleCreate = () => {
        if (!taskDescription.trim()) return;
        onCreate(taskDescription);
        setDescription("");
    };

    return (
        <div className='createTaskContainer'>
            <input
                id='taskInput'
                type="text"
                placeholder="Task Description"
                value={taskDescription}
                onChange={(e) => setDescription(e.target.value)}
            />
            <div className='createTaskButtons'>
                <button type="button" onClick={handleCreate}>Create</button>
                <button type="button" onClick={onCancel}>Close</button>
            </div>
        </div>
    )
}