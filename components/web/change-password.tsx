"use client";

import { Field, FieldLabel, Input, Button } from "@/components/ui";
import { useState } from "react";
import toast from "react-hot-toast";

export function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handlePassword = async () => {
    const response = await fetch("/api/users", {
      method: "PUT",
      body: JSON.stringify({
        password: oldPassword,
        new_password: newPassword,
      }),
      credentials: "include",
    });
    const { success, error } = await response.json();

    if (success) {
      setOldPassword("");
      setNewPassword("");
      toast.success("Password changed successfully!");
    } else {
      toast.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold">Change Password</h1>
      <Field>
        <FieldLabel>Current Password</FieldLabel>
        <Input
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Current Password"
        />
      </Field>
      <Field>
        <FieldLabel>New Password</FieldLabel>
        <Input
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
        />
      </Field>
      <div className="flex justify-end">
        <Button onClick={handlePassword}>CHANGE PASSWORD</Button>
      </div>
    </div>
  );
}
