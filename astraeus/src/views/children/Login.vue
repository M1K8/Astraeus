<template>
    <body> 
        <Dialog header="" v-model:visible="isDiaVisible" modal=true>
            {{diaMessage}}
        </Dialog>
        <form @mouseover="hoverOn" @mouseleave="hoverOff" id="main-login" :style="mainStyleObj">
            <div id="logo" :style="logoStyleObj"> <img src='@/assets/m1k.png'/> </div>

            <div id="text-box" :style="textStyleObj">
                <span class="p-float-label">
                    <InputText id="email" type="text" v-model="emailStr" :class="{ 'p-invalid' : false} "/>
                    <label v-if="visible" for="email">Email</label>
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
  
            <div class="text-box" :style="textStyleObj">
                <span class="p-float-label">
                    <InputText id="password" type="password" v-model="pwdStr" :class="{ 'p-invalid' : false} "/>
                    <label v-if="visible" for="password">Password</label>
                    <div v-if="false">
                        <div v-for="(error, index) of $v.$errors"
                            :key="index"> 
                            <small v-if="error.$property == 'pwdStr'" class="p-invalid" >
                                {{error.$message}} 
                            </small>
                            </div>
                    </div>                    
                </span>
            </div>
             <Button v-if="visible" @click="login" id="login" :style="loginButtStyleObj" class="p-button-success p-button-rounded p-button-raised p-button-lg">
                 <p>Login</p>
                 <i class="pi pi-check"/>
             </Button>

             <Button label="Link" class="p-button-link" v-if="visible" id="signup-link" @click="navToSignup"> Don't have an account? Click here to Signup </Button>

        </form>
    </body>
</template>

<script lang="ts">
import Vue, { computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { db, auth } from '../../firebase'

export default {
    components : {
        InputText,
        Button,
        Dialog
    },
    setup() {
        const emailStr = ref("");
        const pwdStr   = ref("");
        const visible  = ref(true);
        const diaMessage = ref("");

        const route = useRoute();
        const router = useRouter()
        const store = useStore();

        const mainStyleObj = reactive( {
            opacity: 0.75,
            transition: "0.2s",
            "border-radius": "35px",
            background: "#eaeaea",
            display: "flex",
            "flex-direction": "column",
            padding: "50px",
            width: "400px",
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
            "padding-bottom": "30px",
            background: "inherit",
            transition: "0.2s"
        })

        const logoStyleObj = reactive({
            "padding-bottom" : "60px",
            transition: "0.2s"
        })

        const loginButtStyleObj = reactive({
            "margin-top" : "30px",
            "margin-bottom": "20px",
            transition: "0.2s"
        })

        const isDiaVisible = ref(false);

        if (route.query.signup === 'true') {
            diaMessage.value = "Please confirm your account via the verification email.";
            isDiaVisible.value = true;
        }

        
        function hoverOn() {
            mainStyleObj.width= "400px";
            mainStyleObj.height = "550px";
            mainStyleObj.opacity = 0.75;
            mainStyleObj["border-radius"] = "35px"
            textStyleObj["padding-bottom"] = "30px";
            logoStyleObj["padding-bottom"] = "60px";
            visible.value = true;
        }
        function hoverOff() {
            mainStyleObj.width= "300px";
            mainStyleObj.opacity = 0.45;
            mainStyleObj.height = "300px";
            mainStyleObj["border-radius"] = "40px"
            textStyleObj["padding-bottom"] = "20px";
            logoStyleObj["padding-bottom"] = "20px";
            visible.value = false;
        }

        async function login() {
            await auth.signInWithEmailAndPassword(emailStr.value, pwdStr.value).catch(function (error) {
                const errorCode = error.code;
                const errorMessage = error.message;
                switch (errorCode) {
                    case 'auth/wrong-password':
                        diaMessage.value ='Wrong password.';
                        pwdStr.value = "";
                        isDiaVisible.value = true;
                        break;
                    case 'auth/user-not-found':
                        diaMessage.value = 'The user does not exist!';
                        emailStr.value = "";
                        pwdStr.value = "";
                        isDiaVisible.value = true;
                        break;
                    default:
                         diaMessage.value = errorMessage;
                         emailStr.value = "";
                         pwdStr.value = "";
                         isDiaVisible.value = true;
                    }
            });

            router.push('activity')
            ///which should trigger the auth listener defined elsewhere...
        }

        function navToSignup() {
            router.push('signup');
        }

        return {emailStr, pwdStr, mainStyleObj, textStyleObj, logoStyleObj, loginButtStyleObj, hoverOn, hoverOff, login, isDiaVisible, visible, navToSignup, diaMessage }
    }
}
</script>

<style scoped lang="scss">
html, body {
	width: 100vw;
	height: 100vh;
    margin: 0;
    padding: 0;
}

body{
    background: linear-gradient(126deg, #4d5bb6, #1a336f, #0f8360, #7aae14);
    background-size: 600% 600%;

    -webkit-animation: Gradient 30s ease infinite;
    -moz-animation: Gradient 30s ease infinite;
    animation: Gradient 30s ease infinite;
}

@-webkit-keyframes Gradient {
    0%{background-position:0% 50%}
    50%{background-position:100% 50%}
    100%{background-position:0% 50%}
}
@-moz-keyframes Gradient {
    0%{background-position:0% 50%}
    50%{background-position:100% 50%}
    100%{background-position:0% 50%}
}
@keyframes Gradient {
    0%{background-position:0% 50%}
    50%{background-position:100% 50%}
    100%{background-position:0% 50%}
}

label {
    background:rgba(0,0,0,0);
    color: #000000;
    align-items: flex-start;
    padding-top: 2px;
}

InputText{
    flex-grow: 1;
    align-items: flex-start;
}

input {
    background: rgba(156,156,156,0.8);
}

p {
    padding-right: 12px;
    padding-left: 10px;
}

i {
    margin-right: -7px;
    padding-right: 13px;
}

Button > i {
    padding-top: 5px;
    transition: 0.25s;
}

Button {
    transition: 0.25s;
}

.p-button-rounded {
    background-color: rgba(234,234,234,1);
}

#signup-link {
    color: black;
    font-size: 0.6em;
}

* {
    background: rgba(234,234,234,0);
}
</style>