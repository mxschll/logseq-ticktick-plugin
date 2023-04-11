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

    public getAccessToken(clientId: string, clientSecret: string, code: string, redirectUri: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', this.AUTH_URL);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = () => {
                const data = JSON.parse(xhr.responseText);
                if (xhr.status >= 200 && xhr.status < 300) {
                    this.accessToken = data.access_token;
                    resolve(data.access_token);
                } else {
                    reject(new Error(`Failed to get access token: ${data.error_description}`));
                }
            };
            xhr.onerror = () => reject(new Error("Network error getting access token"));
            xhr.send(new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                code,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            }));
        });
    }

    public setAccessToken(accessToken: string): void {
        this.accessToken = accessToken;
    }

    private generateTaskUrl(task: Task): string {
        return `${this.WEB_URL}/#p/${encodeURIComponent(task.projectId)}/task/${encodeURIComponent(task.id)}`;
    }

    public createTask(newTask: NewTask): Promise<Task> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const url = `${this.BASE_URL}/task`;
            xhr.open('POST', url);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', `Bearer ${this.accessToken}`);
            xhr.onload = () => {
                const data = JSON.parse(xhr.responseText);
                if (xhr.status >= 200 && xhr.status < 300) {
                    data.taskUrl = this.generateTaskUrl(data);
                    resolve(data);
                } else {
                    reject(new Error(`Failed to create task: ${data.error_description}`));
                }
            };
            xhr.onerror = () => reject(new Error("Network error creating task"));
            xhr.send(JSON.stringify(newTask));
        });
    }
}

export default TickTick;