// ========================================
// CONFIGURATION
// ========================================

const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwxZC9NXl85B9UiRzMtjDkqCkmK6P_EIzT9CzRAw7Q_i_eEcoWR8XiAx6NIle9fp9w4lQ/exec";

const BOYS_GROUP =
    "https://chat.whatsapp.com/HON5ENECxTzD3eHO9seQNl";

const GIRLS_GROUP =
    "https://chat.whatsapp.com/JLQ4GkJVvnX3iwTXCq1p26";


// ========================================
// ELEMENTS
// ========================================

const form =
    document.getElementById("registrationForm");

const submitButton =
    document.getElementById("submitButton");

const buttonText =
    document.getElementById("buttonText");

const loader =
    document.getElementById("loader");

const statusMessage =
    document.getElementById("statusMessage");

const themeToggle =
    document.getElementById("themeToggle");


// ========================================
// SUBMISSION LOCK
// ========================================

// This is extremely important.
//
// Once submission starts, this becomes true.
// Even if the user clicks 10 times,
// only ONE request will be sent.

let isSubmitting = false;


// ========================================
// THEME
// ========================================

const savedTheme =
    localStorage.getItem("decodeGateTheme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeToggle.textContent = "☀";

} else {

    themeToggle.textContent = "☾";
}


themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const isDark =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "decodeGateTheme",
        isDark ? "dark" : "light"
    );

    themeToggle.textContent =
        isDark ? "☀" : "☾";
});


// ========================================
// PHONE INPUT
// ========================================

const phoneInput =
    document.getElementById("phone");

phoneInput.addEventListener("input", () => {

    phoneInput.value =
        phoneInput.value.replace(/\D/g, "");

});


// ========================================
// FORM SUBMISSION
// ========================================

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // ====================================
        // STOP MULTIPLE SUBMISSIONS
        // ====================================

        if (isSubmitting) {
            return;
        }


        // Lock immediately

        isSubmitting = true;

        submitButton.disabled = true;

        form.classList.add("submitting");


        statusMessage.textContent = "";

        statusMessage.className =
            "status-message";


        // ====================================
        // GET VALUES
        // ====================================

        const fullName =
            document
                .getElementById("fullName")
                .value
                .trim();


        const district =
            document
                .getElementById("district")
                .value;


        const collegeName =
            document
                .getElementById("collegeName")
                .value
                .trim();


        const gender =
            document.querySelector(
                'input[name="gender"]:checked'
            )?.value;


        const course =
            document
                .getElementById("course")
                .value
                .trim();


        const phone =
            document
                .getElementById("phone")
                .value
                .trim();


        // ====================================
        // VALIDATION
        // ====================================

        if (
            !fullName ||
            !district ||
            !collegeName ||
            !gender ||
            !course ||
            !phone
        ) {

            showError(
                "Please fill in all the required fields."
            );

            unlockForm();

            return;
        }


        if (
            !/^[6-9][0-9]{9}$/.test(phone)
        ) {

            showError(
                "Please enter a valid 10-digit mobile number."
            );

            unlockForm();

            return;
        }


        // ====================================
        // SHOW LOADING
        // ====================================

        buttonText.textContent =
            "Submitting...";

        loader.classList.remove("hidden");


        // ====================================
        // PREPARE DATA
        // ====================================

        const formData =
            new URLSearchParams();

        formData.append(
            "fullName",
            fullName
        );

        formData.append(
            "district",
            district
        );

        formData.append(
            "collegeName",
            collegeName
        );

        formData.append(
            "gender",
            gender
        );

        formData.append(
            "course",
            course
        );

        formData.append(
            "phone",
            phone
        );


        // ====================================
        // SEND TO GOOGLE APPS SCRIPT
        // ====================================

        try {

            const response =
                await fetch(
                    SCRIPT_URL,
                    {
                        method: "POST",

                        body: formData,

                        // Allows the browser to keep
                        // the request alive during
                        // page navigation where supported.
                        keepalive: true
                    }
                );


            const text =
                await response.text();


            console.log(
                "Registration response:",
                text
            );


            let result;


            try {

                result =
                    JSON.parse(text);

            } catch (error) {

                throw new Error(
                    "Invalid server response."
                );
            }


            // ==================================
            // SUCCESS
            // ==================================

            if (result.success) {

                buttonText.textContent =
                    "Registered ✓";

                loader.classList.add(
                    "hidden"
                );


                statusMessage.textContent =
                    "Registration successful. Redirecting...";


                // No artificial 800ms / 1000ms delay.

                if (gender === "Male") {

                    window.location.replace(
                        BOYS_GROUP
                    );

                } else {

                    window.location.replace(
                        GIRLS_GROUP
                    );
                }


                return;
            }


            // ==================================
            // SERVER ERROR
            // ==================================

            throw new Error(
                result.message ||
                "Registration failed."
            );


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            showError(
                "Unable to complete registration. Please try again."
            );


            unlockForm();

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


// ========================================
// UNLOCK FORM
// ========================================

function unlockForm() {

    isSubmitting = false;

    submitButton.disabled = false;

    form.classList.remove(
        "submitting"
    );

    buttonText.textContent =
        "REGISTER NOW";

    loader.classList.add(
        "hidden"
    );
}