
import {GoBackButton} from "@/app/(authenticated)/(right-side-bar)/[userId]/components/go-back-button";
import {SidebarSearchInput} from "@/app/(authenticated)/(right-side-bar)/components/sidebar-search-input";
import {
    ExploreHeaderSwitchButtons
} from "@/app/(authenticated)/(right-side-bar)/explore/components/explore-header-switch-buttons";

export const ExploreHeader = () => {

    return (
        <div className={"flex flex-col border-b"}>
            <div className={"flex items-center px-6 gap-4 py-4"}>
                <GoBackButton/>
                <SidebarSearchInput
                />
            </div>
            <ExploreHeaderSwitchButtons/>
        </div>
    )
}