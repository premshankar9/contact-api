const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendStartServiceNotification = functions.database
    .ref("/users/{userId}/start_service")
    .onUpdate(async (change, context) => {
        const userId = context.params.userId;
        const newVal = change.after.val();

        if (newVal === true) {
            const userTokenSnap = await admin
                .database()
                .ref(`/users/${userId}/fcmToken`)
                .once("value");
            const fcmToken = userTokenSnap.val();

            const payload = {
                data: {
                    action: "START_SERVICE",
                },
                token: fcmToken,
            };

            await admin.messaging().send(payload);
            console.log("FCM sent to user:", userId);
        }

        return null;
    });