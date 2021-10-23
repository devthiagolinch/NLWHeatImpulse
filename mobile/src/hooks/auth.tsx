import React, { createContext, useContext, useState, useEffect } from 'react';
import * as AuthSessions from 'expo-auth-session';
import { api } from '../services/api';
import AsyncStorage from  '@react-native-async-storage/async-storage'

type User = {
  id: string;
  avatar_url: string;
  name: string;
  login: string;
}

type AuthContextData = {
  user: User | null;
  isSignedIn: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

type AuthProvider = {
  children: React.ReactNode
}

type AuthResponseProps = {
  token: string;
  user: User;
}

type AuthorizationResponse = {
  params: {
    code?: string;
    error?: string;
  },
  type?: string;
}

export const AuthContex = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProvider) {
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  
  const CLIENT_ID = 'de2e31a183fee4e1cf23';
  const SCOPE = '557dc8079e651c3fde493a4b3d8aad5d8de7d291';
  const USER_STORAGE = '@mobile:user';
  const TOKEN_STORAGE = '@mobile:token';



  async function signIn() {
    try {
      setIsSignedIn(true);
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`
      const authSessiosResponse = await AuthSessions.startAsync({authUrl}) as AuthorizationResponse
      
      if(authSessiosResponse.type === 'success' && authSessiosResponse.params.error !== 'access_denied') {
        const authResponse = await api.post('authenticate', {code: authSessiosResponse.params.code});
        const { user, token } = authResponse.data as AuthResponseProps;
        
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
        await  AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
        await  AsyncStorage.setItem(TOKEN_STORAGE, token);
  
        setUser(user)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSignedIn(false);
    }
  }

  async function signOut() {
    setUser(null);
    await AsyncStorage.removeItem(USER_STORAGE);
    await AsyncStorage.removeItem(TOKEN_STORAGE);
  }

  useEffect(() => {
    async function loadUserStorageData() {
      const userStorage = await AsyncStorage.getItem(USER_STORAGE);
      const tokenStorage = await AsyncStorage.getItem(TOKEN_STORAGE);

      if( userStorage && tokenStorage ) {
        api.defaults.headers.common['Authorization'] = `Bearer ${tokenStorage}`;
        setUser(JSON.parse(userStorage));
      }
      setIsSignedIn(false)
    }

    loadUserStorageData()
  },[])

  return (
    <AuthContex.Provider value={{
      user,
      isSignedIn,
      signIn,
      signOut,
    }} >
      { children }
    </AuthContex.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContex)

  return context
}

export { AuthProvider, useAuth }

