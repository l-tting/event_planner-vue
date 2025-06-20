Vue.createApp({
    data() {
        return {
            url: 'http://127.0.0.1:5000/',
            UserData: {
                username: null,
                password: null
            }
        }
    },
    methods:{
        async test_api(){
            try{
                const response = await axios.post('http://127.0.0.1:8000/test')
                console.log(response.data)
            }catch(error){
                console.log(error)
            }
        }
    },
    created(){
        this.test_api()
    }
}).mount("#myapp")