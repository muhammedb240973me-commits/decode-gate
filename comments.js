// ========================================
// CONFIGURATION
// ========================================

const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbz2BpXYW06yFQwi4TMh97oypl3Ccb3IabHTgwgIPCbWT2NWzIruoJbq_UCW7iknG2px8g/exec";


// ========================================
// ELEMENTS
// ========================================

const commentsGrid =
    document.getElementById(
        "commentsGrid"
    );

const loading =
    document.getElementById(
        "loading"
    );

const errorMessage =
    document.getElementById(
        "errorMessage"
    );

const emptyMessage =
    document.getElementById(
        "emptyMessage"
    );

const retryButton =
    document.getElementById(
        "retryButton"
    );

const feedbackCount =
    document.getElementById(
        "feedbackCount"
    );

const themeToggle =
    document.getElementById(
        "themeToggle"
    );


// ========================================
// THEME
// ========================================

const savedTheme =
    localStorage.getItem(
        "decodeGateTheme"
    );


if (savedTheme === "dark") {

    document.body.classList.add(
        "dark"
    );

    themeToggle.textContent = "☀";

} else {

    themeToggle.textContent = "☾";

}


themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );


        const isDark =
            document.body.classList.contains(
                "dark"
            );


        localStorage.setItem(
            "decodeGateTheme",
            isDark
                ? "dark"
                : "light"
        );


        themeToggle.textContent =
            isDark
                ? "☀"
                : "☾";

    }
);


// ========================================
// LOAD COMMENTS
// ========================================

async function loadComments() {

    // Reset states

    loading.classList.remove(
        "hidden"
    );

    errorMessage.classList.add(
        "hidden"
    );

    emptyMessage.classList.add(
        "hidden"
    );

    commentsGrid.innerHTML = "";


    try {

        const response =
            await fetch(
                SCRIPT_URL +
                "?action=comments&t=" +
                Date.now()
            );


        if (!response.ok) {

            throw new Error(
                "Network response failed."
            );

        }


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.message ||
                "Unable to retrieve feedback."
            );

        }


        const comments =
            Array.isArray(data.comments)
                ? data.comments
                : [];


        loading.classList.add(
            "hidden"
        );


        feedbackCount.textContent =
            comments.length;


        // No feedback

        if (comments.length === 0) {

            emptyMessage.classList.remove(
                "hidden"
            );

            return;

        }


        // Create cards

        comments.forEach(
            createCommentCard
        );


    } catch (error) {

        console.error(
            "Comments error:",
            error
        );


        loading.classList.add(
            "hidden"
        );


        errorMessage.classList.remove(
            "hidden"
        );

    }

}


// ========================================
// CREATE COMMENT CARD
// ========================================

function createCommentCard(comment) {

    const name =
        cleanValue(
            comment.name
        );


    const college =
        cleanValue(
            comment.college
        );


    const feedback =
        cleanValue(
            comment.feedback
        );


    // ------------------------------------
    // Determine display name
    // ------------------------------------

    let displayName = "";

    let displayCollege = "";


    if (name && college) {

        displayName = name;

        displayCollege = college;

    }

    else if (name) {

        displayName = name;

    }

    else if (college) {

        displayName =
            college;

    }

    else {

        displayName =
            "Anonymous";

    }


    // ------------------------------------
    // Card
    // ------------------------------------

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "comment-card";


    // ------------------------------------
    // Person
    // ------------------------------------

    const person =
        document.createElement(
            "div"
        );


    person.className =
        "comment-person";


    const nameElement =
        document.createElement(
            "div"
        );


    nameElement.className =
        "comment-name";


    nameElement.textContent =
        displayName;


    person.appendChild(
        nameElement
    );


    // College appears only when
    // name + college are both provided.

    if (displayCollege) {

        const collegeElement =
            document.createElement(
                "div"
            );


        collegeElement.className =
            "comment-college";


        collegeElement.textContent =
            displayCollege;


        person.appendChild(
            collegeElement
        );

    }


    // ------------------------------------
    // Quote mark
    // ------------------------------------

    const quote =
        document.createElement(
            "div"
        );


    quote.className =
        "quote-mark";


    quote.textContent =
        "“";


    // ------------------------------------
    // Feedback
    // ------------------------------------

    const text =
        document.createElement(
            "div"
        );


    text.className =
        "comment-text";


    text.textContent =
        feedback;


    // ------------------------------------
    // Assemble
    // ------------------------------------

    card.appendChild(
        person
    );


    card.appendChild(
        quote
    );


    card.appendChild(
        text
    );


    commentsGrid.appendChild(
        card
    );

}


// ========================================
// CLEAN VALUES
// ========================================

function cleanValue(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value).trim();

}


// ========================================
// RETRY
// ========================================

retryButton.addEventListener(
    "click",
    loadComments
);


// ========================================
// INITIAL LOAD
// ========================================

loadComments();