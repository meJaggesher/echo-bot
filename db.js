const sqlite3 = require('sqlite3').verbose();
const sqllight = require('./aa-sqllight');

const userTokenSql = `SELECT user as user, token as token from accessToken WHERE user  = ?`;

const GetUserAccessToken = async (userId) => {
    try {
        await sqllight.open('./echoBot.db');
        let result = await sqllight.get(userTokenSql, [userId]);
        sqllight.close();
        return result ? result.token : null;
    } catch (errr) {
        console.log(err);
        return null;
    }
}

const AddUserAccessToken = async (user, token) => {
    try {
        await sqllight.open('./echoBot.db');
        let r = await sqllight.run("INSERT INTO accessToken(user,token) VALUES('" + user + "','" + token + "')");
        if (r) return true;
        else return false;
    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = { GetUserAccessToken, AddUserAccessToken }
