let currentPage = 1;

const TOTAL_PAGES = 14;


/**
 * شماره صفحه فعلی را برمی‌گرداند.
 */
export function getCurrentPage() {
    return currentPage;
}


/**
 * رفتن به یک صفحه مشخص.
 */
export function goToPage(pageNumber) {

    if (pageNumber < 1 || pageNumber > TOTAL_PAGES) {
        return;
    }

    currentPage = pageNumber;

    updatePageState();
}


/**
 * رفتن به صفحه بعد.
 */
export function goToNextPage() {

    if (currentPage >= TOTAL_PAGES) {
        return;
    }

    goToPage(currentPage + 1);
}


/**
 * برگشتن به صفحه قبل.
 */
export function goToPreviousPage() {

    if (currentPage <= 1) {
        return;
    }

    goToPage(currentPage - 1);
}


/**
 * اعمال وضعیت صفحه فعلی روی Scene.
 */
function updatePageState() {

    const scene = document.getElementById("scene");

    if (!scene) {
        console.error("❌ #scene پیدا نشد.");
        return;
    }

    // حذف کلاس‌های صفحات قبلی
    for (let i = 1; i <= TOTAL_PAGES; i++) {

        const page = String(i).padStart(2, "0");

        scene.classList.remove(`page${page}-active`);
        scene.classList.remove(`story-page-${page}-active`);
    }

    // کلاس صفحه فعلی
    const page = String(currentPage).padStart(2, "0");

    scene.classList.add(`page${page}-active`);
    scene.classList.add(`story-page-${page}-active`);

    console.log(`📖 صفحه فعلی: ${currentPage}`);
}