<template>
    <body> 
        <Dialog header="Signup Successful!" v-model:visible="isParamAfterSignup">
            Please confirm your account in the email sent to you.
        </Dialog>
        <form id="main-login" :style="mainStyleObj" @mouseover="hoverOn" @mouseout="hoverOff">
            <div id="logo" :style="logoStyleObj"> <img src='@/assets/m1k.png'/> </div>

            <div id="text-box" :style="textStyleObj">
                <span class="p-float-label ">
                    <InputText id="email" type="text" v-model="emailStr" :class="{ 'p-invalid' : $v.emailStr.$error} "/>
                    <label v-if="visible" for="email">Email</label>
                    <div v-if="$v.emailStr.$error">
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
                <span class="p-float-label ">
                    <InputText id="password" type="password" v-model="pwdStr" :class="{ 'p-invalid' : $v.pwdStr.$error} "/>
                    <label v-if="visible" for="password">Password</label>
                    <div v-if="$v.pwdStr.$error">
                        <div v-for="(error, index) of $v.$errors"
                            :key="index"> 
                            <small v-if="error.$property == 'pwdStr'" class="p-invalid" >
                                {{error.$message}} 
                            </small>
                            </div>
                    </div>                    
                </span>
            </div>
             <Button @click="login" id="login" :style="loginButtStyleObj" class="p-button-success p-button-rounded p-button-raised p-button-lg">
                 <p >Login</p>
                 <i class="pi pi-check"/>
             </Button>
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
import useVuelidate from "@vuelidate/core";
import { required, email, minLength, maxLength } from "@vuelidate/validators";
import { db, auth } from '../../firebase'

export default {
    components : {
        InputText,
        Button,
        Dialog
    },
    validations() {
        return {
            emailStr : {required, email, $autoDirty: true},
            pwdStr: { required, $autoDirty: true, minLength: minLength(8) }
        }
    },
    setup() {
        const emailStr = ref("");
        const pwdStr   = ref("");
        const visible  = ref(false);

        const route = useRoute();
        const router = useRouter()
        const store = useStore();

        const mainStyleObj = reactive( {
            opacity: 0.45,
            transition: "0.2s",
            "border-radius": "40px",
            background: "#eaeaea",
            display: "flex",
            "flex-direction": "column",
            padding: "50px",
            width: "300px",
            height: "350px",
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
            "padding-bottom" : "20px",
            transition: "0.2s"
        })

        const loginButtStyleObj = reactive({
            "margin-top" : "30px",
            transition: "0.2s"
        })

        const isParamAfterSignup = ref(route.query.signup)

        function hoverOn() {
            mainStyleObj.width= "400px";
            mainStyleObj.height = "550px";
            mainStyleObj.opacity = 0.75;
            mainStyleObj["border-radius"] = "35px"
            textStyleObj["padding-bottom"] = "30px";
            logoStyleObj["padding-bottom"] = "50px";
            loginButtStyleObj["margin-top"] = "60px";
            visible.value = true;

        }
        function hoverOff() {
            mainStyleObj.width= "300px";
            mainStyleObj.opacity = 0.45;
            mainStyleObj.height = "350px";
            mainStyleObj["border-radius"] = "40px"
            textStyleObj["padding-bottom"] = "20px";
            logoStyleObj["padding-bottom"] = "20px";
            loginButtStyleObj["margin-top"] = "30px";
            visible.value = false;
        }

        async function login() {
            await auth.signInWithEmailAndPassword(emailStr.value, pwdStr.value).catch(function (error) {
                const errorCode = error.code;
                const errorMessage = error.message;
                switch (errorCode) {
                    case 'auth/wrong-password':
                        alert('Wrong password.');
                        pwdStr.value = "";
                        break;
                    case 'auth/user-not-found':
                        alert('The user does not exist!')
                        emailStr.value = "";
                        pwdStr.value = "";
                        break;
                    default:
                         alert(errorMessage);
                         emailStr.value = "";
                         pwdStr.value = "";
                    }
            });

            router.push('activity')
            ///which should trigger the auth listener defined elsewhere...
        }

        return {emailStr, pwdStr, mainStyleObj, textStyleObj, logoStyleObj, loginButtStyleObj, hoverOn, hoverOff, login, isParamAfterSignup, visible }
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
}

.p-button-rounded {
    background-color: rgba(234,234,234,1);
}

* {
    background: rgba(234,234,234,0);
}
</style>