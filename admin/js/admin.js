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

// Mock admin data (replace with your backend data)
let adminUsers = [
    {
        id: 1,
        fullName: 'Admin User',
        email: 'admin@example.com',
        phone: '+1 (555) 123-4567',
        role: 'Super Admin',
        status: 'Active',
        lastLogin: '2024-01-15 10:30 AM'
    },
    {
        id: 2,
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '+1 (555) 234-5678',
        role: 'Admin',
        status: 'Active',
        lastLogin: '2024-01-14 02:15 PM'
    },
    {
        id: 3,
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1 (555) 345-6789',
        role: 'Moderator',
        status: 'Inactive',
        lastLogin: '2024-01-10 09:45 AM'
    }
];

// Render admin list
function renderAdminList() {
    const adminList = document.getElementById('adminList');
    if (!adminList) return;
    
    adminList.innerHTML = adminUsers.map(admin => `
        <tr class="border-b border-gray-200 hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                        <span class="text-sm font-medium text-indigo-600">
                            ${admin.fullName ? admin.fullName.split(' ').map(n => n.charAt(0)).join('') : 'A'}
                        </span>
                    </div>
                    <div>
                        <div class="text-sm font-medium text-gray-900">${admin.fullName || 'Admin User'}</div>
                        <div class="text-sm text-gray-500">${admin.phone || 'No phone'}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${admin.email}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full ${
                    admin.role === 'Super Admin' ? 'bg-purple-100 text-purple-800' :
                    admin.role === 'Admin' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                }">
                    ${admin.role}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full ${
                    admin.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }">
                    ${admin.status}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${admin.lastLogin}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                    <button onclick="editAdmin(${admin.id})" class="text-indigo-600 hover:text-indigo-900">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="toggleAdminStatus(${admin.id})" class="text-yellow-600 hover:text-yellow-900">
                        <i class="fas fa-toggle-on"></i>
                    </button>
                    <button onclick="deleteAdmin(${admin.id})" class="text-red-600 hover:text-red-900">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Edit admin function
function editAdmin(adminId) {
    const admin = adminUsers.find(a => a.id === adminId);
    if (admin) {
        // You can implement edit functionality here
        alert(`Edit admin: ${admin.fullName}`);
    }
}

// Toggle admin status function
function toggleAdminStatus(adminId) {
    const admin = adminUsers.find(a => a.id === adminId);
    if (admin) {
        admin.status = admin.status === 'Active' ? 'Inactive' : 'Active';
        renderAdminList();
        
        // You can add backend call here
        // fetch(`/admin/toggle-status/${adminId}`, { method: 'POST' })
    }
}

// Delete admin function
function deleteAdmin(adminId) {
    const admin = adminUsers.find(a => a.id === adminId);
    if (admin) {
        if (confirm(`Are you sure you want to delete ${admin.fullName}?`)) {
            adminUsers = adminUsers.filter(a => a.id !== adminId);
            renderAdminList();
            
            // You can add backend call here
            // fetch(`/admin/delete/${adminId}`, { method: 'DELETE' })
        }
    }
}

// Profile Dropdown Logic
const profileBtn = document.getElementById('profileBtn');
const profileMenu = document.getElementById('profileMenu');
const profileDropdown = document.getElementById('profileDropdown');

// Toggle profile dropdown
profileBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    profileMenu.classList.toggle('hidden');
});

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!profileDropdown.contains(e.target)) {
        profileMenu.classList.add('hidden');
    }
});

// Load current user data (you can replace this with your backend data)
function loadCurrentUserData() {
    // This would typically come from your backend
    const userData = {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        username: 'admin',
        role: 'Super Admin'
    };
    
    // Update profile display
    document.getElementById('currentUser').textContent = `${userData.firstName} ${userData.lastName}`;
    document.getElementById('profileName').textContent = `${userData.firstName} ${userData.lastName}`;
    document.getElementById('profileEmail').textContent = userData.email;
    document.getElementById('profileRole').textContent = userData.role;
    
    // Update settings form
    document.getElementById('settingsFirstName').value = userData.firstName;
    document.getElementById('settingsLastName').value = userData.lastName;
    document.getElementById('settingsEmail').value = userData.email;
    document.getElementById('settingsUsername').value = userData.username;
}

// Change Password Modal Logic
const changePasswordBtn = document.getElementById('changePasswordBtn');
const changePasswordModal = document.getElementById('changePasswordModal');
const changePasswordForm = document.getElementById('changePasswordForm');
const cancelChangePasswordBtn = document.getElementById('cancelChangePasswordBtn');
const cancelChangePasswordBtn2 = document.getElementById('cancelChangePasswordBtn2');
const changePasswordSuccess = document.getElementById('changePasswordSuccess');
const changePasswordError = document.getElementById('changePasswordError');
const changePasswordErrorText = document.getElementById('changePasswordErrorText');

// Open change password modal
changePasswordBtn.addEventListener('click', function(e) {
    e.preventDefault();
    profileMenu.classList.add('hidden');
    changePasswordModal.classList.remove('hidden');
    changePasswordModal.classList.add('flex');
    changePasswordForm.reset();
    changePasswordSuccess.classList.add('hidden');
    changePasswordError.classList.add('hidden');
});

// Close change password modal
function closeChangePasswordModal() {
    changePasswordModal.classList.add('hidden');
    changePasswordModal.classList.remove('flex');
}

cancelChangePasswordBtn.addEventListener('click', closeChangePasswordModal);
cancelChangePasswordBtn2.addEventListener('click', closeChangePasswordModal);

// Handle change password form submission
changePasswordForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    // Hide messages
    changePasswordSuccess.classList.add('hidden');
    changePasswordError.classList.add('hidden');
    
    // Validate passwords
    if (newPassword !== confirmNewPassword) {
        showChangePasswordError('New passwords do not match.');
        return;
    }
    
    if (newPassword.length < 8) {
        showChangePasswordError('New password must be at least 8 characters long.');
        return;
    }
    
    // Submit to backend
    const passwordData = {
        currentPassword: currentPassword,
        newPassword: newPassword
    };
    
    // Show loading state
    const submitBtn = changePasswordForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Changing Password...';
    submitBtn.disabled = true;
    
    // You can replace this with your actual backend endpoint
    fetch('/admin/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showChangePasswordSuccess();
            changePasswordForm.reset();
        } else {
            showChangePasswordError(data.message || 'Failed to change password.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showChangePasswordError('Network error. Please try again.');
    })
    .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
});

function showChangePasswordSuccess() {
    changePasswordSuccess.classList.remove('hidden');
    changePasswordError.classList.add('hidden');
    
    setTimeout(() => {
        closeChangePasswordModal();
    }, 2000);
}

function showChangePasswordError(message) {
    changePasswordErrorText.textContent = message;
    changePasswordError.classList.remove('hidden');
    changePasswordSuccess.classList.add('hidden');
}

// Settings Modal Logic
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const settingsForm = document.getElementById('settingsForm');
const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
const cancelSettingsBtn2 = document.getElementById('cancelSettingsBtn2');
const settingsSuccess = document.getElementById('settingsSuccess');
const settingsError = document.getElementById('settingsError');
const settingsErrorText = document.getElementById('settingsErrorText');

// Open settings modal
settingsBtn.addEventListener('click', function(e) {
    e.preventDefault();
    profileMenu.classList.add('hidden');
    settingsModal.classList.remove('hidden');
    settingsModal.classList.add('flex');
    settingsSuccess.classList.add('hidden');
    settingsError.classList.add('hidden');
});

// Close settings modal
function closeSettingsModal() {
    settingsModal.classList.add('hidden');
    settingsModal.classList.remove('flex');
}

cancelSettingsBtn.addEventListener('click', closeSettingsModal);
cancelSettingsBtn2.addEventListener('click', closeSettingsModal);

// Handle settings form submission
settingsForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Hide messages
    settingsSuccess.classList.add('hidden');
    settingsError.classList.add('hidden');
    
    // Get form data
    const formData = new FormData(settingsForm);
    const settingsData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        username: formData.get('username'),
        emailNotifications: formData.get('emailNotifications') === 'on',
        ticketNotifications: formData.get('ticketNotifications') === 'on',
        adminNotifications: formData.get('adminNotifications') === 'on',
        theme: formData.get('theme'),
        compactMode: formData.get('compactMode') === 'on'
    };
    
    // Show loading state
    const submitBtn = settingsForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Saving...';
    submitBtn.disabled = true;
    
    // You can replace this with your actual backend endpoint
    fetch('/admin/settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSettingsSuccess();
            // Update profile display with new data
            loadCurrentUserData();
        } else {
            showSettingsError(data.message || 'Failed to save settings.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showSettingsError('Network error. Please try again.');
    })
    .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
});

function showSettingsSuccess() {
    settingsSuccess.classList.remove('hidden');
    settingsError.classList.add('hidden');
    
    setTimeout(() => {
        closeSettingsModal();
    }, 2000);
}

function showSettingsError(message) {
    settingsErrorText.textContent = message;
    settingsError.classList.remove('hidden');
    settingsSuccess.classList.add('hidden');
}

// Initialize user data
loadCurrentUserData();

// Initialize admin list
renderAdminList();

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        // Redirect to backend logout endpoint
        window.location.href = '/admin/logout';
    }
}); 