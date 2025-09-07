import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth-options';

const { 
  handlers: { GET, POST },
  auth,
  signIn,
  signOut 
} = NextAuth(authConfig);

export { GET, POST, auth, signIn, signOut };
