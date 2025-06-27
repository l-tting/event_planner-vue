// Authentication utility functions for admin panel

const API_BASE_URL = 'https://oneshop.co.ke/api'; // Production server URL

// Check if user is authenticated by making a request to verify session
async function isAuthenticated() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
        
        const response = await fetch(`${API_BASE_URL}/admin/verify`, {
            method: 'GET',
            credentials: 'include', // Include HTTP-only cookies in request
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return response.ok;
    } catch (error) {
        console.error('Auth check error:', error);
        return false;
    }
}

// Make authenticated API request
async function authenticatedRequest(endpoint, options = {}) {
    const defaultOptions = {
        credentials: 'include', // Include HTTP-only cookies in request
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
    
    // If session is expired or invalid, redirect to login
    if (response.status === 401) {
        logout();
        return;
    }
    
    return response;
}

// Logout function
async function logout() {
    try {
        // Call logout endpoint to clear server-side session and HTTP-only cookie
        await fetch(`${API_BASE_URL}/admin/logout`, {
            method: 'POST',
            credentials: 'include', // Include HTTP-only cookies in request
        });
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Redirect to login
        window.location.href = '/admin/login';
    }
}

// Check authentication and redirect if not authenticated
async function requireAuth() {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        window.location.href = '/admin/login';
        return false;
    }
    return true;
}

// Get user data from server
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
    isAuthenticated,
    authenticatedRequest,
    logout,
    requireAuth,
    getUserData,
    updateUserInterface,
    API_BASE_URL
}; 