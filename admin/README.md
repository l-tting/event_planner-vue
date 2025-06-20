# Harmony Choir Admin Panel

## Access Flow

The admin panel now requires authentication before access. Here's how the flow works:

### 1. Admin Access (`/admin`)
- When users visit `/admin`, they are automatically redirected to the login page
- The redirect page shows a loading animation and then redirects to `login.html`

### 2. Login Page (`/admin/login.html`)
- Users must enter credentials to access the admin panel
- Currently accepts any username/password combination (you can implement your own auth logic)
- Sets session storage to maintain login state
- Redirects to the admin panel after successful login

### 3. Admin Panel (`/admin/admin-panel.html`)
- The main admin dashboard with event management, ticket management, and QR scanner
- Includes a logout button in the navigation
- Checks for valid session before allowing access
- Redirects to login page if no valid session is found

### 4. Logout
- Click the "Logout" button in the admin panel
- Clears session data and redirects to login page

## Files Structure

```
admin/
├── index.html          # Redirect page (automatically redirects to login)
├── login.html          # Admin login page
├── admin-panel.html    # Main admin dashboard
├── js/
│   └── admin.js        # Admin panel functionality
└── README.md           # This file
```

## Security Notes

- The current implementation uses browser session storage for authentication
- This is suitable for basic protection but not for production use
- For production, implement proper server-side authentication
- Consider using HTTPS for secure transmission of credentials
- Add rate limiting and proper password validation

## Customization

To implement your own authentication logic:

1. Replace the simple validation in `login.html` with your auth system
2. Update the session management to use your preferred method
3. Add proper password hashing and validation
4. Implement server-side session management for better security 