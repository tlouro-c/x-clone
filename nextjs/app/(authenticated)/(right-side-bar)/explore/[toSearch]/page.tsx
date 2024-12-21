import {SearchResults} from "@/app/(authenticated)/(right-side-bar)/explore/[toSearch]/components/search-results";
import LoadingDefault from "@/app/loading";
import {Suspense} from "react";

const ExploreContent =  async ({params}: { params: Promise<{ toSearch: string }> }) => {

    const toSearch = (await params).toSearch

    return (
        <Suspense fallback={<LoadingDefault/>}>
            <SearchResults toSearch={toSearch}/>
        </Suspense>
    )

}

export default ExploreContent
