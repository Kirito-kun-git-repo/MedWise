"use server"

import { Gender } from "@prisma/client";
import { prisma } from "../prisma"
import { generateAvatar } from "../utils";
import { revalidatePath } from "next/cache";
import { ca, tr } from "date-fns/locale";




export async function getDoctors() {
    try {
        const doctors = await prisma.doctor.findMany({
            include: {
                _count: {
                    select: { Appointment: true },
                },
            },
            orderBy: { createdAt: 'desc' }
        });
        return doctors.map((doctor) => ({
            ...doctor,
            appointmentsCount: doctor._count.Appointment
        }))
    }
    catch (err) {
        console.log("Error fetching doctors:", err);
        throw new Error("Could not fetch doctors");
    }
}
interface CreateDoctorInput {
    name: string;
    email: string;
    speciality: string;
    phone: string | null;
    bio: string;
    gender: Gender;
    isActive: boolean;
}
export async function createDoctor(input: CreateDoctorInput) {

    try {

        if (!input.name || !input.email || !input.speciality || !input.phone) {
            throw new Error("Missing required fields");
        }
        const newDoctor = await prisma.doctor.create({
            data: {
                ...input,
                imageUrl: generateAvatar(input.name, input.gender)

            }
        });
        revalidatePath("/admin/");
        return newDoctor;

    }
    catch (err: any) {
        console.log("Error creating doctor:", err);
        if (err?.code === "P2002") {
            throw new Error("A doctor with this email already exists");
        }
        throw new Error("Could not create doctor");
    }

}

interface UpdateDoctorInput extends Partial<CreateDoctorInput> {
    id: string;
}
export async function updateDoctor(input: UpdateDoctorInput) {

    try {
        //validate input
        if (!input.name || !input.email) {
            throw new Error("Name and Email are required fields");

        }
        const currentDoctor = await prisma.doctor.findUnique({
            where: { id: input.id, },
            select: { email: true, }

        });
        if (!currentDoctor) {
            throw new Error("Doctor not found");
        }
        //if email is being updated, check for uniqueness
        if (input.email !== currentDoctor.email) {
            const existingDoctor = await prisma.doctor.findUnique({
                where: { email: input.email, }
            });
            if (existingDoctor) {
                throw new Error("A doctor with this email already exists");
            }
        }
        const updatedDoctor = await prisma.doctor.update({
            where: { id: input.id, },
            data: {
                name: input.name,
                email: input.email,
                phone: input.phone,
                speciality: input.speciality,
                gender: input.gender,
                isActive: input.isActive,
            }
        })
        revalidatePath("/admin/");
        return updatedDoctor;

    }






    catch (err) {
        console.log("Error updating doctor:", err);
        throw new Error("Could not update doctor");

    }

}
