"use client";

import { useUserStore } from "@/providers/user-store-provider";
import {useEffect, useState} from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";

export default function UserPage() {
    const { user, userSet } = useUserStore(state => state);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        async function getUser() {
            if (!user) {
                const response = await fetch("/api/users", {
                    credentials: "include",
                });
                const { success, data, error } = await response.json();

                if (success) {
                    console.log(data);
                    userSet(data);
                } else {
                    console.error(error);
                }
            }
        }

        getUser().then(() => {
            setName(user?.name as string);
            setEmail(user?.email as string);
            setAddress(user?.address as string);
            setPhone(user?.phone as string);
        });
    }, [user, userSet]);

    const handlePassword = async () => {
        const response = await fetch("/api/users", {
            method: "PUT",
            body: JSON.stringify({ password: oldPassword, new_password: newPassword }),
            credentials: "include",
        });
        const { success, data, error } = await response.json();

        if (success) {
            console.log(data);
            toast.success("Password changed successfully!");
        } else {
            console.error(error);
            toast.error(error);
        }
    }

    const handleUpdate = async () => {
        const response = await fetch("/api/users", {
            method: "PUT",
            body: JSON.stringify({ name, email, address, phone }),
            credentials: "include",
        });
        const { success, data, error } = await response.json();

        if (success) {
            console.log(data);
            toast.success("Profile updated successfully!");
            userSet(data);
        } else {
            console.error(error);
            toast.error(error);
        }
    }

    return (
        <main className="max-w-200 mx-auto w-full p-5 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold">Personal Details</h1>
                <Field>
                    <FieldLabel>Name</FieldLabel>
                    <Input value={name} onChange={e => setName(e.target.value)} />
                </Field>
                <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input value={email} onChange={e => setEmail(e.target.value)} />
                </Field>
                <Field>
                    <FieldLabel>Address</FieldLabel>
                    <Input value={address} onChange={e => setAddress(e.target.value)} />
                </Field>
                <Field>
                    <FieldLabel>Phone</FieldLabel>
                    <Input value={phone} onChange={e => setPhone(e.target.value)} />
                </Field>
                <div className="flex justify-end">
                    <Button onClick={handleUpdate}>UPDATE</Button>
                </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold">Change Password</h1>
                <Field>
                    <FieldLabel>Current Password</FieldLabel>
                    <Input value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="Current Password" />
                </Field>
                <Field>
                    <FieldLabel>New Password</FieldLabel>
                    <Input value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password" />
                </Field>
                <div className="flex justify-end">
                    <Button onClick={handlePassword}>CHANGE PASSWORD</Button>
                </div>
            </div>
        </main>
    )
}
