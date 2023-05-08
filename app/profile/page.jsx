"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Profile from "@components/Profile";

export default function MyProfile() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const router = useRouter();
  const [username, setUsername] = useState("");

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPrompts = async () => {
      let response;
      let user;
      if (userId) {
        response = await fetch(`/api/users/${userId}/posts`);
        user = await fetch(`/api/users/${userId}`);
      } else {
        response = await fetch(`/api/users/${session?.user.id}/posts`);
        user = await fetch(`/api/users/${session?.user.id}`);
      }
      const data = await response.json();
      const userData = await user.json();
      setPosts(data);
      console.log(userData);
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
        name={`${username}'s`}
        desc={`Welcome to ${username}'s profile!`}
        data={posts}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    )
  );
}
