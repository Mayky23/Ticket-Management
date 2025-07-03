class TicketDB {
    constructor() {
    this.dbUrl = 'https://api.github.com/repos/tu-usuario/tu-repo/contents/data/tickets.json';
    this.token = 'TU_TOKEN_DE_ACCESO_GITHUB'; // Necesitas crear un token personal
    }

    async getData() {
    try {
    const response = await fetch(this.dbUrl, {
    headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json'
    }
    });
    const data = await response.json();
    return JSON.parse(atob(data.content));
    } catch (error) {
        console.error('Error fetching data:', error);
        return { tickets: [], users: [] };
    }
    }

async updateData(newData) {
    try {
        const current = await this.getData();
        const updatedData = { ...current, ...newData };
        const content = btoa(JSON.stringify(updatedData, null, 2));

        await fetch(this.dbUrl, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Actualización de tickets',
            content: content,
            sha: current.sha // Necesario para actualizar el archivo
        })
        });
        return true;
        } catch (error) {
            console.error('Error updating data:', error);
            return false;
        }
    }
}

const db = new TicketDB();