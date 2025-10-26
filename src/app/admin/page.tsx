import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'
import AdminDashboardClient from './AdminDashboardClient';

async function AdminPage(){

    const user =await currentUser();
    //user is not logged in
    if(!user) return redirect("/");

    const adminEmail=process.env.ADMIN_EMAIL;
    console.log(adminEmail);
    const userEmail=user?.emailAddresses[0]?.emailAddress;

    //user is not admin
    if(userEmail !== adminEmail) return redirect("/dashboard");
    return <AdminDashboardClient/>;


 
}

export default AdminPage

