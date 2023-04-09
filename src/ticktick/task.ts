export interface Task {
    id: string;
    projectId: string;
    title: string;
    allDay?: boolean;
    completedTime?: string; // Format: "yyyy-MM-dd'T'HH:mm:ssZ", Example: "2019-11-13T03:00:00+0000"
    content?: string;
    desc?: string;
    dueDate?: string; // Format: "yyyy-MM-dd'T'HH:mm:ssZ", Example: "2019-11-13T03:00:00+0000"
    items?: Subtask[];
    priority?: 0 | 1 | 3 | 5;
    reminders?: string[];
    repeat?: string;
    sortOrder?: number; // Example: 12345
    startDate?: string; // Format: "yyyy-MM-dd'T'HH:mm:ssZ", Example: "2019-11-13T03:00:00+0000"
    status?: 0 | 1;
    timeZone?: string; // Example: "America/Los_Angeles"
    taskUrl: string;
}

export interface Subtask {
    id?: string;
    title: string;
    status?: 0 | 1;
    completedTime?: string; // Format: "yyyy-MM-dd'T'HH:mm:ssZ", Example: "2019-11-13T03:00:00+0000"
    isAllDay?: boolean;
    sortOrder?: number; // Example: 234444
    startDate?: string; // Format: "yyyy-MM-dd'T'HH:mm:ssZ", Example: "2019-11-13T03:00:00+0000"
    timeZone?: string; // Example: "America/Los_Angeles"
}  

export interface NewTask extends Partial<Task> {
    title: string;
}