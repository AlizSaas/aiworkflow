 import 'server-only'
import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "./auth";
import { redirect } from 'next/navigation';

export const requireAuth = cache(async () => {
  console.log("requireAuth");
  const session =  await auth.api.getSession({ headers: await headers() });
  if(!session) {
    redirect('/login')
  }
  return session
}); // memoize for the duration of the request
export const requireUnauth = cache(async () => {
  console.log("requireUnauth");
  const session =  await auth.api.getSession({ headers: await headers() });
  if(session) {
    redirect('/')
  }
  
}); // memoize for the duration of the request