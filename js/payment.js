Vue.createApp({
    data(){
        return {
                paymentInfo:{
                    full_name:null,
                    email:null,
                    phone_number:null,
                    amount:null,
                }
        }
    },
    methods:{
        async makePayment(){
            try{
                // Calculate the total amount before making payment
                this.calculateAmount();
                
                // Simulate payment processing (no backend)
                console.log('Payment info:', this.paymentInfo);
                
                // Show success message and close booking form
                alert('Thank you for your booking! We will contact you shortly with ticket details.');
                this.closeBooking();
                
                return { success: true, message: 'Booking submitted successfully' };
            }
            catch(error){
                console.log(error);
                alert('There was an error processing your booking. Please try again.');
                throw error;
            }
        },
        calculateAmount() {
            // Get the total price from the DOM
            const totalPriceElement = document.getElementById('totalPrice');
            if (totalPriceElement) {
                const totalPriceText = totalPriceElement.textContent;
                const amount = parseInt(totalPriceText.replace('$', '')) || 0;
                this.paymentInfo.amount = amount;
            }
        },
        closeBooking() {
            const bookingSection = document.getElementById('ticketBooking');
            if (bookingSection) {
                bookingSection.classList.add('hidden');
                // Reset the form
                this.paymentInfo = {
                    full_name: null,
                    email: null,
                    phone_number: null,
                    amount: null,
                };
            }
        }
    },
    mounted(){
        // Initialize amount calculation when component is mounted
        this.calculateAmount();
    }
}).mount('#paymentApp')