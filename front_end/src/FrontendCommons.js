let username = localStorage.getItem('username') || 'guest';
let password = localStorage.getItem('password') || '';

let listeners = [];

export const getUsername = () => username;

export const setUsername = (newValue) => {
  username = newValue;
  localStorage.setItem('username', newValue);
  listeners.forEach((listener) => listener(newValue));
};

export const subscribe = (listener) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};

export const getPassword = () => password;

export const setPassword = (newValue) => {
  password = newValue;
  localStorage.setItem('password', newValue);
};
