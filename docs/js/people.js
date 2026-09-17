const PEOPLE_COUNT = 9;
const SPECIAL_PERSON_INDEX = 4;

function getPageNumber(element) {
    const classNames = [...element.classList];

    for (const className of classNames) {
        let match = className.match(/story-page-0?(\d+)/);

        if (match) {
            return Number(match[1]);
        }

        match = className.match(/page0?(\d+)-layer/);

        if (match) {
            return Number(match[1]);
        }
    }

    return null;
}

function createPerson(index) {
    const person = document.createElement("div");

    person.className = "symbolic-person";

    if (index === SPECIAL_PERSON_INDEX) {
        person.classList.add("special-person");
    }

    person.style.setProperty(
        "--person-left",
        `${4 + index * 11.5}%`
    );

    person.style.setProperty(
        "--person-index",
        index
    );

    person.innerHTML = `
        <span class="person-head"></span>
        <span class="person-body"></span>

        <span class="person-arm person-arm-left">
            <span class="person-hand"></span>
        </span>

        <span class="person-arm person-arm-right">
            <span class="person-hand"></span>
        </span>
    `;

    return person;
}

function createPeopleSystem(pageElement, pageNumber) {
    if (
        !pageElement ||
        pageElement.querySelector(".people-system")
    ) {
        return;
    }

    const people = document.createElement("div");

    people.className = "people-system";
    people.setAttribute("aria-hidden", "true");
    people.dataset.page = pageNumber;

    for (let i = 0; i < PEOPLE_COUNT; i++) {
        people.appendChild(createPerson(i));
    }

    pageElement.appendChild(people);
}

function installPeople() {
    const pages = document.querySelectorAll(".page-layer");

    pages.forEach((page) => {
        const pageNumber = getPageNumber(page);

        if (!pageNumber) {
            return;
        }

        createPeopleSystem(page, pageNumber);
    });
}

function startPeopleSystem() {
    installPeople();

    const observer = new MutationObserver(() => {
        installPeople();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        startPeopleSystem,
        { once: true }
    );
} else {
    startPeopleSystem();
}