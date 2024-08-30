'use server'
 
import { redirect } from 'next/navigation'
 
export async function serverRedirect(url:string) {
  redirect(url);
}