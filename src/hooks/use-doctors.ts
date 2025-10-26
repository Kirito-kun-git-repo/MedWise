"use client"

import { createDoctor, getDoctors, updateDoctor } from "@/lib/actions/doctors"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export function useGetDoctors() {
    const results = useQuery({
        queryKey: ['getDoctors'],
        queryFn: getDoctors
    })
    return results;
}

export function useCreateDoctor() {
    const queryClient=useQueryClient();
    const results = useMutation({
        mutationFn: createDoctor,
        onSuccess: () => {
            //invalidate and refetch the doctors list after a successful creation of new doctor
            queryClient.invalidateQueries({queryKey:['getDoctors']});
        },
        onError: (error) => console.log("Error creating doctor:", error)
    });
    return results;

}
export function useUpdateDoctor() {
    const queryClient=useQueryClient();
    const results = useMutation({
        mutationFn: updateDoctor,
        onSuccess: () => {
            //invalidate and refetch the doctors list after a successful creation of new doctor
            queryClient.invalidateQueries({queryKey:['getDoctors']});
        },
        onError: (error) => console.log("Error updating doctor:", error)
    });
    return results;

}
