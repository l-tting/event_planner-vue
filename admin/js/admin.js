// Mock data
let events = [
    {
        id: 1,
        title: "Summer Concert Series",
        date: "2024-06-15",
        time: "19:00",
        location: "Grand Concert Hall",
        description: "Join us for an evening of classical and contemporary choral music.",
        imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81",
        capacity: 200,
        price: 25
    },
    {
        id: 2,
        title: "Corporate Gala Performance",
        date: "2024-07-20",
        time: "20:00",
        location: "TechCorp Convention Center",
        description: "Special performance for the annual TechCorp Gala.",
        imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad",
        capacity: 150,
        price: 50
    }
];

let tickets = [
    {
        id: 1,
        eventId: 1,
        attendee: {
            name: "John Doe",
            email: "john@example.com",
            phone: "123-456-7890"
        },
        quantity: 2,
        status: "Verified",
        qrCode: "TICKET-001"
    },
    {
        id: 2,
        eventId: 2,
        attendee: {
            name: "Jane Smith",
            email: "jane@example.com",
            phone: "098-765-4321"
        },
        quantity: 1,
        status: "Pending",
        qrCode: "TICKET-002"
    }
];

// DOM Elements
const eventsList = document.getElementById('eventsList');
const ticketsList = document.getElementById('ticketsList');
const eventFilter = document.getElementById('eventFilter');
const eventModal = document.getElementById('eventModal');
const eventForm = document.getElementById('eventForm');
const addEventBtn = document.getElementById('addEventBtn');
const cancelEventBtn = document.getElementById('cancelEventBtn');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const scanResult = document.getElementById('scanResult');
const eventImageInput = document.getElementById('eventImage');
const selectedFileName = document.getElementById('selectedFileName');
const imagePreview = document.getElementById('imagePreview');
const imagePreviewImg = imagePreview.querySelector('img');

// Tab switching
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.dataset.tab;
        
        // Update active tab button
        tabButtons.forEach(btn => {
            btn.classList.remove('active', 'bg-indigo-600', 'text-white');
            btn.classList.add('bg-gray-200', 'text-gray-700');
        });
        button.classList.add('active', 'bg-indigo-600', 'text-white');
        button.classList.remove('bg-gray-200', 'text-gray-700');

        // Show selected tab content
        tabContents.forEach(content => {
            content.classList.add('hidden');
            if (content.id === `${tabName}Tab`) {
                content.classList.remove('hidden');
            }
        });

        // Initialize QR scanner when scanner tab is selected
        if (tabName === 'scanner') {
            initQRScanner();
        }
    });
});

// Event Management
function renderEvents() {
    eventsList.innerHTML = events.map(event => `
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <img src="${event.imageUrl}" alt="${event.title}" class="w-full h-48 object-cover">
            <div class="p-6">
                <h3 class="text-xl font-semibold mb-2">${event.title}</h3>
                <p class="text-gray-600 mb-4">${event.description}</p>
                <div class="flex items-center text-gray-600 mb-2">
                    <i class="fas fa-calendar mr-2"></i>
                    <span>${new Date(event.date).toLocaleDateString()} at ${event.time}</span>
                </div>
                <div class="flex items-center text-gray-600 mb-4">
                    <i class="fas fa-map-marker-alt mr-2"></i>
                    <span>${event.location}</span>
                </div>
                <div class="flex justify-between items-center">
                    <div class="text-gray-600">
                        <span class="font-semibold">$${event.price}</span> per ticket
                    </div>
                    <div class="space-x-2">
                        <button onclick="editEvent(${event.id})" class="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteEvent(${event.id})" class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Update event filter options
    eventFilter.innerHTML = `
        <option value="">All Events</option>
        ${events.map(event => `
            <option value="${event.id}">${event.title}</option>
        `).join('')}
    `;
}

// Ticket Management
function renderTickets() {
    const selectedEventId = eventFilter.value;
    const filteredTickets = selectedEventId 
        ? tickets.filter(ticket => ticket.eventId === parseInt(selectedEventId))
        : tickets;

    ticketsList.innerHTML = filteredTickets.map(ticket => {
        const event = events.find(e => e.id === ticket.eventId);
        return `
            <tr>
                <td class="px-6 py-4 border-b">${event.title}</td>
                <td class="px-6 py-4 border-b">
                    <div>${ticket.attendee.name}</div>
                    <div class="text-sm text-gray-500">${ticket.attendee.email}</div>
                </td>
                <td class="px-6 py-4 border-b">${ticket.quantity}</td>
                <td class="px-6 py-4 border-b">
                    <span class="px-2 py-1 rounded-full text-sm ${
                        ticket.status === 'Verified' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                    }">
                        ${ticket.status}
                    </span>
                </td>
                <td class="px-6 py-4 border-b">
                    <button onclick="verifyTicket(${ticket.id})" class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                        <i class="fas fa-check"></i> Verify
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// QR Scanner
function initQRScanner() {
    const html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
            // Handle successful scan
            const ticket = tickets.find(t => t.qrCode === decodedText);
            if (ticket) {
                const event = events.find(e => e.id === ticket.eventId);
                scanResult.innerHTML = `
                    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        <h3 class="font-bold">Valid Ticket</h3>
                        <p>Event: ${event.title}</p>
                        <p>Attendee: ${ticket.attendee.name}</p>
                        <p>Quantity: ${ticket.quantity}</p>
                    </div>
                `;
                scanResult.classList.remove('hidden');
            } else {
                scanResult.innerHTML = `
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <h3 class="font-bold">Invalid Ticket</h3>
                        <p>QR code not found in database.</p>
                    </div>
                `;
                scanResult.classList.remove('hidden');
            }
        },
        (error) => {
            // Handle scan error
            console.error(error);
        }
    ).catch((err) => {
        console.error("Failed to start QR scanner:", err);
    });
}

