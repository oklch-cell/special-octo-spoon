"use client";

import { useUserStore } from "@/providers/user-store-provider";
import {useEffect, useState} from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Modal from "@/components/web/modal";

export default function UserPage() {
    const { user, userSet } = useUserStore(state => state);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const router = useRouter();
    const [modalOpen, setModalOpen] = useState(false);

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

    const handleLogout = async () => {
        const response = await fetch("/api/users/logout", {
            method: "GET",
            credentials: "include",
        });
        const { success } = await response.json();

        if (success) {
            userSet(null);
            toast.success("Logged out successfully!");
            router.push("/");
        }
    }

    const handleDelete = async () => {
        const response = await fetch("/api/users", {
            method: "DELETE",
            credentials: "include",
        });
        const { success, error } = await response.json();

        if (success) {
            userSet(null);
            toast.success("Account deleted successfully!");
            router.push("/");
        } else {
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
            <Separator />
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold">Account Settings</h1>
                <div className="flex justify-between">
                    <Button onClick={() => setModalOpen(true)}>DELETE ACCOUNT</Button>
                    <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                        <p>Are you sure!</p>
                        <Button variant="destructive" onClick={handleDelete} className="w-full">DELETE</Button>
                    </Modal>
                    <Button variant="outline" onClick={handleLogout}>LOG OUT</Button>
                </div>
            </div>
        </main>
    )
}
