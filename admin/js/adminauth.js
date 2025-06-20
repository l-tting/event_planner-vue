Vue.createApp({
    data() {
        return {
            url: 'http://127.0.0.1:8000/admin/',
            adminCreate: {
                admin_name: null,
                admin_email: null,
                admin_phone:null,
                password:null,
            },
            adminAuth:{
                admin_email:null,
                admin_password:null,
            }

        }
    },
    methods:{
        createAdmin(){
            try{
                const response =  axios.post(url + 'create',this.adminCreate)
                console.log(response.data)
            }catch(error){
                console.log(error)
            }
        },
        adminLogin(){
            try{
                const response = axios.post(url + 'login' ,this.adminAuth)
                console.log(response.data)
            }catch(error){
                console.log(error)
            }
        }
    },
    created(){
        this.createAdmin()
        this.adminLogin()
    }
}).mount("#myapp")