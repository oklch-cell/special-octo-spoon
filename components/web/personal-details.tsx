"use client";

import { Field, FieldLabel, Button, Input } from "@/components/ui";
import toast from "react-hot-toast";
import { useUser } from "@/stores";
import { useEffect, useState } from "react";

export function PersonalDetails() {
  const { user, userSet } = useUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    function setFields() {
      if (user) {
        setName(user?.name);
        setEmail(user?.email);
        setAddress(user?.address);
        setPhone(user?.phone);
      }
    }

    setFields();
  }, [user]);

  const handleUpdate = async () => {
    const response = await fetch("/api/users", {
      method: "PUT",
      body: JSON.stringify({ name, email, address, phone }),
      credentials: "include",
    });
    const { success, data, error } = await response.json();

    if (success) {
      toast.success("Profile updated successfully!");
      userSet(data);
    } else {
      toast.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold">Personal Details</h1>
      <Field>
        <FieldLabel>Name</FieldLabel>
        <Input value={name || ""} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input value={email || ""} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      <Field>
        <FieldLabel>Address</FieldLabel>
        <Input
          value={address || ""}
          onChange={(e) => setAddress(e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel>Phone</FieldLabel>
        <Input value={phone || ""} onChange={(e) => setPhone(e.target.value)} />
      </Field>
      <div className="flex justify-end">
        <Button onClick={handleUpdate}>UPDATE</Button>
      </div>
    </div>
  );
}
