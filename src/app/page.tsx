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
import Header from "@/components/ui/landing/Header";
import Footer from "@/components/ui/landing/Footer";
import HowItWorks from "@/components/ui/landing/HowItWorks";
import WhatToAsk from "@/components/ui/landing/WhatToAsk";
import Hero from "@/components/ui/landing/Hero";
import PricingSection from "@/components/ui/landing/PricingSection";
import CTA from "@/components/ui/landing/CTA";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";



export default async function Home() {
  const user= await currentUser();

  //redirect auth users to dashboard
  if(user) redirect("/dashboard");
  return <div className="min-h-screen bg-background">
    <Header/>
    <Hero/>
    <HowItWorks/>
    <WhatToAsk/>
    <PricingSection/>
    <CTA/>
    <Footer/>

    

    
  </div>
 
}
