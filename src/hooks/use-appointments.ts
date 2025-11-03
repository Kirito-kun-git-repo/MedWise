"use client"

import { bookAppointment, getAppointments, getBookedTimeSlots, getUserAppointments, UpdateAppointmentStatus } from "@/lib/actions/appointments"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"


export  function useGetAppointments() {
    const results=useQuery({
        queryKey: ['getAppointments'],
        queryFn:getAppointments,
    })
    return results;
}
export function useBookedTimeSlots(doctorId:string,date:string){
    const results=useQuery({
        queryKey:['getBookedTimeSlots'],
        queryFn:()=>getBookedTimeSlots(doctorId!,date),
        enabled:!!doctorId && !!date,//only run the query if both doctorId and date are provided
    });
    return results;
}

export function useBookAppointment(){
    const queryClient=useQueryClient();
    return useMutation({
        mutationFn: bookAppointment,
        onSuccess:()=>{
            //invalidate and refetch the appointments list after a successful booking
            queryClient.invalidateQueries({queryKey:['getUserAppointments']});
        },
        onError:(error)=>console.log("Error booking appointment:",error)
    })

}

//Get user specific appointments
export function useUserAppointments(){
    const results=useQuery({
        queryKey:['getUserAppointments'],
        queryFn:getUserAppointments,
    });
    return results;

}
export function useUpdateAppointmentStatus(){
    const queryClient=useQueryClient();
    return useMutation({
        mutationFn: UpdateAppointmentStatus,
        onSuccess:()=>{
            //invalidate and refetch the appointments list after updating status
            queryClient.invalidateQueries({queryKey:['getAppointments']});
        },
        onError:(error)=>console.log("Error updating appointment status:",error)
    })
}



 