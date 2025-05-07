import React, { useEffect, useState, useRef } from "react"
import logo from "./assets/dfinity.svg"
import {IcpSocial} from './components/Social'

// IC modules
import { AuthClient } from '@dfinity/auth-client';
import { createActor, canisterId } from '../src/declarations/crud';
import { HttpAgent } from '@dfinity/agent'; 

// local and production
const environment = process.env.DFX_NETWORK === 'local'
const localHost = "http://localhost:8000"
const productionHost = "https://ic0.app";

import "@connect2ic/core/style.css"

function App() {
  const [auth, setAuth] = useState(false)
  const [actorCrud, setActorCrud] = useState(null)
  const [actorSocial, setActorSocial] = useState(null)
  const idRef = useRef(null)

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
    const actorCrud = createActor(canisterId, { /// CRUD 
      agent
    })
    const actorSocial = createActor(process.env.CANISTER_ID_SOCIAL, {
      agent
    })
    
    
    setAuth(true)
    setActorSocial(() => actorSocial)
    setActorCrud(() => actorCrud)
  }

  async function handleLogout(){
    const authClient = await AuthClient.create()
    await authClient.logout()
    console.log("Logged out")
    const identity = authClient.getIdentity()
    idRef.current = identity
    setAuth(false)
  }

  // async function print() {
  //   console.log(actorCrud)
  //   console.log(actorSocial)

  //   console.log(id.getPrincipal().toString())
    

  // }

  useEffect(() => {
    const initAuth = async () => {

      const authClient = await AuthClient.create()
      const identity = authClient.getIdentity()
      idRef.current = identity

      if (await authClient.isAuthenticated()) {
        await handleAuthenticated(authClient)
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
          {/* <button onClick={print}> Click</button> */}
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
      actorCrud = { actorCrud }
      actorSocial = { actorSocial } /> 
    </div>
    )
}



export default App


