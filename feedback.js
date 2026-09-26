// ========================================
// CONFIGURATION
// ========================================

const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzmJjjrOr5lZNn2iJVuKv5Tkjh-wYFjI1-rjCc8BOkqd2IPo7gq-tJn4PosOjJWceoKHg/exec";


// ========================================
// ELEMENTS
// ========================================

const form =
    document.getElementById("feedbackForm");

const feedback =
    document.getElementById("feedback");

const characterCount =
    document.getElementById("characterCount");

const submitButton =
    document.getElementById("submitButton");

const buttonText =
    document.getElementById("buttonText");

const loader =
    document.getElementById("loader");

const statusMessage =
    document.getElementById("statusMessage");

const formSection =
    document.getElementById(
        "feedbackFormSection"
    );

const successMessage =
    document.getElementById(
        "successMessage"
    );

const themeToggle =
    document.getElementById(
        "themeToggle"
    );


// ========================================
// SUBMISSION LOCK
// ========================================

let isSubmitting = false;


// ========================================
// THEME
// ========================================

const savedTheme =
    localStorage.getItem(
        "decodeGateTheme"
    );


if (savedTheme === "dark") {

    document.body.classList.add("dark");

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
// CHARACTER COUNTER
// ========================================

feedback.addEventListener(
    "input",
    () => {

        characterCount.textContent =
            feedback.value.length;

    }
);


// ========================================
// SUBMIT
// ========================================

form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        // Prevent multiple submissions

        if (isSubmitting) {
            return;
        }


        const feedbackText =
            feedback.value.trim();


        if (!feedbackText) {

            showError(
                "Please enter your feedback."
            );

            return;
        }


        // Lock

        isSubmitting = true;

        submitButton.disabled = true;

        buttonText.textContent =
            "SUBMITTING...";

        loader.classList.remove(
            "hidden"
        );

        statusMessage.textContent = "";


        // Prepare data

        const formData =
            new URLSearchParams();


        formData.append(
            "action",
            "feedback"
        );


        formData.append(
            "feedback",
            feedbackText
        );


        try {

            const response =
                await fetch(
                    SCRIPT_URL,
                    {
                        method: "POST",
                        body: formData
                    }
                );


            const text =
                await response.text();


            console.log(
                "Feedback response:",
                text
            );


            const result =
                JSON.parse(text);


            if (!result.success) {

                throw new Error(
                    result.message ||
                    "Submission failed."
                );
            }


            // ==================================
            // SUCCESS
            // ==================================

            formSection.classList.add(
                "hidden"
            );

            successMessage.classList.remove(
                "hidden"
            );


        } catch (error) {

            console.error(
                "Feedback error:",
                error
            );


            showError(
                "Unable to submit your feedback. Please try again."
            );


            isSubmitting = false;

            submitButton.disabled = false;

            buttonText.textContent =
                "SUBMIT FEEDBACK";

            loader.classList.add(
                "hidden"
            );

        }

    }
);


// ========================================
// ERROR
// ========================================

function showError(message) {

    statusMessage.textContent =
        message;

    statusMessage.className =
        "status-message error";
}