// Event Handlers
addEventBtn.addEventListener('click', () => {
    document.getElementById('modalTitle').textContent = 'Add New Event';
    eventForm.reset();
    selectedFileName.textContent = 'No file chosen';
    imagePreview.classList.add('hidden');
    eventModal.classList.remove('hidden');
    eventModal.classList.add('flex');
});

cancelEventBtn.addEventListener('click', () => {
    eventModal.classList.add('hidden');
    eventModal.classList.remove('flex');
});

eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const file = eventImageInput.files[0];
    
    if (!file) {
        alert('Please select an image for the event');
        return;
    }

    // Create a FileReader to convert the image to base64
    const reader = new FileReader();
    reader.onload = (e) => {
        const formData = {
            id: events.length + 1,
            title: document.getElementById('eventTitle').value,
            date: document.getElementById('eventDate').value,
            time: document.getElementById('eventTime').value,
            location: document.getElementById('eventLocation').value,
            description: document.getElementById('eventDescription').value,
            imageUrl: e.target.result, // Store the base64 image data
            capacity: parseInt(document.getElementById('eventCapacity').value),
            price: parseInt(document.getElementById('eventPrice').value)
        };

        events.push(formData);
        renderEvents();
        eventModal.classList.add('hidden');
        eventModal.classList.remove('flex');
        eventForm.reset();
        selectedFileName.textContent = 'No file chosen';
        imagePreview.classList.add('hidden');
    };
    reader.readAsDataURL(file);
});

eventFilter.addEventListener('change', renderTickets);

// Helper functions
function editEvent(id) {
    const event = events.find(e => e.id === id);
    if (event) {
        document.getElementById('modalTitle').textContent = 'Edit Event';
        document.getElementById('eventId').value = event.id;
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventDate').value = event.date;
        document.getElementById('eventTime').value = event.time;
        document.getElementById('eventLocation').value = event.location;
        document.getElementById('eventDescription').value = event.description;
        document.getElementById('eventCapacity').value = event.capacity;
        document.getElementById('eventPrice').value = event.price;
        
        // Show current image preview
        imagePreviewImg.src = event.imageUrl;
        imagePreview.classList.remove('hidden');
        selectedFileName.textContent = 'Current image';
        
        eventModal.classList.remove('hidden');
        eventModal.classList.add('flex');
    }
}

function deleteEvent(id) {
    if (confirm('Are you sure you want to delete this event?')) {
        events = events.filter(e => e.id !== id);
        renderEvents();
    }
}

function verifyTicket(id) {
    const ticket = tickets.find(t => t.id === id);
    if (ticket && ticket.status === 'Pending') {
        ticket.status = 'Verified';
        renderTickets();
    }
}

// Handle image file selection
eventImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        // Update file name display
        selectedFileName.textContent = file.name;
        
        // Show image preview
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreviewImg.src = e.target.result;
            imagePreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    } else {
        selectedFileName.textContent = 'No file chosen';
        imagePreview.classList.add('hidden');
    }
});

// Initial render
renderEvents();
renderTickets(); 