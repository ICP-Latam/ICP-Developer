import React, { useEffect, useState } from "react"
import logo from "./assets/dfinity.svg"

// IC modules
import { AuthClient } from '@dfinity/auth-client';
import {IcpSocial} from './components/Social'

// local and production
const environment = true
const localHost = "http://localhost:4943"
const productionHost = "https://ic0.app";

import "@connect2ic/core/style.css"

function App() {
const [auth, setAuth] = useState(false)

async function handleLogin() {
  console.log(auth)
  const authClient = await AuthClient.create()
  await authClient.login({      
  maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // Establece una cantidad en dias (en este caso 7) en las que la autenticacion sera valida
  identityProvider: environment? `http://be2us-64aaa-aaaaa-qaabq-cai.localhost:8000/` : "https://identity.ic0.app", 
  onSuccess: async () => {
    window.location.reload()
  }
  
  
})
setAuth(true)
}

async function handleLogout(){
  const authClient = await AuthClient.create()
  console.log("Loggin out")
  await authClient.logout()
  console.log("Logged out")
  setAuth(false)
}


useEffect(() => {
  const initAuth = async () => {
    const client = await AuthClient.create();
    
    if (await client.isAuthenticated()) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  };
  
  initAuth();
}, []);


  return (
  <div className="min-h-screen">
    <header className="relative flex justify-start items-center p-4 border-b border-gray-600">
      <img src={logo} width="80" alt="logo" />
      <div className="absolute top-2 right-2">
        <button
          onClick={auth ? handleLogout : handleLogin}
          className={`
            px-6 py-3 rounded-md
            font-medium
            ${auth ? 'bg-black text-white border ' : 'bg-black text-white border'}
          `}
        >
          {auth ? "Logout" : "Login"}
        </button>
      </div>
    </header>
    
    <IcpSocial />
  </div>
  )
}



export default App

