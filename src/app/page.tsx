import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Home() {
  return <div>
    <SignedOut>
      <SignUpButton mode ="modal">Sign Up</SignUpButton>
    </SignedOut>
    <SignedIn>
      <SignOutButton>Log Out</SignOutButton>
       
      
    </SignedIn>

    
  </div>
 
}
