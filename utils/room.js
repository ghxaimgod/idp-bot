function randomRoomId() {

    return Math.floor(
        1000000 + Math.random() * 9000000
    ).toString();

}

function randomPassword(length = 5) {

    const chars =
        "ABCDEFGHJKLMNPQRSTUVWXYZ123456789";

    let pass = "";

    for (let i = 0; i < length; i++) {

        pass += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );

    }

    return pass;

}

module.exports = {

    randomRoomId,
    randomPassword

};
