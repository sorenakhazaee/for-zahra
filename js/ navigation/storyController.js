import {
    goToPage,
    goToNextPage,
    goToPreviousPage,
    getCurrentPage
} from "./storyNavigation.js";


export function startStory() {

    // داستان از صفحه اول شروع می‌شود.
    goToPage(1);

    console.log("🎬 Story started");
    console.log("📖 Current page:", getCurrentPage());
}


export function nextPage() {

    goToNextPage();

    console.log("➡️ Current page:", getCurrentPage());
}


export function previousPage() {

    goToPreviousPage();

    console.log("⬅️ Current page:", getCurrentPage());
}