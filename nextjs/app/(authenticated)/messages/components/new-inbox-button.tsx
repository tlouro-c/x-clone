"use client"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {MailPlus, X} from "lucide-react";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {SearchPeopleInput} from "@/app/(authenticated)/messages/components/search-people-input";
import * as React from "react";
import {useState} from "react";
import {UserInterface} from "@/types/interfaces";
import {createInboxAction} from "@/actions/user-actions";
import {useAuthenticatedUser} from "@/app/(authenticated)/components/authenticated-user-context";
import {useRouter} from "next/navigation";
import {toast} from "sonner";


export const NewInboxButton = () => {

    const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);
    const {authenticatedUser} = useAuthenticatedUser()
    const router = useRouter()
    const [open, setOpen] = useState(false);

    const handleNextOnClick = async (e: React.MouseEvent) => {
        e.preventDefault()

        if (selectedUser) {
            const responseState = await createInboxAction({userAId: authenticatedUser.id , userBId: selectedUser.id})
            if (responseState.ok) {
                router.push(`/messages/${responseState.inbox?.id}`)
            } else {
                toast(responseState.detail)
            }
            setOpen(false)
            setSelectedUser(null)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(open) => {
            setOpen(open);
            if (!open) {
                setSelectedUser(null);
            }
        }}>
            <DialogTrigger className={"rounded-full"}>
                <MailPlus size={20}/>
            </DialogTrigger>
            <DialogContent className={"p-0 border gap-1"}>
                <DialogDescription></DialogDescription>

                <DialogHeader className={"flex flex-row items-center justify-start gap-8 py-2 px-4"}>
                    <DialogClose className={"mt-1 w-8 flex rounded-full aspect-square items-center justify-center"}>
                        <X size={20}/>
                    </DialogClose>
                    <DialogTitle className={"inline-flex"}>
                        New message
                    </DialogTitle>
                    <Button className={"ms-auto rounded-full font-bold"} disabled={selectedUser == null} onClick={handleNextOnClick}> Next </Button>
                </DialogHeader>

                <DialogBody>
                    <SearchPeopleInput
                        className={"border-b"}
                        selectedUser={selectedUser}
                        setSelectedUser={setSelectedUser}
                    />
                </DialogBody>

            </DialogContent>

        </Dialog>
    )
}