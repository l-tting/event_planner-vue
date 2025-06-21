Vue.createApp({
    data() {
        return {
            url: 'http://127.0.0.1:8000/admin/',
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
            errorMessage: ''
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
        
        adminLogin() {
            try {
                const response = axios.post(this.url + 'login', this.adminAuth);
                console.log(response.data);
            } catch (error) {
                console.log(error);
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