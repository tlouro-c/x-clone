export interface UserInterface {
    id: string
    username: string,
    name: string,
    email?: string,
    role: string,
    avatar: string | null,
    postsCount: number,
    followersCount: number,
    followingCount: number,
    isFollowedByCurrentUser: boolean
    createdAt: Date
}



export interface AuthStatusInterface {
    isAuthenticated: boolean
    hasPendingEmailConfirmation: boolean;
    userId: string;
}

export interface CommentInterface {
    author: UserInterface;
    content: string;
}

export interface TweetInterface {
    id: number;
    content: string;
    user: UserInterface;
    createdAt: string;
    comments?: number;
    likesCount: number;
    retweetsCount: number;
    isLikedByCurrentUser: boolean;
    isRetweetedByCurrentUser: boolean;
}

export interface TweetActivityInterface {
    id: number;
    tweet: TweetInterface;
    user: UserInterface;
    type: string;
}

export interface BasicApiResponseInterface {
    message?: string
}

export interface MessageInterface {
    id: number
    sender: UserInterface
    receiver: UserInterface
    timestamp: Date
    content: string
}

export interface ChatBoxInterface {
    id: number
    userA: UserInterface
    userB: UserInterface
    lastMessage: MessageInterface
}