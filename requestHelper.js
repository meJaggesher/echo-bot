
const { WebClient } = require('@slack/web-api');
// Read a token from the environment variables
const gToken = "xoxb-1054275065493-1072635519008-cYfA4qQol26dS6Jjn13O6aBJ";
// Initialize
const web = new WebClient(gToken);
const db = require('./db');

const handleRequst = async (data) => {
    //console.log(data);
    try {
        sendMessageToUser(data.event.user, data.event.text);
        setStatus("U011MEHARFX", data.event.text);
    } catch (err) {
        console.log(err);
    }
}


const sendMessageToUser = async (channel, message) => {
    try {
        let result = await web.chat.postMessage({
            text: message,
            channel: channel
        });
        console.log("Message send");
        //console.log(result);
    } catch (error) {
        console.log(error);
    }
}

const setStatus = async (user, type) => {
    let statusText = type;
    let statusImo = ":white_check_mark:";

    if (type === "brake") {
        statusText = "Brake";
        statusImo = ":negative_squared_cross_mark:";
    } else if (type === "meeting") {
        statusText = "Meeting";
        statusImo = ":calendar:";
    } else if (type === "out") {
        statusText = "Out";
        statusImo = ":x:";
    } else if (type === "lunch") {
        statusText = "On Lunch";
        statusImo = ":hamburger:";
    }

    try {
        let token = await db.GetUserAccessToken(user);
        if (token !== null) {
            console.log(token);
            const web2 = new WebClient(token);
            let result = await web2.users.profile.set({
                "profile": {
                    "status_text": statusText,
                    "status_emoji": statusImo,
                    "status_expiration": 0
                }
            });
            if(result) console.log('status changes');
            //console.log(result);

        } else {
            //Send User a message for 
        }

    } catch (err) {
        console.log(err);
    }
}

module.exports = { handleRequst }