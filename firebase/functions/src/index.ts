import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
import * as nodemailer from 'nodemailer'
import { smtpConfig } from './mailOpts'

const mailer = nodemailer.createTransport(smtpConfig);

admin.initializeApp();

/*private*/ function generateRandomUserNumber() {
    const add = 1;
    let max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   

    max        = Math.pow(10, 5+add);
    const min    = max/10; // Math.pow(10, n) basically
    const number = Math.floor( Math.random() * (max - min + 1) ) + min;

    return ("" + number).substring(add);
}

export const createUser = functions.https.onCall(async (data, _) => {
    const email : string = data.email;
    const password : string = data.password;
    const username : string = data.username;
    const db = admin.database();
    
    let name = username + "_" + generateRandomUserNumber();
    let doesExist = true; //seed for first run to check

    let retData : any = null;

    functions.logger.info(data);

    const userRecord = await admin.auth().createUser({
        email: email,
        emailVerified: false,
        password: password,
        displayName: name,
        disabled: false
    })
    .catch(function (error) {
        functions.logger.info(error);
        retData =  { error : "Failed to create user: " + error};
    });

    if (userRecord) {
        functions.logger.info(userRecord);

        const emailVerifyLink = await admin.auth().generateEmailVerificationLink(email);

        if (emailVerifyLink) {
            const mailOptions = {
                from: 'tMup Verify <verify@m1k.me>', // Something like: Jane Doe <janedoe@gmail.com>
                to: email,
                subject: 'Verify you tMup account!', // email subject
                html: `<a href=${emailVerifyLink} style="font-size: 16px;">Click here to verify</a>
                ` // email content in HTML
            };
            
            const sentEmail = await mailer.sendMail(mailOptions);

            if (!sentEmail) {
                await admin.auth().deleteUser(userRecord.uid);
                return { error: `Unable to create account - could not send verification email`};
            }
        } else {
            await admin.auth().deleteUser(userRecord.uid);
            return { error: "Unable to create account - could not generate verification email"}
        }

        await db.ref("users").child(userRecord.uid).transaction( function( x ) {
            return {
                name: name.replace('_', '#'),
                email: email
            }
        })


        //see if username string is unique
        while (doesExist) {
            await db.ref("usernames").child(name).transaction( function(currentData) {
                if (currentData !== null) {
                    // username string (somehow) exists, reroll
                    name = username + "_" + generateRandomUserNumber();
                    return;
                } else {
                    doesExist = false;
                    return { username : name.replace('_', '#') , uid : userRecord.uid}
                }
            });
        }

        await db.ref("online").child(userRecord.uid).set(0);

        return { uid: userRecord.uid, message :"Successfully created new user: " + username };
    } else {
        return retData;
    }
})
