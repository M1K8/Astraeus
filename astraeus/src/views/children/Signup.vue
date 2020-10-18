<template>
    <body>
        <Dialog header="Error!" v-model:visible="errorVisible">
            {{ errorMessage }}
        </Dialog> 
        <form id="main-login" :style="mainStyleObj" @mouseover="hoverOn" @mouseleave="hoverOff">
            <div id="logo" :style="logoStyleObj"> <img src='@/assets/m1k.png'/> </div>

            <div id="text-box" :style="textStyleObj">
                <span class="p-float-label">
                    <InputText id="email" type="text" v-model="emailStr" :class="{ 'p-invalid' : false}" />
                    <label v-if="visible"  for="email">Email</label>
                        <div v-if="false">
                        <div v-for="(error, index) of $v.$errors"
                            :key="index"> 
                            <small v-if="error.$property == 'emailStr'" class="p-invalid" >
                                {{error.$message}} 
                            </small>
                        </div>
                    </div>                    
                </span>
            </div>

            <div id="text-box" :style="textStyleObj">
                <span class="p-float-label ">
                    <InputText id="username" type="text" v-model="uNameStr" :class="{ 'p-invalid' : false}" v-tooltip="'Username must be between 4 and 12 characters'" />
                    <label v-if="visible" for="username">Username</label>
                    <div v-if="false">
                        <div v-for="(error, index) of $v.$errors"
                            :key="index"> 
                            <small v-if="error.$property == 'uNameStr'" class="p-invalid" >
                                {{error.$message}} 
                            </small>
                            </div>
                    </div>                    
                </span>
            </div>
  
            <div class="text-box" id="pwbox" :style="textStyleObj">
                <!-- THIS ONLY WORKS BECAUSE I CHANGED PASSWORD.VUE + css !-->
                <span class="p-float-label ">
                    <Password id="password" v-model="pwdStr"/>
                    <label v-if="visible" for="password">Password</label>
                </span>

            </div>
            <div class="text-box" :style="textStyleObj">
                <span class="p-float-label ">
                    <InputText id="confirm-password" type="password" v-model="pwdConfStr" :class="{ 'p-invalid' : false} "/>
                    <label v-if="visible" for="confirm-password">Confirm Password</label>
                    <div v-if="false">
                        <div v-for="(error, index) of $v.$errors"
                            :key="index"> 
                            <small v-if="error.$property == 'pwdConfStr'" class="p-invalid" >
                                {{error.$message}} 
                            </small>
                            </div>
                    </div>
                </span>
            </div>

             <Button :disabled='isDisabled'  v-if="visible" @click="signup" id="signup" :style="loginButtStyleObj" class="p-button-success p-button-rounded p-button-raised p-button-lg">
                 <p >Signup</p>
             </Button>

             <Button label="Link" class="p-button-link" v-if="visible" id="login-link" @click="navToLogin"> Already have an account? Click here to Login </Button>
        </form>
    </body>
</template>

<script lang="ts">
import Vue, { computed, onMounted, reactive, ref } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button';
import Password from 'primevue/password'
import Dialog from 'primevue/dialog'
import Tooltip from 'primevue/tooltip'
import { db, auth, functions } from '../../firebase'
import { useRouter } from 'vue-router'
export default {
    components : {
        InputText,
        Button,
        Password,
        Dialog
    },
    directives: {
        'tooltip' : Tooltip
    },
    setup() {
        const uNameStr     = ref("");
        const pwdStr       = ref("");
        const pwdConfStr   = ref("");
        const emailStr     = ref("");
        const errorMessage = ref("");
        const visible      = ref(false);
        const errorVisible = ref(false);
        const router       = useRouter();
        const isDisabled   = computed( () => {
            return (emailStr.value.trim().length === 0) 
            || (pwdStr.value.trim().length === 0)
            || (pwdConfStr.value.trim().length === 0)
            || (uNameStr.value.trim().length === 0 || uNameStr.value.length < 3 || uNameStr.value.length > 16);
        })

        const mainStyleObj = reactive( {
            opacity: 0.45,
            transition: "0.2s",
            "border-radius": "40px",
            background: "#eaeaea",
            display: "flex",
            "flex-direction": "column",
            padding: "50px",
            width: "300px",
            height: "500px",
            position: "absolute",
            top:0,
            bottom: 0,
            left:0,
            right: 0,
            "align-items": "center",
            margin: "auto"
        })

        const textStyleObj = reactive({
            "padding-bottom": "20px",
            background: "inherit",
            transition: "0.2s"
        })

        const logoStyleObj = reactive({
            "padding-bottom" : "10px",
            transition: "0.2s"
        })

        const loginButtStyleObj = reactive({
            "margin-top" : "10px",
            transition: "0.2s"
        })

        function hoverOn() {
            mainStyleObj.width= "450px";
            mainStyleObj.height = "650px";
            mainStyleObj.opacity = 0.75;
            mainStyleObj["border-radius"] = "35px"
            textStyleObj["padding-bottom"] = "40px";
            logoStyleObj["padding-bottom"] = "50px";
            loginButtStyleObj["margin-top"] = "10px";
            visible.value = true;
        }

        function hoverOff() {
            mainStyleObj.width= "300px";
            mainStyleObj.opacity = 0.45;
            mainStyleObj.height = "500px";
            mainStyleObj["border-radius"] = "40px"
            textStyleObj["padding-bottom"] = "10px";
            logoStyleObj["padding-bottom"] = "20px";
            loginButtStyleObj["margin-top"] = "20px";
            visible.value = false;
        } 


        async function signup() {
            const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (pwdStr.value != pwdConfStr.value) {
                errorMessage.value = "Passwords do not match";
                pwdConfStr.value = "";
                errorVisible.value = true;
            } else if(!emailStr.value.match(emailRegex)) {
                errorMessage.value ="Email is invalid";
                emailStr.value = "";      
                errorVisible.value = true;
            } else if(pwdStr.value.length < 8) {
                errorMessage.value ="Password is too short";
                pwdStr.value = "";
                pwdConfStr.value = "";        
                errorVisible.value = true;      
            } else {
                const createUser = functions.httpsCallable("createUser");

                const t = await createUser({username: uNameStr.value, email: emailStr.value, password: pwdStr.value});

                console.log(t.data);

                if (t.data.error) {
                    errorMessage.value = t.data.error;
                    errorVisible.value = true;
                    emailStr.value = "";
                    pwdStr.value = "";
                    uNameStr.value = "";
                    pwdConfStr.value = "";
                } else {
                    router.push( {name: 'Login', query: {signup: "true"}});
                }

            }
        }

        function navToLogin( ) {
            router.push('login');
        }

        return {uNameStr, pwdStr, emailStr, pwdConfStr, mainStyleObj, textStyleObj, logoStyleObj, loginButtStyleObj, hoverOn, hoverOff, signup, visible, navToLogin, errorMessage, errorVisible, isDisabled}
    }
}
</script>


<style scoped lang="scss">
label {
    background:rgba(0,0,0,0);
    color: #000000;
    align-items: flex-start;
}

InputText{
    flex-grow: 1;
    align-items: flex-start;
}

input {
    background: rgba(156,156,156,0.8);
}

.p-button-rounded {
    background-color: rgba(234,234,234,1);
}

* {
    background: rgba(256,256,256,0);
}

</style>