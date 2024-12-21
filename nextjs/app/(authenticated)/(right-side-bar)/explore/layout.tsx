import {ExploreHeader} from "@/app/(authenticated)/(right-side-bar)/explore/components/explore-header";
import {SearchContentProvider} from "@/app/(authenticated)/(right-side-bar)/explore/components/search-content-context";
import {ScrollArea} from "@/components/ui/scroll-area";

const ExploreLayout = async ({
                                          children,
                                      }: Readonly<{
    children: React.ReactNode;
}>) => {

    return (
        <div className={"flex flex-col h-screen"}>
            <SearchContentProvider>
                <div className={"h-auto"}>
                    <ExploreHeader />
                </div>
                <ScrollArea className={"flex-grow"}> {children} </ScrollArea>
            </SearchContentProvider>
        </div>

    )
}

export default ExploreLayout