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
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import HowItWorks from "@/components/landing/HowItWorks";
import WhatToAsk from "@/components/landing/WhatToAsk";
import Hero from "@/components/landing/Hero";
import PricingSection from "@/components/landing/PricingSection";
import CTA from "@/components/landing/CTA";
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
