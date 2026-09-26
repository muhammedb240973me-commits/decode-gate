// ========================================
// CONFIGURATION
// ========================================

const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyq3AXGYICh4rqjEPzIDWHk00ifcTF3K1PMPqpQFGAQcCMJiElRJn9o5xwiZo1uUV97GA/exec";


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
// RATING SUMMARY
// ========================================

async function loadRatingSummary() {

    const ratingSummary =
        document.getElementById(
            "ratingSummary"
        );

    try {

        const response =
            await fetch(
                SCRIPT_URL +
                "?action=ratings&t=" +
                Date.now()
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load ratings."
            );
        }


        const result =
            await response.json();


        if (
            !result.success ||
            !result.averages
        ) {

            throw new Error(
                "Invalid rating data."
            );
        }


        const averages =
            result.averages;


        // Show section

        ratingSummary.classList.remove(
            "hidden"
        );


        // Individual ratings

        setRating(
            "speaker",
            averages.speaker
        );

        setRating(
            "clarity",
            averages.clarity
        );

        setRating(
            "usefulness",
            averages.usefulness
        );

        setRating(
            "overallExperience",
            averages.overall
        );

        setRating(
            "coordination",
            averages.coordination
        );


        // Overall average of all five categories

        const allRatings = [

            Number(averages.speaker),

            Number(averages.clarity),

            Number(averages.usefulness),

            Number(averages.overall),

            Number(averages.coordination)

        ].filter(function(value) {

            return value > 0;

        });


        if (allRatings.length > 0) {

            const overallAverage =
                allRatings.reduce(
                    function(total, value) {
                        return total + value;
                    },
                    0
                ) / allRatings.length;


            const rounded =
                Number(
                    overallAverage.toFixed(2)
                );


            document.getElementById(
                "overallAverage"
            ).textContent = rounded.toFixed(2);


            document.getElementById(
                "overallStars"
            ).textContent =
                createStars(rounded);

        }


    } catch (error) {

        console.error(
            "Rating error:",
            error
        );

        /*
         * Do not show an error message on the
         * public comments page.
         *
         * The comments can continue working
         * even if the rating chart fails.
         */

        ratingSummary.classList.add(
            "hidden"
        );

    }

}

// ========================================
// SET RATING
// ========================================

function setRating(
    name,
    value
) {

    const numericValue =
        Number(value);


    const averageElement =
        document.getElementById(
            name + "Average"
        );

    const barElement =
        document.getElementById(
            name + "Bar"
        );


    if (
        !averageElement ||
        !barElement ||
        !Number.isFinite(numericValue)
    ) {

        return;
    }


    averageElement.textContent =
        numericValue.toFixed(2);


    /*
     * 5 stars = 100%
     *
     * Example:
     * 4.5 / 5 = 90%
     */

    const percentage =
        Math.max(
            0,
            Math.min(
                100,
                (numericValue / 5) * 100
            )
        );


    barElement.style.width =
        percentage + "%";

}

// ========================================
// STAR DISPLAY
// ========================================

function createStars(
    rating
) {

    const rounded =
        Math.round(rating);

    const filled =
        Math.max(
            0,
            Math.min(
                5,
                rounded
            )
        );


    return (
        "★".repeat(filled) +
        "☆".repeat(5 - filled)
    );

}


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
loadRatingSummary();