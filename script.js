// Function to retrieve user location
function getLocation() {
    if (navigator.geolocation) {
        console.log("Geolocation API available, requesting location...");
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Display user location in the form
function showPosition(position) {
    console.log("Position retrieved:", position.coords.latitude, position.coords.longitude);
    document.getElementById("latitude").textContent = position.coords.latitude;
    document.getElementById("longitude").textContent = position.coords.longitude;
    document.getElementById("latitude").setAttribute("data-lat", position.coords.latitude);
    document.getElementById("longitude").setAttribute("data-lon", position.coords.longitude);
}

// Handle geolocation errors
function showError(error) {
    const errorMessages = {
        1: "User denied the request for Geolocation.",
        2: "Location information is unavailable.",
        3: "The request to get user location timed out.",
        4: "An unknown error occurred."
    };
    alert(errorMessages[error.code] || errorMessages[4]);
}

// Show or hide PT access mode dropdown based on travel mode selection
function showPTAccess() {
    const travelMode = document.getElementById("travel_mode").value;
    const ptAccessMode = document.getElementById("pt_access_mode");

    if (travelMode === "metro" || travelMode === "bus") {
        ptAccessMode.style.display = "block";
    } else {
        ptAccessMode.style.display = "none";
        document.getElementById("access_mode").value = "none";
    }
}

// Validate form inputs
function validateForm() {
    const requiredFields = [
        "landmark", "origin", "destination", "travel_mode", "frequency",
        "purpose", "distance", "health_effects_awareness", "health_issues",
        "aqi_exposure", "aqi_awareness", "aqi_info_source", "aqi_frequency",
        "aqi_actions", "gender", "age", "occupation", "education", "income", "household_size"
    ];

    let isValid = true;

    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value || field.value.trim() === "") {
            field.style.border = "2px solid red";
            isValid = false;
        } else {
            field.style.border = "";
        }
    });

    const drivingLicense = document.querySelector("input[name='driving_license']:checked");
    if (!drivingLicense) {
        alert("Please select whether you have a driving license.");
        isValid = false;
    }

    if (!isValid) {
        alert("Please fill out all required fields.");
    }

    return isValid;
}

// Collect form data
function collectSurveyData() {
    const latitude = document.getElementById("latitude").getAttribute("data-lat") || "Not available";
    const longitude = document.getElementById("longitude").getAttribute("data-lon") || "Not available";
    const accessMode = document.getElementById("pt_access_mode").style.display === "block"
        ? document.getElementById("access_mode").value
        : "none";

    // Collect Likert scale responses dynamically
    const likertQuestions = [
        "info_about_air_pollution", "check_air_pollution_apps", "air_quality_influences_trip",
        "air_pollution_impact_health", "public_transport_lower_pollution", "prefer_public_transport_reduce_pollution",
        "public_transport_cleaner_environment", "reduce_private_vehicle_use", "pollution_exposure_current_mode",
        "switch_to_public_transport", "take_route_reduce_pollution", "avoid_high_traffic_pollution",
        "take_greener_route", "real_time_info_influence_choice", "switch_to_public_transport_greener",
        "tech_tools_avoid_pollution", "ride_ev_reduce_pollution"
    ];

    const likertResponses = {};
    likertQuestions.forEach(question => {
        const response = document.querySelector(`input[name="${question}"]:checked`);
        likertResponses[question] = response ? response.value : null;
    });

    // Collect symptoms
    const symptoms = [];
    document.querySelectorAll("input[type='checkbox']:checked").forEach(checkbox => {
        symptoms.push(checkbox.value);
    });

    return {
        latitude,
        longitude,
        landmark: document.getElementById("landmark").value || "Not specified",
        origin: document.getElementById("origin").value,
        destination: document.getElementById("destination").value,
        travelMode: document.getElementById("travel_mode").value,
        accessMode,
        frequency: document.getElementById("frequency").value,
        purpose: document.getElementById("purpose").value,
        distance: document.getElementById("distance").value,
        healthEffectsAwareness: document.getElementById("health_effects_awareness").value,
        healthIssues: document.getElementById("health_issues").value,
        aqiExposure: document.getElementById("aqi_exposure").value,
        aqiAwareness: document.getElementById("aqi_awareness").value,
        aqiInfoSource: document.getElementById("aqi_info_source").value,
        aqiFrequency: document.getElementById("aqi_frequency").value,
        aqiActions: document.getElementById("aqi_actions").value,
        otherSymptoms: document.getElementById("other_symptoms").value || "None",
        symptoms,
        likertResponses,
        socioDemographic: {
            gender: document.getElementById("gender").value,
            age: document.getElementById("age").value,
            occupation: document.getElementById("occupation").value,
            education: document.getElementById("education").value,
            income: document.getElementById("income").value,
            householdSize: document.getElementById("household_size").value,
            vehicles: {
                cars: document.getElementById("car_count").value || 0,
                twoWheelers: document.getElementById("two_wheeler_count").value || 0,
                bicycles: document.getElementById("bicycle_count").value || 0
            },
            drivingLicense: document.querySelector("input[name='driving_license']:checked")
                ? document.querySelector("input[name='driving_license']:checked").value
                : "Not answered"
        }
    };
}




// Submit survey data
async function submitSurvey() {
    if (!validateForm()) return;

    const surveyData = collectSurveyData();
    console.log("Survey Data:", surveyData);

 try {
        const response = await fetch('https://survey-backend-zsdp.onrender.com/submit-survey', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(surveyData),
});

        if (response.ok) {
            alert("Survey submitted successfully!");
        } else {
            alert("Failed to submit survey");
        }
    } catch (error) {
        console.error("Error submitting survey:", error);
        alert("There was an error submitting the survey.");
    }
}
