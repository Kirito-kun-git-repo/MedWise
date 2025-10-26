"use server"

import { prisma } from "../prisma";

export async function getAppointments() {
    
    try{
        const appoinments=await prisma.appointment.findMany({
            include:{
                user:{
                    select:{
                        firstName:true,
                        lastName:true,
                        email:true
                    }
                },
                doctor:{
                    select:{
                        name:true,
                        imageUrl:true,
                       
                    }
                },
            },
            orderBy:{createdAt:'desc'}

        });
        return appoinments;

    }
    catch(err){
        console.log("Error fetching appointments:",err);
        throw new Error("Could not fetch appointments");

    }
}