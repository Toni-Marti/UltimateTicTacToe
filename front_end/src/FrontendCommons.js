let server = 'localhost';
export const getServer = () => server;

let username = 'guest';
export const getUsername = () => username;
export const setUsername = (newValue) => {username = newValue;}

let password = '';
export const getPassword = () => password;
export const setPassword = (newValue) => {password = newValue;}