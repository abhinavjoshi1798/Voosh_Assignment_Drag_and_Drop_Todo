import {z} from "zod"

export const registerSchema = z.object({
name:z.string({message:"Name is required."}).min(3,{message:"Name must be 3 characters long."}).max(30,{message:"Name must be at max 30 characters long."}),
email:z.string({message:"Email is required."}).email({message:"Please type correct email."}),
image:z.string().optional(),
password:z.string({message:"Password is required."}).min(6,{message:"Password must be minimum 6 characters long."}),
confirm_password:z.string({message:"Confirm Password is required."}).min(6,{message:"Confirm Password must be minimum 6 characters long."})
}).refine((data)=>data.password === data.confirm_password,{
    message:"Confirm Password and Password must be same.",
    path:["confirm_password"]
})

export const loginSchema = z.object({
email:z.string({message:"Email is required."}).email({message:"Please type correct email."}),
password:z.string({message:"Password is required."})
})