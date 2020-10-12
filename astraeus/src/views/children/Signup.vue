<template>
    <body> 
        <form id="main-login" :style="mainStyleObj" @mouseover="hoverOn" @mouseout="hoverOff">
            <div id="logo" :style="logoStyleObj"> <img src='@/assets/m1k.png'/> </div>

            <div id="text-box" :style="textStyleObj">
                <span class="p-float-label">
                    <InputText id="email" type="text" v-model="emailStr" :class="{ 'p-invalid' : $v.emailStr.$error}" />
                    <label v-if="visible"  for="email">Email</label>
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

            <div id="text-box" :style="textStyleObj">
                <span class="p-float-label ">
                    <InputText id="username" type="text" v-model="uNameStr" :class="{ 'p-invalid' : $v.uNameStr.$error} "/>
                    <label v-if="visible" for="username">Username</label>
                    <div v-if="$v.uNameStr.$error">
                        <div v-for="(error, index) of $v.$errors"
                            :key="index"> 
                            <small v-if="error.$property == 'uNameStr'" class="p-invalid" >
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

            <div class="text-box" :style="textStyleObj">
                <span class="p-float-label ">
                    <InputText id="confirm-password" type="password" v-model="pwdConfStr" :class="{ 'p-invalid' : $v.pwdConfStr.$error} "/>
                    <label v-if="visible" for="confirm-password">Confirm Password</label>
                    <div v-if="$v.pwdConfStr.$error">
                        <div v-for="(error, index) of $v.$errors"
                            :key="index"> 
                            <small v-if="error.$property == 'pwdConfStr'" class="p-invalid" >
                                {{error.$message}} 
                            </small>
                            </div>
                    </div>
                </span>
            </div>

             <Button @click="signup" id="signup" :style="loginButtStyleObj" class="p-button-success p-button-rounded p-button-raised p-button-lg">
                 <p >Signup</p>
             </Button>
        </form>
    </body>
</template>

<script lang="ts">
import Vue, { computed, reactive, ref } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button';
import { db, auth } from '../../firebase'
import useVuelidate from "@vuelidate/core";
import { useRouter } from 'vue-router'
import { required, email, minLength, maxLength } from "@vuelidate/validators";

export default {
    components : {
        InputText,
        Button
    },
    validations() {
        return {
            emailStr : {required, email, $autoDirty: true},
            uNameStr: { required, $autoDirty: true, maxLrngth: maxLength(16) },
            pwdStr: { required, $autoDirty: true, minLength: minLength(8) },
            pwdConfStr: { required, $autoDirty: true, minLength: minLength(8) }
        }
    },
    setup() {
        const uNameStr     = ref("");
        const pwdStr       = ref("");
        const pwdConfStr   = ref("");
        const emailStr     = ref("");
        const visible      = ref(false);
        const router       = useRouter();

        const mainStyleObj = reactive( {
            opacity: 0.45,
            transition: "0.2s",
            "border-radius": "40px",
            background: "#eaeaea",
            display: "flex",
            "flex-direction": "column",
            padding: "50px",
            width: "300px",
            height: "550px",
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
            mainStyleObj.height = "700px";
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
            mainStyleObj.height = "550px";
            mainStyleObj["border-radius"] = "40px"
            textStyleObj["padding-bottom"] = "10px";
            logoStyleObj["padding-bottom"] = "20px";
            loginButtStyleObj["margin-top"] = "20px";
            visible.value = false;
        } 

        async function signup() {
            if (pwdStr.value != pwdConfStr.value) {
                alert("Passwords do not match")
                pwdConfStr.value = "";
            } else {

                auth.createUserWithEmailAndPassword(emailStr.value, pwdStr.value).then( user => {
                    db.ref("users").child(user.user!.uid).set( {
                        name: uNameStr.value + "#0000",
                        email: emailStr.value
                    })

                    user.user!.sendEmailVerification();
                });

                router.push('activity');
            }
        };

        return {uNameStr, pwdStr, emailStr, pwdConfStr, mainStyleObj, textStyleObj, logoStyleObj, loginButtStyleObj, hoverOn, hoverOff, signup, visible}
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
    background: rgba(234,234,234,0);
}

</style>