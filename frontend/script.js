const API_URL = 'https://ai-article-analyzer-agent-backend.onrender.com';

// DOM Elements
const form = document.getElementById('analyzerForm');
const emailInput = document.getElementById('email');
const articleUrlInput = document.getElementById('articleUrl');
const submitBtn = document.getElementById('submitBtn');
const loader = document.getElementById('loader');
const messageArea = document.getElementById('messageArea');
const emailError = document.getElementById('emailError');
const urlError = document.getElementById('urlError');
const inlineLoading = document.getElementById('inlineLoading');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// URL validation regex
const urlRegex = /^https?:\/\/.+\..+/;

// Clear error messages
function clearErrors() {
    emailError.textContent = '';
    urlError.textContent = '';
    messageArea.innerHTML = '';
    messageArea.className = 'message-area';
}

// Validate form inputs
function validateInputs() {
    let isValid = true;
    clearErrors();

    const email = emailInput.value.trim();
    const articleUrl = articleUrlInput.value.trim();

    if (!email) {
        emailError.textContent = 'Email is required';
        isValid = false;
    } else if (!emailRegex.test(email)) {
        emailError.textContent = 'Please enter a valid email address';
        isValid = false;
    }

    if (!articleUrl) {
        urlError.textContent = 'Article URL is required';
        isValid = false;
    } else if (!urlRegex.test(articleUrl)) {
        urlError.textContent = 'Please enter a valid URL (must start with http:// or https://)';
        isValid = false;
    }

    return isValid;
}

// Show loading state
function setLoading(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        loader.style.display = 'inline-block';
        document.querySelector('.btn-text').textContent = 'Processing...';
    } else {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        loader.style.display = 'none';
        document.querySelector('.btn-text').textContent = 'Analyze Article';
    }
}

// Show success message
function showSuccess(sessionId) {
    // Hide loading bar
    inlineLoading.classList.remove('active');
    
    messageArea.className = 'message-area success';
    messageArea.innerHTML = `
        <div class="message-icon">✅</div>
        <h3>Request Submitted Successfully!</h3>
        <p>Your article analysis request has been submitted.</p>
        <p class="email-note">Please check your email in a few seconds for the analysis results.</p>
        <p class="session-id">Session ID: <code>${sessionId}</code></p>
    `;
    messageArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Show error message
function showError(message) {
    // Hide loading bar
    inlineLoading.classList.remove('active');
    
    messageArea.className = 'message-area error';
    messageArea.innerHTML = `
        <div class="message-icon">❌</div>
        <h3>Submission Failed</h3>
        <p>${message}</p>
        <p class="retry-note">Please check your inputs and try again.</p>
    `;
    messageArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Handle form submission
async function handleSubmit(e) {
    e.preventDefault();

    // Validate inputs
    if (!validateInputs()) {
        return;
    }

    // Get form data
    const email = emailInput.value.trim();
    const article_url = articleUrlInput.value.trim();

    // Show loading state
    setLoading(true);
    clearErrors();
    
    // Show inline loading bar below button
    inlineLoading.classList.add('active');
    
    // Wait for loading animation to complete (3 seconds) before making request
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
        // Send POST request to backend
        const response = await fetch(`${API_URL}/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                article_url: article_url
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Show success message
            showSuccess(data.session_id);
            
            // Reset form
            form.reset();
        } else {
            // Show error message with more details
            const errorMessage = data.detail || data.message || 'An unexpected error occurred. Please try again.';
            showError(errorMessage);
        }

    } catch (error) {
        console.error('Error:', error);
        showError('Unable to connect to the server. Please check if the backend is running.');
    } finally {
        // Hide loading state
        setLoading(false);
    }
}

// Add input event listeners to clear errors on type
emailInput.addEventListener('input', () => {
    emailError.textContent = '';
});

articleUrlInput.addEventListener('input', () => {
    urlError.textContent = '';
});

// Attach form submit handler
form.addEventListener('submit', handleSubmit);
