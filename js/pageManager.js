class PageManager {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 14;
        this.isTransitioning = false;
    }

    next() {
        if (this.isTransitioning) {
            return;
        }

        if (this.currentPage >= this.totalPages) {
            return;
        }

        this.goTo(this.currentPage + 1);
    }

    previous() {
        if (this.isTransitioning) {
            return;
        }

        if (this.currentPage <= 1) {
            return;
        }

        this.goTo(this.currentPage - 1);
    }
    goTo(pageNumber) {
        if (this.isTransitioning) {
            return;
        }

        if (
            pageNumber < 1 ||
            pageNumber > this.totalPages
        ) {
            return;
        }

        this.isTransitioning = true;

        const previousPage = this.currentPage;

        this.currentPage = pageNumber;

        console.log(
            `Moving from page ${previousPage} to page ${pageNumber}`
        );

        setTimeout(() => {
            this.isTransitioning = false;
        }, 1800);
    }
}

export default PageManager;