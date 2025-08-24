import { useContext } from 'react';
import { UsuarioContext } from '../context/UsuarioContext';

export const useAuth = () => {
    const { isAuthenticated,login, logout } = useContext(UsuarioContext);
    return { isAuthenticated,login, logout };
  };
