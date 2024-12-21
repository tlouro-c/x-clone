import Loader from "@/components/ui/loader";
import * as React from "react";


const Loading = () => {

    return (
        <div className="mt-20 inset-0 flex items-center justify-center z-10">
            <Loader/>
        </div>
    )
}

export default Loading