import { Separator } from "@/components/ui/separator";
import { PersonalDetails } from "@/components/web/personal-details";
import { ChangePassword } from "@/components/web/change-password";
import { AccountSettings } from "@/components/web/account-settings";

export default function UserPage() {
  return (
    <main className="max-w-200 mx-auto w-full p-5 flex flex-col gap-5">
      <PersonalDetails />
      <Separator />
      <ChangePassword />
      <Separator />
      <AccountSettings />
    </main>
  );
}
