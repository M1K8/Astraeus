import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
import * as nodemailer from 'nodemailer'
import { smtpConfig } from './mailOpts'

const mailer = nodemailer.createTransport(smtpConfig);

admin.initializeApp();

/*private*/ function generateRandomUserNumber() {
    const add = 1;
    let max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   

    max          = Math.pow(10, 4 + add);
    const min    = max/10; // Math.pow(10, n) basically
    const number = Math.floor( Math.random() * (max - min + 1) ) + min;

    return ("" + number).substring(add);
}

export const addFriend = functions.region("europe-west2").https.onCall(async (data, ctx) => {
    if (ctx.auth!.uid !== data.senderUID) {
        return {error: "Auth mismatch"}
    } 

    const senderUID : string = ctx.auth!.uid;
    const senderName : string = data.senderName;
    const recipUID : string = data.recipUID;
    const recipName : string = data.recipName;
    const now = Date.now();
    const db = admin.database();

    
    const uidRef = await db.ref("requests").push({
        sender: senderUID,
        recipient: recipUID
    })

    await db.ref("users").child(senderUID).child("pendingFriendRequests").child(recipUID).set( {
        type : "OUTGOING",
        sender: senderUID,
        target: recipUID,
        sent: now,
        senderName: senderName,
        recipientName: recipName,
        uid : uidRef.key
    } );


    await db.ref("users").child(recipUID).child("pendingFriendRequests").child(senderUID).set( {
        type : "INCOMING",
        sender: senderUID,
        target: recipUID,
        sent: now,
        senderName: senderName,
        recipientName: recipName,
        uid : uidRef.key
    });

    return {success: true}
})

export const acceptFriend = functions.region("europe-west2").https.onCall(async (data, ctx) => {
    if (ctx.auth!.uid !== data.recipUID) {
        functions.logger.info(ctx.auth!.uid, data.senderUID)
        return {error: "Auth mismatch"}
    } 
    const senderUID : string = data.senderUID;
    const senderName : string = data.senderName;
    const recipUID : string = ctx.auth!.uid;
    const recipName : string = data.recipName;
    const key : string = data.key;
    const db = admin.database();
    functions.logger.info(ctx.auth!.uid, data.senderUID)

    await db.ref("users").child(senderUID).child("friends").child(recipUID).set(recipName);
    await db.ref("users").child(senderUID).child("pendingFriendRequests").child(recipUID).remove();

    await db.ref("users").child(recipUID).child("friends").child(senderUID).set(senderName);
    await db.ref("users").child(recipUID).child("pendingFriendRequests").child(senderUID).remove();

    await db.ref("requests").child(key).remove();
    return {success: true}

})

export const removeFriend = functions.region("europe-west2").https.onCall(async (data, ctx) => {
    if (ctx.auth!.uid !== data.senderUID) {
        return {error: "Auth mismatch"}
    } 
    const senderUID : string = ctx.auth!.uid;
    const recipUID : string = data.recipUID;
    const db = admin.database();


    await db.ref("users").child(senderUID).child("friends").child(recipUID).remove();

    await db.ref("users").child(recipUID).child("friends").child(senderUID).remove();
    return {success: true}
})

export const createUser = functions.region("europe-west2").https.onCall(async (data, _) => {
    const email : string = data.email;
    const password : string = data.password;
    const username : string = data.username;
    const db = admin.database();
    
    let name = username + "£" + generateRandomUserNumber();
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
        retData = { error : "Failed to create user: " + error};
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
            functions.logger.info(sentEmail);

            if (!sentEmail) {
                await admin.auth().deleteUser(userRecord.uid);
                return { error: `Unable to create account - could not send verification email`};
            }
        } else {
            await admin.auth().deleteUser(userRecord.uid);
            return { error: "Unable to create account - could not generate verification email"}
        }

        //see if username string is unique
        while (doesExist) {
            await db.ref("usernames").child(name).transaction( function(currentData) {
                if (currentData !== null) {
                    // username string (somehow) exists, reroll
                    name = username + "£" + generateRandomUserNumber();
                    return;
                } else {
                    doesExist = false;
                    return { username : name.replace('£', '#') , uid : userRecord.uid, online: 0}
                }
            });
        }

        await db.ref("users").child(userRecord.uid).transaction( function( x ) {
            return {
                username: name.replace('£', '#'),
                email: email,
                avatar: ""
            }
        })


        return { uid: userRecord.uid, message :"Successfully created new user: " + username };
    } else {
        return retData;
    }
})


export const sendInviteNoti = functions.region("europe-west2").database.ref('users/{userID}/pendingGameInvites/{inviteID}').onCreate( async (content: any, ctx) => {
    const db = admin.database();
    const userID = ctx.params.userID;

    const getDeviceTokensPromise = db.ref(`/users/${userID}/notificationTokens`).once('value');

    const results = await Promise.all([getDeviceTokensPromise]);
    const tokensSnapshot = results[0];
    const sender = {
        uid : content.senderID,
        name: content.senderName
    }

    const details = {
        game: content.info.gameName,
        location: content.info.location,
        serverURL: content.info.serverURL
    }

    // Check if there are any device tokens.
    if (!tokensSnapshot.hasChildren()) {
        return functions.logger.info('There are no notification tokens to send to.');
    }

    functions.logger.info('There are', tokensSnapshot.numChildren(), 'tokens to send notifications to.');

    // Notification details.
    const payload = {
    notification: {
        title: `${sender.name} invite you to play ${details.game}!`,
        body: `${sender.name} invite you to play ${details.game} on their ${details.location} server, ${details.serverURL}`
    }
    };

    // Listing all tokens as an array.
    const tokens = Object.keys(tokensSnapshot.val());
    // Send notifications to all tokens.
    const response = await admin.messaging().sendToDevice(tokens, payload);
    // For each message check if there was an error.
    const tokensToRemove : Promise<void>[] = [];
    response.results.forEach((result, index) => {
        const error = result.error;
        if (error) {
            functions.logger.error('Failure sending notification to', tokens[index], error);
            // Cleanup the tokens who are not registered anymore.
            if (error.code === 'messaging/invalid-registration-token' ||
                error.code === 'messaging/registration-token-not-registered') {
            tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
            }
        }
    });

    return Promise.all(tokensToRemove);
});