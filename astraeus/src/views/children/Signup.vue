<template>
    <body> 
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
                    <InputText id="username" type="text" v-model="uNameStr" :class="{ 'p-invalid' : false} "/>
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
                <!-- THIS ONLY WORKS BECAUSE I CHANGE PASSWORD.VUE
                and the css because its fucking shit !-->
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

             <Button v-if="visible" @click="signup" id="signup" :style="loginButtStyleObj" class="p-button-success p-button-rounded p-button-raised p-button-lg">
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
import { db, auth } from '../../firebase'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
    components : {
        InputText,
        Button,
        Password
    },
    setup() {
        const uNameStr     = ref("");
        const pwdStr       = ref("");
        const pwdConfStr   = ref("");
        const emailStr     = ref("");
        const visible      = ref(false);
        const router       = useRouter();
        const store        = useStore();

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
            store.dispatch("setSignup", true);

            if (pwdStr.value != pwdConfStr.value) {
                alert("Passwords do not match")
                pwdConfStr.value = "";
            } else {
                const user = await auth.createUserWithEmailAndPassword(emailStr.value, pwdStr.value).catch( error => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    switch (errorCode) {
                        case 'auth/email-already-in-use':
                            alert(errorMessage);
                            break;
                        default:
                             alert(errorCode.message);
                        }
                    emailStr.value = "";
                    pwdStr.value = "";
                    pwdConfStr.value = "";
                })
                auth.signOut();

                if (user) {
                    db.ref("users").child(user.user!.uid).set( {
                        name: uNameStr.value + "#0000",
                        email: emailStr.value
                    })

                    db.ref("online").child(user.user!.uid).set(1);

                    await user.user!.sendEmailVerification();

                    router.push( {name: 'Login', query: {signup: "true"}});
                }

                store.dispatch("setSignup", false);
            }
        }


        function navToLogin( ) {
            router.push('login');
        }

        return {uNameStr, pwdStr, emailStr, pwdConfStr, mainStyleObj, textStyleObj, logoStyleObj, loginButtStyleObj, hoverOn, hoverOff, signup, visible, navToLogin}
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