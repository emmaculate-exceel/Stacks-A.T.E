'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import * as fcl from "@onflow/fcl"
import { showConnect, AppConfig, UserSession, UserData } from '@stacks/connect'

interface FlowUser {
  loggedIn: boolean;
  addr?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: FlowUser;
  isLoading: boolean;
  error: string | null;
  stacksUser: UserData | null;
  connectWallet: (walletType: string) => Promise<void>;
  disconnectWallet: () => Promise<void>;
  connectStacksWallet: () => Promise<void>;
  disconnectStacksWallet: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  user: { loggedIn: false },
  isLoading: false,
  error: null,
  stacksUser: null,
  connectWallet: async () => {},
  disconnectWallet: async () => {},
  connectStacksWallet: async () => {}, 
  disconnectStacksWallet: async () => {}, 
})

// Initialize Stacks app config with version specification
const appConfig = new AppConfig(['store_write', 'publish_data'])
let userSession: UserSession;

// Create userSession safely with try/catch
try {
  userSession = new UserSession({ appConfig });
} catch (error) {
  console.error("Error initializing Stacks session:", error);
  // Clear any corrupted session data
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('blockstack-session');
  }
  userSession = new UserSession({ appConfig });
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<FlowUser>({ loggedIn: false })
  const [stacksUser, setStacksUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Subscribe to Flow user changes
    fcl.currentUser.subscribe(setUser)
    
    // Safely check if user is signed in with Stacks
    try {
      if (userSession && typeof userSession.isUserSignedIn === 'function' && userSession.isUserSignedIn()) {
        setStacksUser(userSession.loadUserData())
      }
    } catch (error) {
      console.error("Error checking Stacks login:", error);
      // Clear any corrupted session data
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('blockstack-session');
      }
    }
  }, [])

  const connectWallet = async (walletType: string): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)
      
      switch(walletType) {
        case 'flow':
          await fcl.authenticate()
          break
        case 'leather':
        case 'xverse':
          // Redirect to Stacks Connect
          await connectStacksWallet()
          break
        default:
          throw new Error('Unsupported wallet type')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = async (): Promise<void> => {
    try {
      // Check which wallet is connected and disconnect accordingly
      if (user.loggedIn) {
        await fcl.unauthenticate()
      }
      if (stacksUser) {
        await disconnectStacksWallet()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage)
    }
  }

  const connectStacksWallet = async (): Promise<void> => {
    setIsLoading(true)
    try {
      showConnect({
        appDetails: {
          name: 'African Trade Empire',
          icon: window.location.origin + '/appIcon.jpg',
        },
        redirectTo: '/',
        onFinish: (data) => {
          if (data && data.userSession) {
            setStacksUser(data.userSession.loadUserData())
          }
          setIsLoading(false)
        },
        onCancel: () => {
          setIsLoading(false)
        },
        userSession: userSession,
      })
    } catch (err) {
      console.error("Error connecting Stacks wallet:", err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  const disconnectStacksWallet = async (): Promise<void> => {
    try {
      if (userSession && typeof userSession.isUserSignedIn === 'function' && userSession.isUserSignedIn()) {
        userSession.signUserOut()
        setStacksUser(null)
      }
    } catch (error) {
      console.error("Error signing out Stacks user:", error);
      // Force clear session data in case of errors
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('blockstack-session');
      }
      setStacksUser(null);
    }
  }

  return (
    <AuthContext.Provider 
      value={{
        user,
        stacksUser,
        isLoading,
        error,
        connectWallet,
        disconnectWallet,
        connectStacksWallet,
        disconnectStacksWallet,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
