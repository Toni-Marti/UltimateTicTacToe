class Credentials {
    constructor(username = 'guest', password = '') {
        this.username = username;
        this.password = password;
    }
}

const EVENTTYPE = Object.freeze({
    NONE: 0,
    ACTION: 1,
    CHAT: 2,
});

class SocketEvent {
    constructor(credentials = new Credentials(), eventType = EVENTTYPE.NONE, event = '') {
        this.credentials = credentials;
        this.eventType = eventType;
        this.event = event;
    }
}

//export {Credentials, EVENTTYPE, SocketEvent};
module.exports = { Credentials, EVENTTYPE, SocketEvent };