
const { WebClient } = require('@slack/web-api');
// Read a token from the environment variables
const gToken = "xoxb-1054275065493-1072635519008-cYfA4qQol26dS6Jjn13O6aBJ";
const clientId = "1054275065493.1070794908512";
const clientSecret = "";
const redirect_uri = "https%3A%2F%2Fa1577503.ngrok.io%2F";
const userAccessUrl = "https://slack.com/oauth/authorize?client_id=" + clientId + "&scope=users.profile%3Awrite&redirect_uri=" + redirect_uri;


// Initialize
const web = new WebClient(gToken);
const db = require('./db');

const handleRequst = async (data) => {
    //console.log(data);
    try {
        let status = null;
        let msg = "Sorry, Try..\n*in*\n*out*\n*brb*\n*meeting*\n*lunch*";

        let userText = data.event.text.trim();
        userText = userText.toLowerCase();

        if (userText === "in") {
            msg = "You punched *in*";
            status = "in";
        } else if (userText === "out") {
            msg = "You punched *Out*";
            status = "out";
        } else if (userText === "brb") {
            msg = "Enjoy your *brake*";
            status = "brake";
        } else if (userText === "meeting") {
            msg = "Ok status setting for *Meeting*";
            status = "meeting";
        } else if (userText === "lunch") {
            msg = "Enjoy your *lunch*";
            status = "lunch";
        }
        let message = {
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": msg
                    }
                }
            ]
        };
        sendMessageToUser(data.event.user, message);
        if (status !== null)
            setStatus(data.event.user, status);
    } catch (err) {
        console.log(err);
    }
}

const sendMessageToUser = async (channel, message) => {
    try {
        let result = await web.chat.postMessage({
            ...message,
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
            const web2 = new WebClient(token);
            let result = await web2.users.profile.set({
                "profile": {
                    "status_text": statusText,
                    "status_emoji": statusImo,
                    "status_expiration": 0
                }
            });
            if (result) console.log('status changes');
            //console.log(result);

        } else {
            //Send User a message for
            let message = {
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "<" + userAccessUrl + "| Give me access so that I can change your status for you>"
                        }
                    }
                ]
            };
            sendMessageToUser(user, message);
        }

    } catch (err) {
        console.log(err);
    }
}

module.exports = { handleRequst }