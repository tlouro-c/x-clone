"use client"

import {useFeedContent} from "@/app/(authenticated)/(right-side-bar)/home/components/feed-content-provider";
import ContentSwitchButton from "@/app/(authenticated)/(right-side-bar)/home/components/content-switch-button";

export const HomeHeader = () => {
    const { feedContent, setFeedContent } = useFeedContent();

    const handleClick = (type: "For you" | "Following") => (e: React.MouseEvent<HTMLElement>)=> {
        e.preventDefault()

        if (feedContent.type == type) {
            return
        }
        setFeedContent(() => ({type: type, tweetActivityList: []}))
    }

    return (
        <div className="sticky top-12 md:top-0 border-b flex z-10 bg-background/80 backdrop-blur-sm">
            <ContentSwitchButton className="h-14 flex-1" isHighlighted={feedContent.type == "For you"}
                        onClickAction={handleClick("For you")}>
                For you
            </ContentSwitchButton>
            <ContentSwitchButton className="h-14 flex-1" isHighlighted={feedContent.type == "Following"}
                        onClickAction={handleClick("Following")}>
                Following
            </ContentSwitchButton>
        </div>
    )
}