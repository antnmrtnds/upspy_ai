import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <UserProfile />
    </div>
  );
}
