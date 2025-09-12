"use client";
import { useParams } from 'next/navigation';

export default function UserProfilePage() {
  const params = useParams();

  const username = params?.username;

  return (
    <div>{username}</div>
  );
}
