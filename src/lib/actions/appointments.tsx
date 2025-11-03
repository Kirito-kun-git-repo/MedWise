"use server"

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../prisma";
import { Appointment, AppointmentStatus } from "@prisma/client";


function transformAppointment(appointment: any) {
  return {
    ...appointment,
    patientName: `${appointment.user.firstName || ""} ${appointment.user.lastName || ""}`.trim(),
    patientEmail: appointment.user.email,
    doctorName: appointment.doctor.name,
    doctorImageUrl: appointment.doctor.imageUrl || "",
    date: appointment.date.toISOString().split("T")[0],
  };
}

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
        return appoinments.map(transformAppointment);

    }
    catch(err){
        console.log("Error fetching appointments:",err);
        throw new Error("Could not fetch appointments");

    }
}

export async function getUserAppointmentStats(){
    try{
        const {userId}=await auth();
        if(!userId) throw new Error("User not authenticated");
        const user =await prisma.user.findUnique({
            where:{clerkId:userId},
        })
        if(!user) throw new Error("User not found");

        const [totalCount,completedCount] =await Promise.all([
            prisma.appointment.count({
                where:{userId:user.id}
            }),
            prisma.appointment.count({
                where:{userId:user.id,status:'COMPLETED'}
            }),

        ]);
         return {
            totalAppointments:totalCount,
            completedAppointments:completedCount,
         }


    }
    catch(err){
        console.log("Error fetching user appointment stats:",err);
        throw new Error("Could not fetch user appointment stats");

    }
}

export async function getUserAppointments() {
  try {
    // get authenticated user from Clerk
    const { userId } = await auth();
    if (!userId) throw new Error("You must be logged in to view appointments");

    // find user by clerkId from authenticated session
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) throw new Error("User not found. Please ensure your account is properly set up.");

    const appointments = await prisma.appointment.findMany({
      where: { userId: user.id },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        doctor: { select: { name: true, imageUrl: true } },
      },
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });

    return appointments.map(transformAppointment);
  } catch (error) {
    console.error("Error fetching user appointments:", error);
    throw new Error("Failed to fetch user appointments");
  }
}

export async function getBookedTimeSlots(doctorId: string, date: string) {
    try{
    const appointments = await prisma.appointment.findMany({
        where: {
            doctorId,
            date: new Date(date),
            status: {
                in: ["CONFIRMED", "COMPLETED"],

            },
        },
        select: {time:true}
    })
    return appointments.map((appointment) => appointment.time);


    }
    catch(err){
        console.log("Error fetching booked time slots:",err);
        throw new Error("Could not fetch booked time slots");

    }
}

interface BookAppointmentInput {
  doctorId: string;
  date: string;
  time: string;
  reason?: string;
}
export async function bookAppointment(input:BookAppointmentInput){
    try{
        const {userId}=await auth();
        if(!userId) throw new Error("You must be logged in to book an appointment");
        if(!input.doctorId || !input.date || !input.time){
            throw new Error("Missing required fields to book an appointment");
        }
        const user =await prisma.user.findUnique({where:{clerkId:userId}});
        if(!user) throw new Error("User not found");

        const appointment=await prisma.appointment.create({
            data:{
                userId:user.id,
                doctorId:input.doctorId,
                date:new Date(input.date),
                time:input.time,
                reason:input.reason || null,
                status:'CONFIRMED',
            },
            include:{
                user:{
                    select:{
                        firstName:true,
                        lastName:true,
                        email:true
                    },

                },
                doctor:{
                    select:{
                        name:true,
                        imageUrl:true,}
                }
            }
        });
        return transformAppointment(appointment);


    }
    catch(err){
        console.log("Error booking appointment:",err);
        throw new Error("Could not book appointment");

    }

}

export async function UpdateAppointmentStatus(input:{id:string; status:AppointmentStatus}) {
    try{
        const appointment=await prisma.appointment.update({
            where :{
                id:input.id
            },
            data:{
                status:input.status
            }
        });
        return appointment;
    }
    catch(err){
        console.log("Error updating appointment status:",err);
        throw new Error("Could not update appointment status");
    }
    
}
