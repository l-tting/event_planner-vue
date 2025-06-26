Vue.createApp({
    data() {
        return {
            url: 'https://oneshop.co.ke/api/admin/',
            adminCreate: {
                admin_name: '',
                admin_email: '',
                admin_phone: '',
                password: '',
            },
            adminAuth: {
                admin_email: '',
                admin_password: '',
            },
            confirmPassword: '',
            showAddForm: false,
            showSuccess: false,
            showError: false,
            successMessage: '',
            errorMessage: '',
            isLoading: false
        }
    },
    methods: {
        async createAdmin() {
            // Validate passwords match
            if (this.adminCreate.password !== this.confirmPassword) {
                this.showError = true;
                this.errorMessage = 'Passwords do not match';
                return;
            }

            // Validate required fields
            if (!this.adminCreate.admin_name || !this.adminCreate.admin_email || 
                !this.adminCreate.admin_phone || !this.adminCreate.password) {
                this.showError = true;
                this.errorMessage = 'Please fill in all required fields';
                return;
            }

            try {
                const response = await axios.post(this.url + 'create', this.adminCreate);
                console.log(response.data);
                
                // Show success message
                this.showSuccess = true;
                this.successMessage = 'Admin user added successfully!';
                this.showError = false;
                
                // Reset form
                this.resetForm();
                
                // Hide success message after 3 seconds
                setTimeout(() => {
                    this.showSuccess = false;
                }, 3000);
                
            } catch (error) {
                console.log(error);
                this.showError = true;
                this.errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
                this.showSuccess = false;
            }
        },
        
        async adminLogin() {
            this.isLoading = true;
            this.showError = false;
            
            try {
                const response = await axios.post(this.url + 'login', this.adminAuth);
                console.log(response.data);
                
                // Backend handles token storage in HTTP-only cookie
                // Just redirect to admin panel on successful login
                window.location.href = 'admin.html';
                
            } catch (error) {
                console.log(error);
                this.showError = true;
                this.errorMessage = error.response?.data?.detail || 'Login failed. Please check your credentials.';
            } finally {
                this.isLoading = false;
            }
        },
        
        toggleAddForm() {
            this.showAddForm = !this.showAddForm;
            if (!this.showAddForm) {
                this.resetForm();
            }
        },
        
        cancelAddForm() {
            this.showAddForm = false;
            this.resetForm();
        },
        
        resetForm() {
            this.adminCreate = {
                admin_name: '',
                admin_email: '',
                admin_phone: '',
                password: '',
            };
            this.confirmPassword = '';
            this.showSuccess = false;
            this.showError = false;
        }
    },
    mounted() {
        // Initialize the form as hidden
        this.showAddForm = false;
    }
}).mount("#myapp")