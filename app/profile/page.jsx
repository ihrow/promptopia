"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Profile from "@components/Profile";

export default function MyProfile() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  let userId = searchParams.get("id");
  const router = useRouter();
  const [username, setUsername] = useState("");

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPrompts = async () => {
      if (!userId) userId = session?.user.id;
      const response = await fetch(
        `/api/users/${
          userId !== session?.user.id ? userId : session?.user.id
        }/posts`
      );
      const user = await fetch(
        `/api/users/${userId !== session?.user.id ? userId : session?.user.id}`
      );
      const data = await response.json();
      const userData = await user.json();
      setPosts(data);
      setUsername(userData.username);
    };
    fetchPrompts(); 
  }, []);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );
    if (hasConfirmed) {
      try {
        const response = await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setPosts(posts.filter((p) => p._id !== post._id));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    username && (
      <Profile
        name={userId === session?.user.id ? "My Profile" : username}
        desc={`Welcome to ${username}'s profile!`}
        data={posts}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    )
  );
}
