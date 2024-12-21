import LoadingDefault from "@/app/loading";
import {Suspense} from "react";


export default function Explore() {
    return (
        <Suspense fallback={<LoadingDefault/>}>
            <div className={"flex justify-center items-center h-40"}>
                <p className={"text-4xl font-bold text-center"}>Start exploring!</p>
            </div>
        </Suspense>
    )
}