import { getCookie, removeCookie } from './cookies';

export const removeUser = () => {
  removeCookie('accessJwtToken');
  localStorage.clear();
};

export const getUser = () => {
  if (!localStorage.getItem('userInfo') || !getCookie('accessJwtToken')) {
    localStorage.setItem('isAuthenticated', 'false');
    removeUser();
    window.location.reload();
  } else {
    return JSON.parse(localStorage.getItem('userInfo')!);
  }
};
