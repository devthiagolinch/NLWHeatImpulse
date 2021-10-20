import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
  id: string,
  name: string,
  avatar_url: string,
  login: string
}

type AuthContextData = {
  user: User | null,
  signinGitHub: string,
  signOut: () => void
}

export const AuthContext = createContext({} as AuthContextData);

type AuthProvider = {
  children: ReactNode;
}

type AuthResponse = {
  token: string;
  user: {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
  }
}

export function AuthProvider(props: AuthProvider) {
  const [user, setUser] = useState<User | null>(null);

  const signinGitHub = `https://github.com/login/oauth/authorize?scope=user&client_id=5e8635e1272d3df51ccc`;
  
  async function signIn(gitHubCode: string) {
    const response = await api.post<AuthResponse>('authenticate', {
      code: gitHubCode,
    })

    const { token, user } = response.data

    localStorage.setItem("@dowhile:token", token)

    api.defaults.headers.common.authorization = `Bearer ${token}`;

    setUser(user)
  }

  function signOut() {
    setUser(null)
    localStorage.removeItem('@dowhile:token')
  }

  useEffect(() => {
    const token = localStorage.getItem("@dowhile:token")

    if(token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`;

      api.get<User>('profile').then(response => {
        setUser(response.data);
      })
    }
  },[])

  useEffect(() => {
    // Pegando da url o codigo de login do usuario do github e colocando dentro da const de hasGitHubCode
    const url = window.location.href;
    const hasGitHubCode = url.includes('?code=')

    if(hasGitHubCode) {
      // separei a url em antes do code= e dps do code= assim eu posso pegar somente o code do github
      const [ urlWithOutCode, gitHubCode ] = url.split('?code=');

      // escondendo o codigo do github, seguranca
      window.history.pushState({}, '', urlWithOutCode);

      signIn(gitHubCode)
    }
  },[])

  return (
    <AuthContext.Provider value={{ signinGitHub, user, signOut }}>
      {props.children}
    </AuthContext.Provider>
  )
}