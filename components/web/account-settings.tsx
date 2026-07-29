"use client";

import { Modal } from "@/components/web";
import { Button } from "@/components/ui";
import toast from "react-hot-toast";
import { useUser } from "@/stores";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AccountSettings() {
  const { userSet } = useUser();
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);

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
    } else {
      toast.error("Error logging out!");
    }
  };

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
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold">Account Settings</h1>
      <div className="flex justify-between">
        <Button onClick={() => setModalOpen(true)}>DELETE ACCOUNT</Button>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <p>Are you sure!</p>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="w-full"
          >
            DELETE
          </Button>
        </Modal>
        <Button variant="outline" onClick={handleLogout}>
          LOG OUT
        </Button>
      </div>
    </div>
  );
}
