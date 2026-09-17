let currentPage = 1;

const TOTAL_PAGES = 14;

export function getCurrentPage() {
    return currentPage;
}

export function goToNextPage() {
    if (currentPage >= TOTAL_PAGES) {
        return;
    }

    currentPage++;
}

export function goToPreviousPage() {
    if (currentPage <= 1) {
        return;
    }

    currentPage--;
}