// AuthMiddleware.js
export const authMiddleware = () => {
  const accessToken = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user'));
  
  return accessToken && user;
};
