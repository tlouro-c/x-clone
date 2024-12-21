"use client"

import {useSearchContent} from "@/app/(authenticated)/(right-side-bar)/explore/components/search-content-context";
import ContentSwitchButton from "@/app/(authenticated)/(right-side-bar)/home/components/content-switch-button";

export const ExploreHeaderSwitchButtons = () => {

    const { searchContent, setSearchContent} = useSearchContent()

    const handleClick = (type: "People" | "Top") => (e: React.MouseEvent<HTMLElement>)=> {
        e.preventDefault()

        if (searchContent.type == type) {
            return
        }
        setSearchContent(() => ({type: type, peopleList: [], tweetsList: []}))
    }

    return (
        <div className={"flex w-full h-12"}>
            <ContentSwitchButton className={"flex-1"}
                                 onClickAction={handleClick("Top")}
                                 isHighlighted={searchContent.type == "Top"}
            >
                Top
            </ContentSwitchButton>
            <ContentSwitchButton className={"flex-1"}
                                 onClickAction={handleClick("People")}
                                 isHighlighted={searchContent.type == "People"}
            >
                People
            </ContentSwitchButton>
        </div>
    )
}