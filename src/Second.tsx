import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";

interface User {
  id: number;
  name: string;
}

const schemaa = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  userId: z.number(),
});

type shcemaData = z.infer<typeof schemaa>;

export default function Second() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<shcemaData>({
    resolver: zodResolver(schemaa),
    defaultValues: {
      title: "",
      body: "",
    },
  });
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onSubmit = async (data: shcemaData) => {
    try {
      await axios.post("https://jsonplaceholder.typicode.com/posts", data);
      alert("success");
      reset();
    } catch (error) {
      alert("error");
    }

  };
  return <>
    <form onSubmit={handleSubmit(onSubmit)} className="w-3xl">
      <label htmlFor="1">Title: </label>
      <input type="text" {...register("title")} id="1" className="border rounded-md"/>
      <label htmlFor="2">Body: </label>
      <input type="text" {...register("body")} id="2" className="border rounded-md"/>
      <label htmlFor="3">Select: </label>
      <select {...register("userId", {valueAsNumber: true})} className="border rounded-md">
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      {errors.body && <p className="text-red-500">{errors.body.message}</p>}
      <button type="submit" className="border px-2 bg-amber-300 ">Submit</button>
    </form>
  </>;
}
