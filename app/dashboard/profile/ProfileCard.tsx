"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

const mockUser: UserProfile = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  role: "Administrator",
  avatarUrl: "",
};

const roles = ["Administrator", "User", "Manager"];
const recentActivity = [
  "Logged in from new device",
  "Changed password",
  "Updated profile information",
];

export default function ProfileCard() {
  const [user, setUser] = React.useState<UserProfile>(mockUser);
  const [editing, setEditing] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [avatar, setAvatar] = React.useState<File | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setEditing(false);
    alert("Profile saved (mock)");
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  return (
    <div className="rounded-lg shadow-md bg-white p-6">
      <form onSubmit={handleSave} className="space-y-4">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold mr-4 overflow-hidden">
            {avatar ? (
              <img
                src={URL.createObjectURL(avatar)}
                alt="Avatar"
                className="w-16 h-16 object-cover rounded-full"
              />
            ) : (
              <span>{user.name[0]}</span>
            )}
          </div>
          <div>
            {editing ? (
              <Input
                value={user.name}
                onChange={e => setUser({ ...user, name: e.target.value })}
                className="mb-2"
                placeholder="Name"
              />
            ) : (
              <div className="text-lg font-semibold">{user.name}</div>
            )}
            <div className="text-gray-500">{user.role}</div>
          </div>
        </div>
        {editing && (
          <div>
            <label className="block mb-1 text-sm font-medium">Avatar</label>
            <Input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>
        )}
        <div>
          <label className="block mb-1 text-sm font-medium">Email</label>
          {editing ? (
            <Input
              value={user.email}
              onChange={e => setUser({ ...user, email: e.target.value })}
              type="email"
              placeholder="Email"
            />
          ) : (
            <div className="text-gray-700">{user.email}</div>
          )}
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Role</label>
          {editing ? (
            <Select
              value={user.role}
              onValueChange={role => setUser({ ...user, role })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map(role => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-gray-700">{user.role}</div>
          )}
        </div>
        {editing && (
          <div>
            <label className="block mb-1 text-sm font-medium">Change Password</label>
            <Input
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              placeholder="New Password"
            />
          </div>
        )}
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button type="submit">Save</Button>
              <Button type="button" variant="secondary" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button type="button" onClick={() => setEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </form>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
        <ul className="list-disc pl-5 text-gray-700 text-sm">
          {recentActivity.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
