import {
    startStory,
    nextPage,
    previousPage
} from "./storyController.js";


// شروع داستان
startStory();


// برای تست موقت در Console
window.story = {
    next: nextPage,
    previous: previousPage
};