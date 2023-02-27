import { getCookie, removeCookie } from '../cookies';

export const getUser = () => {
  const userInfo =
    localStorage.getItem('userInfo') && getCookie('accessJwtToken')
      ? JSON.parse(localStorage.getItem('userInfo')!)
      : null;
  return userInfo;
};

export const removeUser = () => {
  removeCookie('accessJwtToken');
  localStorage.clear();
};
