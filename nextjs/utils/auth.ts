
export interface AuthenticationResponse {
    accessToken: string;
    userId: string;
    hasPendingEmailConfirmation: boolean;
}
