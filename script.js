// ========================================
// CONFIGURATION
// ========================================

const SCRIPT_URL =
    "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";


// Replace these with your actual WhatsApp
// group invitation links.

const BOYS_GROUP =
    "https://chat.whatsapp.com/YOUR_BOYS_GROUP_LINK";

const GIRLS_GROUP =
    "https://chat.whatsapp.com/YOUR_GIRLS_GROUP_LINK";


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


    // ------------------------------
    // Get values
    // ------------------------------

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
        .value;

    const phone =
        document.getElementById("phone")
        .value.trim();


    // ------------------------------
    // Validation
    // ------------------------------

    if (!fullName ||
        !district ||
        !collegeName ||
        !gender ||
        !course ||
        !phone) {

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


    // ------------------------------
    // Loading state
    // ------------------------------

    submitButton.disabled = true;

    buttonText.textContent =
        "Registering...";

    loader.classList.remove("hidden");


    // ------------------------------
    // Prepare data
    // ------------------------------

    const formData = new URLSearchParams();

    formData.append("fullName", fullName);
    formData.append("district", district);
    formData.append("collegeName", collegeName);
    formData.append("gender", gender);
    formData.append("course", course);
    formData.append("phone", phone);


    try {

        // ------------------------------
        // Send to Google Apps Script
        // ------------------------------

        const response = await fetch(
            SCRIPT_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded;charset=UTF-8"
                },

                body: formData.toString()
            }
        );


        const result =
            await response.json();


        // ------------------------------
        // Successful registration
        // ------------------------------

        if (result.success) {

            buttonText.textContent =
                "Registration Successful";

            statusMessage.textContent =
                "Registration successful. Redirecting to WhatsApp...";


            // Give the Sheet a moment to finish,
            // then redirect.

            setTimeout(() => {

                if (gender === "Male") {

                    window.location.href =
                        BOYS_GROUP;

                } else {

                    window.location.href =
                        GIRLS_GROUP;
                }

            }, 800);


        } else {

            throw new Error(
                result.message ||
                "Registration failed."
            );
        }


    } catch (error) {

        console.error(error);

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