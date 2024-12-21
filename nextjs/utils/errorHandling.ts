import {AxiosError} from "axios";

export function handleErrors<T>(
    error: AxiosError<T>,
    setErrorMessage: (message: string | null) => void,
    router: { push: (url: string) => void }
) {
    const status = error.status ?? 500;
    if (status < 500) {
        const message = (error.response?.data as { detail?: string })?.detail;
        setErrorMessage(message ?? "An unknown error occurred");
    } else if (status === 401 || status === 403) {
        router.push('/auth/login');
    } else {
        setErrorMessage("A server error occurred. Please try again later.");
    }

}