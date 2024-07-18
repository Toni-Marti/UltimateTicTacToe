let username = 'guest';
let listeners = [];

export const getUsername = () => username;

export const setUsername = (newValue) => {
  username = newValue;
  listeners.forEach((listener) => listener(newValue));
};

export const subscribe = (listener) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};

let password = '';
export const getPassword = () => password;

export const setPassword = (newValue) => {
  password = newValue;
};