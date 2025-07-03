
    // Al inicio del archivo
    import { db } from '../../scripts/db.js';

    // Ejemplo de uso:
    async function loadTickets() {
        const data = await db.getData();
        renderTickets(data.tickets);
    }

    async function updateTicket(ticketId, updates) {
        const data = await db.getData();
        const ticketIndex = data.tickets.findIndex(t => t.id === ticketId);
        
        if (ticketIndex !== -1) {
            data.tickets[ticketIndex] = { ...data.tickets[ticketIndex], ...updates };
            await db.updateData(data);
            return true;
        }
        return false;
    }

document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    const modal = document.getElementById('ticket-modal');
    const closeModal = document.querySelector('.close');
    const viewButtons = document.querySelectorAll('.btn-comment');
    const assignSelects = document.querySelectorAll('.assign-select');
    const statusButtons = {
        progress: document.querySelectorAll('.btn-progress'),
        resolve: document.querySelectorAll('.btn-resolve'),
        close: document.querySelectorAll('.btn-close')
    };
    
    // Abrir modal al hacer clic en botón de comentario
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const ticketId = this.closest('tr').querySelector('.ticket-id').textContent;
            openTicketModal(ticketId);
        });
    });
    
    // Cerrar modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Asignar técnico
    assignSelects.forEach(select => {
        select.addEventListener('change', function() {
            const ticketId = this.closest('tr').querySelector('.ticket-id').textContent;
            const technicianId = this.value;
            assignTechnician(ticketId, technicianId);
        });
    });
    
    // Cambiar estado desde los botones de acción rápida
    statusButtons.progress.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            updateTicketStatus(row, 'en-proceso', 'En Proceso');
        });
    });
    
    statusButtons.resolve.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            updateTicketStatus(row, 'resuelto', 'Resuelto');
        });
    });
    
    statusButtons.close.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            updateTicketStatus(row, 'cerrado', 'Cerrado');
        });
    });
    
    // Cambiar estado desde el modal
    const modalStatusSelect = document.getElementById('change-status');
    if (modalStatusSelect) {
        modalStatusSelect.addEventListener('change', function() {
            // Aquí iría la lógica para actualizar el estado en el modal
            console.log('Nuevo estado:', this.value);
        });
    }
    
    // Función para abrir el modal con los detalles del ticket
    function openTicketModal(ticketId) {
        // Aquí normalmente harías una petición AJAX para obtener los detalles del ticket
        console.log('Abriendo ticket:', ticketId);
        modal.style.display = 'block';
        
        // Simulación de carga de datos
        document.querySelector('.modal-header h2').innerHTML = `<i class="fas fa-ticket-alt"></i> Gestionar Ticket ${ticketId}`;
    }
    
    // Función para asignar técnico
    function assignTechnician(ticketId, technicianId) {
        console.log(`Asignando ticket ${ticketId} al técnico ${technicianId}`);
        // Aquí iría la lógica AJAX para asignar el técnico
    }
    
    // Función para actualizar estado
    function updateTicketStatus(row, statusClass, statusText) {
        const statusBadge = row.querySelector('.status-badge');
        statusBadge.className = `status-badge status-${statusClass}`;
        statusBadge.textContent = statusText;
        
        console.log(`Actualizando estado a: ${statusText}`);
        // Aquí iría la lógica AJAX para actualizar el estado
    }
    
    // Función para agregar comentario
    const commentSubmit = document.querySelector('.btn-comment-submit');
    if (commentSubmit) {
        commentSubmit.addEventListener('click', function() {
            const commentText = document.getElementById('new-comment').value;
            if (commentText.trim() === '') return;
            
            // Aquí iría la lógica para guardar el comentario
            console.log('Nuevo comentario:', commentText);
            
            // Simulación de añadir comentario
            const commentsContainer = document.querySelector('.ticket-comments');
            const newComment = document.createElement('div');
            newComment.className = 'comment';
            newComment.innerHTML = `
                <div class="comment-header">
                    <span>Admin</span>
                    <span>${new Date().toLocaleString()}</span>
                </div>
                <div class="comment-content">${commentText}</div>
            `;
            
            const addCommentSection = document.querySelector('.add-comment');
            commentsContainer.insertBefore(newComment, addCommentSection);
            
            // Limpiar textarea
            document.getElementById('new-comment').value = '';
        });
    }
    
    // Manejar el cierre del ticket desde el modal
    const closeTicketBtn = document.querySelector('.btn-danger');
    if (closeTicketBtn) {
        closeTicketBtn.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que deseas cerrar este ticket?')) {
                console.log('Cerrando ticket...');
                // Aquí iría la lógica para cerrar el ticket
                modal.style.display = 'none';
            }
        });
    }
    
    // Manejar guardar cambios desde el modal
    const saveChangesBtn = document.querySelector('.btn-success');
    if (saveChangesBtn) {
        saveChangesBtn.addEventListener('click', function() {
            console.log('Guardando cambios...');
            // Aquí iría la lógica para guardar los cambios
            modal.style.display = 'none';
        });
    }
});