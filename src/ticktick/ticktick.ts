import { Task, NewTask } from './task';

class TickTick {
    private readonly BASE_URL = 'https://api.ticktick.com/open/v1';
    private readonly AUTH_URL = 'https://ticktick.com/oauth/token';
    private readonly WEB_URL = 'https://ticktick.com/webapp';
    private accessToken = '';

    constructor(accessToken?: string) {
        if (accessToken) {
            this.accessToken = accessToken;
        }
    }

    public async getAccessToken(clientId: string, clientSecret: string, code: string, redirectUri: string): Promise<string> {
        const response = await fetch(this.AUTH_URL, {
            method: 'POST',
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                code,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(`Failed to get access token: ${data.error_description}`);
        }

        this.accessToken = data.access_token;
        return data.access_token;
    }

    private generateTaskUrl(task: Task): string {
        return `${this.WEB_URL}/#p/${encodeURIComponent(task.projectId)}/task/${encodeURIComponent(task.id)}`;
    }

    public async createTask(newTask: NewTask): Promise<Task> {
        const url = `${this.BASE_URL}/task`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.accessToken}`
            },
            body: JSON.stringify(newTask)
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(`Failed to create task: ${data.error_description}`);
        }

        data.taskUrl = this.generateTaskUrl(data);
        return data;
    }
}

export default TickTick;