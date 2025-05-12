import React, { useEffect, useState, useRef, useCallback } from "react"
import logo from "./assets/dfinity.svg"
import {IcpSocial} from './components/Social'

// IC modules
import { AuthClient } from '@dfinity/auth-client';
import { createActor, canisterId} from '../src/declarations/social';
import { HttpAgent } from '@dfinity/agent'; 

// local and production
const environment = process.env.DFX_NETWORK === 'local'
const localHost = "http://localhost:8000"
const productionHost = "https://ic0.app";

import "@connect2ic/core/style.css"

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0); 
  const [auth, setAuth] = useState(false)
  const [actorSocial, setActorSocial] = useState(null)
  const actorRef = useRef(null)
  const idRef = useRef(null)

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1); 
  }, []);

  async function handleLogin() {
    const authClient = await AuthClient.create()
    await authClient.login({
      maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // Establece una cantidad en dias (en este caso 7) en las que la autenticacion sera valida
      identityProvider: environment? `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:8000/` : "https://identity.ic0.app", 
      onSuccess: async () => {
        await handleAuthenticated(authClient)
        console.log('Logged')
      }
      
    })
  }

  

  async function handleAuthenticated(authClient) {
  
    const identity = authClient.getIdentity()
    idRef.current = identity

    const agent = new HttpAgent ({
      identity, 
      host: environment? localHost : productionHost,
    })

    actorRef.current = createActor(canisterId, {
      agent
    })

    setActorSocial(() => actorRef.current)
    setAuth(true)

  }

  async function handleLogout(){
    const authClient = await AuthClient.create()
    await authClient.logout()
    console.log("Logged out")
    const identity = authClient.getIdentity()
    idRef.current = identity
    setAuth(false)
    window.location.reload()
  }


  useEffect(() => {
    const initAuth = async () => {
      const authClient = await AuthClient.create();
      const identity = authClient.getIdentity();
      idRef.current = identity;

      if (await authClient.isAuthenticated()) {
        await handleAuthenticated(authClient);
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

      <IcpSocial 
      principal = { idRef.current?.getPrincipal()?.toString() || ""} 
      actorSocial = { actorRef.current } 
      onRefresh = {triggerRefresh} 
      refreshTrigger = {refreshTrigger} /> 
    </div>
    )
}



export default App


