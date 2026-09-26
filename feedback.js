// ========================================
// CONFIGURATION
// ========================================

const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyq3AXGYICh4rqjEPzIDWHk00ifcTF3K1PMPqpQFGAQcCMJiElRJn9o5xwiZo1uUV97GA/exec";


// ========================================
// ELEMENTS
// ========================================

const form =
    document.getElementById("feedbackForm");

const nameInput =
    document.getElementById("name");

const collegeInput =
    document.getElementById("college");

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

const speakerRating =
    document.getElementById("speakerRating");

const clarityRating =
    document.getElementById("clarityRating");

const usefulnessRating =
    document.getElementById("usefulnessRating");

const overallRating =
    document.getElementById("overallRating");

const coordinationRating =
    document.getElementById("coordinationRating");


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
// STAR RATINGS
// ========================================

const ratingLabels = {
    1: "⭐ Very Poor",
    2: "⭐⭐ Poor",
    3: "⭐⭐⭐ Average",
    4: "⭐⭐⭐⭐ Good",
    5: "⭐⭐⭐⭐⭐ Excellent"
};


document.querySelectorAll(".star-rating")
    .forEach(function(ratingGroup) {

        const buttons =
            ratingGroup.querySelectorAll("button");

        const ratingName =
            ratingGroup.dataset.rating;

        const hiddenInput =
            document.getElementById(
                ratingName + "Rating"
            );

        const label =
            document.getElementById(
                ratingName + "Label"
            );


        buttons.forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    const value =
                        Number(
                            button.dataset.value
                        );


                    // Store numeric value
                    hiddenInput.value =
                        value;


                    // Highlight stars
                    buttons.forEach(
                        function(star) {

                            const starValue =
                                Number(
                                    star.dataset.value
                                );

                            star.classList.toggle(
                                "active",
                                starValue <= value
                            );

                        }
                    );


                    // Show selected rating
                    label.textContent =
                        ratingLabels[value];

                }
            );

        });

    });

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

        const name =
            nameInput.value.trim();

        const college =
            collegeInput.value.trim();

        const feedbackText =
            feedback.value.trim();

        const speaker =
            speakerRating.value;
        
        const clarity =
            clarityRating.value;

        const usefulness =
            usefulnessRating.value;

        const overall =
            overallRating.value;

        const coordination =
            coordinationRating.value;



        if (!feedbackText) {

            showError(
                "Please enter your feedback."
            );

            return;
        }

        if (
            !speaker ||
            !clarity ||
            !usefulness ||
            !overall ||
            !coordination
        ) {

            showError(
                "Please rate all five aspects before submitting."
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



        // Prepare data

        const formData =
            new URLSearchParams();

        formData.append(
            "name",
            name
        );
        
        formData.append(
            "college",
            college
        );

        formData.append(
            "speakerRating",
            speaker
        );

        formData.append(
            "clarityRating",
            clarity
        );

        formData.append(
            "usefulnessRating",
            usefulness
        );

        formData.append(
            "overallRating",
            overall
        );

        formData.append(
            "coordinationRating",
            coordination
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