import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";

interface User {
  id: number;
  username: string;
  email: string;
  website: string;
  phone: string;
}

const userSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email"),
  website: z.string().min(1, "Website is required"),
  phone: z.string().min(1, "Phone is required"),
});

type userData = z.infer<typeof userSchema>;

export default function Third() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<userData>({
    resolver: zodResolver(userSchema),
    defaultValues: { username: "", email: "", website: "", phone: "" },
  });
  
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users/1")
      .then((res) => {
        setUser(res.data); 
      })
      .catch((err) => console.log(err));
  }, [reset]); 

  const onSubmit = async (data: userData) => {
    try {
      await axios.put("https://jsonplaceholder.typicode.com/users/1", data);
      alert("success");
      reset();
    } catch (error) {
      alert("error");
    }
  };

  if (!user) {
    return <div className="p-5">Loading data...</div>;
  }

  return (
    <div className="flex flex-wrap w-lg p-3 justify-between border h-fit">
      <div className="border p-2">
        <h2>UserName: {user.username}</h2>
        <h2>Phone: {user.phone}</h2>
        <h2>Email: {user.email}</h2>
        <a className="hover:text-blue-500 underline" href={`https://${user.website}`} target="_blank" rel="noopener noreferrer">Website: {user.website}</a>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap w-1/2 gap-y-2">
        <input className="border rounded-md p-0.5 w-full" type="text" {...register("username")} placeholder="Username" />
        <input className="border rounded-md p-0.5 w-full" type="email" {...register("email")} placeholder="Email" />
        <input className="border rounded-md p-0.5 w-full" type="text" {...register("website")} placeholder="Website" />
        <input className="border rounded-md p-0.5 w-full" type="text" {...register("phone")} placeholder="Phone" />
        <button type="submit" className="border px-2 bg-amber-300 w-full">Save</button>
        
        {errors.username && <p className="text-red-500">{errors.username.message}</p>}
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        {errors.website && <p className="text-red-500">{errors.website.message}</p>}
        {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
      </form>
    </div>
  );
}