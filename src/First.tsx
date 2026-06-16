import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";


const schemaO = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "weak password"),
  cpassword: z.string().min(1, "Confirm password"),
}).refine((data) => data.password === data.cpassword, { message: "Passwords do not match", path: ["cpassword"] });

type schemaO = z.infer<typeof schemaO>;

export default function First() {
  const { register, handleSubmit, formState: { errors } } = useForm<schemaO>({
    resolver: zodResolver(schemaO),
  });

  const onSubmit = async (data: schemaO) => {
    try {
      await axios.post("https://jsonplaceholder.typicode.com/users", data);
      alert("success");
    } catch (error) {
      alert("error");
    }
  };

  return (
    <form className="flex flex-wrap w-70 p-3 justify-between border h-fit" onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="1">Name: </label>
      <input type="text" {...register("name")} id="1" className="border rounded-md"/>
      <label htmlFor="2">Email: </label>
      <input type="email" {...register("email")} id="2" className="border rounded-md"/>
      <label htmlFor="3">Password: </label>
      <input type="password" {...register("password")} id="3" className="border rounded-md"/>
      <label htmlFor="4">Check: </label>
      <input type="password" {...register("cpassword")} id="4" className="border rounded-md w-fit"/>
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      {errors.password && <p className="text-red-500">{errors.password.message}</p>}
      {errors.cpassword && <p className="text-red-500">{errors.cpassword.message}</p>}
      <button type="submit" className="border px-2 bg-amber-300 ">Submit</button>
    </form>
  );
}
