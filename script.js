
// ========================================
// CONFIGURATION
// ========================================

const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbx_vKlG0gPJKDkmfrt0CYcLGucuMaBsuILRK_LkhQGY6dVJ6HFKauZN8rKLP8pi-Qcy/exec";

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
// THEME TOGGLE
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

    if (phoneInput.value.length > 10) {

        phoneInput.value =
            phoneInput.value.substring(0, 10);
    }
});


// ========================================
// FORM SUBMISSION
// ========================================

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    statusMessage.textContent = "";
    statusMessage.className = "status-message";


    // ------------------------------------
    // Get form values
    // ------------------------------------

    const fullName =
        document.getElementById("fullName")
        .value.trim();

    const district =
        document.getElementById("district")
        .value;

    const collegeName =
        document.getElementById("collegeName")
        .value.trim();

    const gender =
        document.querySelector(
            'input[name="gender"]:checked'
        )?.value;

    const course =
        document.getElementById("course")
        .value.trim();

    const phone =
        document.getElementById("phone")
        .value.trim();


    // ------------------------------------
    // Validation
    // ------------------------------------

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

        return;
    }


    if (!/^[6-9][0-9]{9}$/.test(phone)) {

        showError(
            "Please enter a valid 10-digit Indian mobile number."
        );

        return;
    }


    // ------------------------------------
    // Loading state
    // ------------------------------------

    submitButton.disabled = true;

    buttonText.textContent =
        "Registering...";

    loader.classList.remove("hidden");


    // ------------------------------------
    // Prepare form data
    // ------------------------------------

    const formData = new URLSearchParams();

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


    try {

        // --------------------------------
        // Send to Google Apps Script
        // --------------------------------

        const response = await fetch(
            SCRIPT_URL,
            {
                method: "POST",

                body: formData
            }
        );


        const text =
            await response.text();

        console.log(
            "Apps Script response:",
            text
        );


        let result;

        try {

            result =
                JSON.parse(text);

        } catch (error) {

            console.error(
                "Invalid Apps Script response:",
                text
            );

            throw new Error(
                "Invalid response from Google Apps Script."
            );
        }


        // --------------------------------
        // Registration successful
        // --------------------------------

        if (result.success) {

            buttonText.textContent =
                "Registration Successful";

            loader.classList.add("hidden");


            // Immediately redirect.
            // No artificial delay.

            if (gender === "Male") {

                window.location.href =
                    BOYS_GROUP;

            } else {

                window.location.href =
                    GIRLS_GROUP;
            }

        } else {

            throw new Error(
                result.message ||
                "Registration failed."
            );
        }


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );


        showError(
            "Unable to complete registration. Please try again."
        );


        submitButton.disabled = false;

        buttonText.textContent =
            "Register Now";

        loader.classList.add("hidden");
    }

});


// ========================================
// ERROR MESSAGE
// ========================================

function showError(message) {

    statusMessage.textContent =
        message;

    statusMessage.className =
        "status-message error";
}