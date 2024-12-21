import LoadingDefault from "@/app/loading";
import {Suspense} from "react";

export default function Notifications() {

    return (
        <Suspense fallback={<LoadingDefault/>}>
            <div>
                Notifications Page
            </div>
        </Suspense>
    )
}