"use server"


import {axiosSSR} from "@/lib/server/axios-ssr";
import {AxiosError} from "axios";
import {redirect} from "next/navigation";
import {signOut} from "@/actions/auth-actions";
import {ChatBoxInterface, MessageInterface, UserInterface} from "@/types/interfaces";

interface UpdateUserAccountForm {
    id: string,
    username: string | null,
    email: string | null,
    password: string | null,
    repeatPassword: string | null
}

interface DeleteUserAccountForm {
    id: string,
    password: string,
}

interface FollowForm {
    followedUserId: string,
    followerUserId: string,
    type?: string
}

interface ActionState {
    ok: boolean | null,
    message: string | null
}

export const updateUserAccountAction = async (prevState: ActionState | null, updateUserAccountForm: UpdateUserAccountForm) : Promise<ActionState> => {

    const emailUpdate = updateUserAccountForm.email != null

    try {
        await axiosSSR.put("/users", updateUserAccountForm)
    } catch (error) {
        if (error instanceof AxiosError) {
            return {
                ok: false,
                message: error.response?.data.detail.split(".").at(0) ?? "Failed to update the user"
            }
        }
        return {
            ok: false,
            message: "Failed to update the user"
        }
    }
    if (emailUpdate) {
        redirect("/auth/email-confirmation")
    }
    return {
        ok: true,
        message: "User updated successfully"
    }
}

export const deleteUserAccountAction = async (prevState: string | null, deleteUserAccountForm: DeleteUserAccountForm) => {

    try {
        await axiosSSR.delete("/users", {data:deleteUserAccountForm})
    } catch (error) {
        if (error instanceof AxiosError) {
            return error.response?.data.detail ?? "Failed to delete the user"
        }
        return "Failed to delete the user"
    }
    await signOut()
}


interface FollowActionState {
    ok: boolean,
    type: string,
    detail?: string
}

export const followAction = async (prevState: FollowActionState | null, followForm: FollowForm): Promise<FollowActionState> => {

    const type = followForm.type ?? ""
    delete followForm.type

    try {
        if (type == "follow") {
            await axiosSSR.post("/follows", followForm)
        } else if (type == "unfollow") {
            await axiosSSR.delete("/follows", {data:followForm})
        } else {
            return {ok: false, type: type, detail: "Failed to perform follow/unfollow action"}
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            return {ok: false, type: type, detail: error.response?.data.detail ?? `Failed to ${type} the user`}
        }
        return {ok: false, type: type, detail: `Failed to ${type} the user`}
    }
    return {ok: true, type: type}
}

export const userSearchAction = async (prevState: UserInterface[], toMatch: string): Promise<UserInterface[]> => {

    try {
        const { data } = await axiosSSR.get<UserInterface[]>(`/users/search?toMatch=${toMatch}&page=1`)
        return data
    } catch (error) {
        return []
    }
}

interface MessageRequest {
    senderId: string
    receiverId: string
    content: string
}

interface SendMessageActionState {
    ok: boolean,
    message?: MessageInterface
    detail?: string
}

export const sendMessageAction = async (prevState: SendMessageActionState | null, messageRequest: MessageRequest): Promise<SendMessageActionState> => {

    try {
        const { data } = await axiosSSR.post(`/chat-box/new-message`, messageRequest)
        return {ok: true, message: data}
    } catch (error) {
        if (error instanceof AxiosError) {
            return {ok: false, detail: error.response?.data.detail ?? `Failed to send message`}
        }
        return {ok: false, detail: `Failed to send message`}
    }
}

interface FetchMessagesUpdatesState {
    ok: boolean
    newMessages: MessageInterface[]
    detail?: string
}

export const fetchMessagesUpdatesAction = async (chatBoxId: number): Promise<FetchMessagesUpdatesState> => {

    try {
        const { data } = await axiosSSR.get(`/chat-box/${chatBoxId}/updates`)
        return {ok: true, newMessages: data}
    } catch (error) {
        if (error instanceof AxiosError) {
            return {ok: false, newMessages: [], detail: error.response?.data.detail ?? `Failed to retrieve new messages`}
        }
        return {ok: false, newMessages: [], detail: `Failed to retrieve new messages`}
    }
}

interface CreateInboxRequestInterface {
    userAId: string,
    userBId: string
}

interface CreateInboxState {
    ok: boolean
    inbox: ChatBoxInterface | null
    detail?: string
}

export const createInboxAction = async (createInboxRequest: CreateInboxRequestInterface): Promise<CreateInboxState> => {

    try {
        const { data } = await axiosSSR.post("/chat-box", createInboxRequest)
        return {ok: true, inbox: data}
    } catch (error) {
        if (error instanceof AxiosError) {
            return {ok: false, inbox: null, detail: error.response?.data.detail ?? `Failed to find / create the new inbox`}
        }
        return {ok: false, inbox: null, detail: `Failed to find / create the new inbox`}
    }
}

interface AvatarFetchingData {
    imageData: string,
    contentTypeHeader: string
}

interface AvatarFetchingState {
    ok: boolean
    avatarFetchingData?: AvatarFetchingData
    detail?: string
}

export const fetchAvatarFromServer = async (prevState: AvatarFetchingState | null, avatarSrc: string): Promise<AvatarFetchingState> => {
    try {
        const { data, headers } = await axiosSSR.get(`/users/avatars/${avatarSrc}`, {
            responseType: "arraybuffer"
        });

        const base64String = Buffer.from(data).toString("base64");

        const avatarFetchingData: AvatarFetchingData = {
            imageData: base64String,
            contentTypeHeader: headers["content-type"]
        }
        return {
            ok: true,
            avatarFetchingData: avatarFetchingData,
        }
    } catch (error) {
        const message =
            error instanceof AxiosError ? error.response?.data.detail : "Failed to fetch the avatar";
        return {
            ok: false,
            detail: message
        }
    }
}

interface UpdateAvatarActionState {
    ok: boolean
    updatedUser?: UserInterface
    detail?: string
}

interface AvatarUpdateRequest {
    userId: string,
    newAvatar: Blob
}

export const updateUserAvatarAction = async (prevState: UpdateAvatarActionState | null, avatarUpdateRequest: AvatarUpdateRequest): Promise<UpdateAvatarActionState> => {

    const formData = new FormData()
    formData.append("file", avatarUpdateRequest.newAvatar)

    try {
        const { data } = await axiosSSR.put(
            `/users/${avatarUpdateRequest.userId}/avatar`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        return {
            ok: true,
            updatedUser: data
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            return {
                ok: false,
                detail: error.response?.data.detail ?? `Failed to update the user's avatar`
            }
        }
        return {
            ok: false,
            detail: `Failed to update the user's avatar`
        }
    }
}
