import { MySwal, Toast } from "~/helpers/Toast"
import { requestService } from "./api.service";
import { router } from "@inertiajs/react";

export const deleteService = (url: string) => MySwal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
        requestService({
            url: url,
            method: 'delete'
        }).then(response =>{
                Toast.fire({
                    text: response.data.message,
                    icon: "success"
                });
                router.reload()
            })
    }
  });