document.addEventListener('DOMContentLoaded', function() {
    // Simulación de base de datos en memoria
    let tickets = [];
    let ticketCounter = 1;

    // Referencias DOM
    const ticketForm = document.getElementById('ticketForm');
    const searchBtn = document.getElementById('searchBtn');
    const searchEmail = document.getElementById('searchEmail');
    const ticketsList = document.getElementById('ticketsList');
    const modal = document.getElementById('ticketModal');
    const modalContent = document.getElementById('ticketDetails');
    const closeModal = document.querySelector('.close');
    const currentUser = document.getElementById('currentUser');

    // Event Listeners
    ticketForm.addEventListener('submit', createTicket);
    searchBtn.addEventListener('click', searchTickets);
    closeModal.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // Crear nuevo ticket
    function createTicket(e) {
        e.preventDefault();
        
        const formData = new FormData(ticketForm);
        const userEmail = formData.get('userEmail');
        
        const ticketData = {
            id: `TK${String(ticketCounter).padStart(3, '0')}`,
            title: formData.get('title'),
            category: formData.get('category'),
            priority: formData.get('priority'),
            status: 'abierto',
            description: formData.get('description'),
            userEmail: userEmail,
            assignedTo: null,
            createdDate: new Date().toISOString().split('T')[0],
            updatedDate: new Date().toISOString().split('T')[0],
            comments: []
        };

        tickets.push(ticketData);
        ticketCounter++;

        // Actualizar la interfaz
        currentUser.textContent = userEmail;
        searchEmail.value = userEmail;
        
        alert(`Ticket ${ticketData.id} creado exitosamente. Te notificaremos por email sobre las actualizaciones.`);
        ticketForm.reset();
    }

    // Buscar tickets por email
    function searchTickets() {
        const email = searchEmail.value.trim();
        if (!email) {
            alert('Por favor ingresa tu email');
            return;
        }

        currentUser.textContent = email;
        const userTickets = tickets.filter(ticket => ticket.userEmail === email);
        displayTickets(userTickets);
    }

    // Mostrar tickets
    function displayTickets(userTickets) {        
        if (userTickets.length === 0) {
            ticketsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>No se encontraron tickets</h3>
                    <p>No tienes tickets registrados con este email</p>
                </div>
            `;
            return;
        }

        ticketsList.innerHTML = userTickets.map(ticket => `
            <div class="ticket-item ${ticket.status}" onclick="showTicketDetails('${ticket.id}')">
                <div class="ticket-header">
                    <span class="ticket-id">#${ticket.id}</span>
                    <span class="ticket-status status-${ticket.status}">${getStatusText(ticket.status)}</span>
                </div>
                <div class="ticket-content">
                    <h4>${ticket.title}</h4>
                    <p>${ticket.description.substring(0, 100)}${ticket.description.length > 100 ? '...' : ''}</p>
                    <div class="ticket-meta">
                        <span class="ticket-date">
                            <i class="fas fa-calendar"></i> ${formatDate(ticket.createdDate)}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Mostrar detalles del ticket en modal
    function showTicketDetails(ticketId) {
        const ticket = tickets.find(t => t.id === ticketId);
        if (!ticket) return;

        modalContent.innerHTML = `
            <h2>Ticket #${ticket.id}</h2>
            <p><strong>Estado:</strong> <span class="ticket-status status-${ticket.status}">${getStatusText(ticket.status)}</span></p>
            
            <div class="ticket-details">
                <div class="form-group">
                    <label>Título</label>
                    <p>${ticket.title}</p>
                </div>
                <div class="form-group">
                    <label>Descripción</label>
                    <p>${ticket.description}</p>
                </div>
                <div class="form-group">
                    <label>Fecha de creación</label>
                    <p>${formatDate(ticket.createdDate)}</p>
                </div>
            </div>
            
            ${ticket.comments.length > 0 ? `
                <h3>Actualizaciones del Equipo</h3>
                <div class="comments">
                    ${ticket.comments.map(comment => `
                        <div class="comment">
                            <p><strong>${comment.author}</strong> <small>${comment.date}</small></p>
                            <p>${comment.text}</p>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        `;

        modal.style.display = 'block';
    }

    // Funciones auxiliares
    function getStatusText(status) {
        const statusMap = {
            'abierto': 'Abierto',
            'en-proceso': 'En Proceso',
            'resuelto': 'Resuelto',
            'cerrado': 'Cerrado'
        };
        return statusMap[status] || status;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Hacer función accesible globalmente
    window.showTicketDetails = showTicketDetails;
});