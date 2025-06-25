// Authentication utility functions for admin panel

const API_BASE_URL = ''; // Use relative URLs for deployment

// Make authenticated API request - backend handles auth
async function authenticatedRequest(endpoint, options = {}) {
    const defaultOptions = {
        credentials: 'include', // Include cookies in request
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, finalOptions);
    
    // If session is expired or invalid, backend will redirect
    if (response.status === 401) {
        window.location.href = '/admin/login';
        return;
    }
    
    return response;
}

// Logout function
async function logout() {
    try {
        // Call logout endpoint to clear server-side session
        await fetch(`${API_BASE_URL}/admin/logout`, {
            method: 'POST',
            credentials: 'include', // Include cookies in request
        });
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Redirect to login
        window.location.href = '/admin/login';
    }
}

// Get user data from server - backend handles auth
async function getUserData() {
    try {
        const response = await authenticatedRequest('/admin/profile');
        if (response && response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

// Update user interface with user data
async function updateUserInterface() {
    const user = await getUserData();
    if (!user) return;
    
    // Update user display elements
    const userElements = [
        { id: 'currentUser', fallback: 'Admin User' },
        { id: 'profileName', fallback: 'Admin User' },
        { id: 'profileEmail', fallback: 'admin@example.com' },
        { id: 'profileRole', fallback: 'Super Admin' }
    ];
    
    userElements.forEach(({ id, fallback }) => {
        const element = document.getElementById(id);
        if (element) {
            if (id === 'profileEmail') {
                element.textContent = user.email || fallback;
            } else if (id === 'profileRole') {
                element.textContent = user.role || fallback;
            } else {
                element.textContent = user.name || user.email || fallback;
            }
        }
    });
}

// Export functions for use in other scripts
window.AuthUtils = {
    authenticatedRequest,
    logout,
    getUserData,
    updateUserInterface,
    API_BASE_URL
}; 