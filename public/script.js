/* ============================================= */
/* TRUSTNET.AI - CYBER SAFETY PLATFORM           */
/* JavaScript Functionality                       */
/* ============================================= */

/* ============================================= */
/* GLOBAL VARIABLES */
/* ============================================= */

// Current language state (en = English, mr = Marathi)
let currentLang = 'en';

// Selected file for analysis
let selectedFile = null;
let currentTab = 'images';

// Tab configuration
const tabConfigs = {
    images: {
        icon: '🖼️',
        title: 'Drop your image here',
        formats: 'Supported: JPG, PNG, WEBP, GIF (Max 10MB)',
        accept: 'image/*'
    },
    voices: {
        icon: '🎙️',
        title: 'Drop your audio here',
        formats: 'Supported: MP3, WAV, M4A (Max 10MB)',
        accept: 'audio/*'
    },
    videos: {
        icon: '🎬',
        title: 'Drop your video here',
        formats: 'Supported: MP4, MOV, AVI (Max 20MB)',
        accept: 'video/*'
    },
    messages: {
        icon: '💬',
        title: 'Analyze Text Message',
        formats: 'Paste suspicious links or text',
        accept: ''
    }
};

/**
 * Switch between detection tabs
 * @param {string} tabId - ID of the tab to switch to
 */
function switchTab(tabId) {
    currentTab = tabId;
    
    // Update active button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase().includes(tabId)) {
            btn.classList.add('active');
        }
    });

    // Reset state
    removeFile();
    
    const mediaUploadTool = document.getElementById('mediaUploadTool');
    const textAnalysisTool = document.getElementById('textAnalysisTool');
    const tabIcon = document.getElementById('tabIcon');
    const tabTitle = document.getElementById('tabTitle');
    const tabFormats = document.getElementById('tabFormats');
    const mediaInput = document.getElementById('mediaInput');
    const analyzeBtnText = document.querySelector('#analyzeBtn .btn-text');

    if (tabId === 'messages') {
        mediaUploadTool.style.display = 'none';
        textAnalysisTool.style.display = 'block';
        analyzeBtnText.textContent = 'Analyze Message';
    } else {
        mediaUploadTool.style.display = 'block';
        textAnalysisTool.style.display = 'none';
        analyzeBtnText.textContent = `Analyze ${tabId.charAt(0).toUpperCase() + tabId.slice(0, -1)}`;
        
        // Update upload zone UI
        const config = tabConfigs[tabId];
        if (tabIcon) tabIcon.textContent = config.icon;
        if (tabTitle) tabTitle.textContent = config.title;
        if (tabFormats) tabFormats.textContent = config.formats;
        if (mediaInput) mediaInput.accept = config.accept;
    }
    
    resetResultBox();
}

// Marathi translations for key elements
const translations = {
    en: {
        heroTitle: 'Protecting Maharashtra from <span class="hero-highlight">AI-Powered</span> Cyber Threats',
        heroDesc: 'A citizen-focused cyber safety platform designed to detect AI deepfake images, voice scams, impersonation messages, and digital misinformation. Empowering 12+ crore citizens of Maharashtra with cutting-edge AI defense technology.',
        visionTitle: 'Building a Safer Digital Maharashtra',
        problemTitle: 'The Growing Threat of AI-Powered Cyber Crime',
        solutionTitle: 'Comprehensive AI Defense Solution',
        detectionTitle: 'AI Media Detection Tool',
        awarenessTitle: 'Awareness & Education',
        langButton: 'मराठी',
        navHome: 'Home',
        navVision: 'Vision',
        navProblem: 'Problem',
        navSolution: 'Solution',
        navDetection: 'Detection',
        navWorkflow: 'Workflow',
        navImpact: 'Impact',
        navAwareness: 'Awareness',
        navEthics: 'Ethics',
        navLogin: 'Login',
        startDetection: 'Start Detection',
        learnMore: 'Learn More',
        analyzeContent: 'Analyze Content',
        subscriptionTitle: 'Subscription Plans',
        subscriptionSubtitle: 'Get advanced protection and priority support for your digital safety',
        subscribeNow: 'Subscribe Now',
        footerEmergency: 'Emergency Helpline:',
        chatbotTitle: 'Help & Support',
        chatbotPlaceholder: 'Type your question...'
    },
    mr: {
        heroTitle: '<span class="hero-highlight">AI-संचालित</span> सायबर धोक्यांपासून महाराष्ट्राचे संरक्षण',
        heroDesc: 'AI डीपफेक प्रतिमा, व्हॉइस स्कॅम, तोतयागिरी संदेश आणि डिजिटल चुकीची माहिती शोधण्यासाठी डिझाइन केलेले नागरिक-केंद्रित सायबर सुरक्षा प्लॅटफॉर्म. अत्याधुनिक AI संरक्षण तंत्रज्ञानासह महाराष्ट्रातील 12+ कोटी नागरिकांना सक्षम करणे.',
        visionTitle: 'सुरक्षित डिजिटल महाराष्ट्र निर्माण करणे',
        problemTitle: 'AI-संचालित सायबर गुन्हेगारीचा वाढता धोका',
        solutionTitle: 'व्यापक AI संरक्षण उपाय',
        detectionTitle: 'AI मीडिया शोध साधन',
        awarenessTitle: 'जागरूकता आणि शिक्षण',
        langButton: 'English',
        navHome: 'मुख्यपृष्ठ',
        navVision: 'दृष्टी',
        navProblem: 'समस्या',
        navSolution: 'उपाय',
        navDetection: 'शोध',
        navWorkflow: 'कार्यप्रवाह',
        navImpact: 'प्रभाव',
        navAwareness: 'जागरूकता',
        navEthics: 'नैतिकता',
        navLogin: 'लॉगिन',
        startDetection: 'शोध सुरू करा',
        learnMore: 'अधिक जाणून घ्या',
        analyzeContent: 'सामग्री विश्लेषण करा',
        subscriptionTitle: 'सदस्यता योजना',
        subscriptionSubtitle: 'तुमच्या डिजिटल सुरक्षिततेसाठी प्रगत संरक्षण आणि प्राधान्य समर्थन मिळवा',
        subscribeNow: 'आता सदस्यता घ्या',
        footerEmergency: 'आणीबाणी हेल्पलाइन:',
        chatbotTitle: 'मदत आणि समर्थन',
        chatbotPlaceholder: 'तुमचा प्रश्न टाइप करा...'
    }
};

/* ============================================= */
/* INITIALIZATION */
/* ============================================= */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('TrustNet.Ai - Platform Initialized');
    
    // Initialize all components
    initNavigation();
    initFileUpload();
    initCounterAnimation();
    initSmoothScroll();
    initScrollEffects();
    initSubscriptions();
    checkAuthState(); // Check if user is logged in
});

/* ============================================= */
/* AUTHENTICATION FUNCTIONS */
/* ============================================= */

/**
 * Check if user is logged in and update UI
 */
function checkAuthState() {
    const session = localStorage.getItem('trustnet_session');
    const loginNavItem = document.getElementById('loginNavItem');
    const userNavItem = document.getElementById('userNavItem');
    const userEmailNav = document.getElementById('userEmailNav');

    if (session) {
        const data = JSON.parse(session);
        // If session is less than 24 hours old
        if (new Date().getTime() - data.timestamp < 24 * 60 * 60 * 1000) {
            if (loginNavItem) loginNavItem.style.display = 'none';
            if (userNavItem) userNavItem.style.display = 'block';
            if (userEmailNav) userEmailNav.textContent = data.email;
            
            // Show welcome message if just logged in
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('login') === 'success') {
                showNotification(`Welcome back, ${data.email.split('@')[0]}!`);
                // Clear the query param without refreshing
                window.history.replaceState({}, document.title, window.location.pathname);
            }
            return;
        } else {
            // Session expired
            localStorage.removeItem('trustnet_session');
        }
    }

    if (loginNavItem) loginNavItem.style.display = 'block';
    if (userNavItem) userNavItem.style.display = 'none';
}

/**
 * Logout the user
 */
function logout() {
    localStorage.removeItem('trustnet_session');
    showNotification('Logged out successfully');
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

/* ============================================= */
/* NAVIGATION FUNCTIONS */
/* ============================================= */

/**
 * Initialize navigation functionality
 * Handles mobile menu toggle and active states
 */
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && navToggle) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
    });
    
    // Update active nav link on scroll
    updateActiveNavOnScroll();
}

/**
 * Update active navigation link based on scroll position
 */
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

/* ============================================= */
/* SCROLL FUNCTIONS */
/* ============================================= */

/**
 * Smooth scroll to Detection section
 * Called from CTA button in hero section
 */
function scrollToDetect() {
    const detectionSection = document.getElementById('detection');
    
    if (detectionSection) {
        const headerOffset = 100;
        const elementPosition = detectionSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * Initialize smooth scrolling for all anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just '#'
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize scroll-based effects
 */
function initScrollEffects() {
    // Header background on scroll
    const header = document.getElementById('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(10, 10, 15, 0.98)';
            } else {
                header.style.background = 'rgba(10, 10, 15, 0.95)';
            }
        });
    }
}

/* ============================================= */
/* LANGUAGE TOGGLE */
/* ============================================= */

/**
 * Toggle between English and Marathi
 * Updates text content throughout the page
 */
function toggleLang() {
    // Switch language
    currentLang = currentLang === 'en' ? 'mr' : 'en';
    
    // Get translation set
    const trans = translations[currentLang];
    
    // Update language button text
    const langText = document.getElementById('langTextBottom');
    if (langText) {
        langText.textContent = trans.langButton;
    }
    
    // Update page content - main sections
    updateElement('heroTitle', trans.heroTitle);
    updateElement('heroDesc', trans.heroDesc);
    updateElement('visionTitle', trans.visionTitle);
    updateElement('problemTitle', trans.problemTitle);
    updateElement('solutionTitle', trans.solutionTitle);
    updateElement('detectionTitle', trans.detectionTitle);
    updateElement('awarenessTitle', trans.awarenessTitle);
    
    // Update navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === '#home') link.textContent = trans.navHome;
        else if (href === '#vision') link.textContent = trans.navVision;
        else if (href === '#problem') link.textContent = trans.navProblem;
        else if (href === '#solution') link.textContent = trans.navSolution;
        else if (href === '#detection') link.textContent = trans.navDetection;
        else if (href === '#workflow') link.textContent = trans.navWorkflow;
        else if (href === '#impact') link.textContent = trans.navImpact;
        else if (href === '#awareness') link.textContent = trans.navAwareness;
        else if (href === '#ethics') link.textContent = trans.navEthics;
        else if (href === '/login') link.textContent = trans.navLogin;
    });
    
    // Update hero buttons
    const startDetectionBtn = document.querySelector('.hero-actions .btn-primary .btn-text');
    if (startDetectionBtn) startDetectionBtn.textContent = trans.startDetection;
    
    const learnMoreBtn = document.querySelector('.hero-actions .btn-secondary .btn-text');
    if (learnMoreBtn) learnMoreBtn.textContent = trans.learnMore;
    
    // Update subscription section
    const subscriptionTitle = document.querySelector('.section-subscription .section-title');
    if (subscriptionTitle) subscriptionTitle.textContent = trans.subscriptionTitle;
    
    const subscriptionSubtitle = document.querySelector('.section-subscription .section-subtitle');
    if (subscriptionSubtitle) subscriptionSubtitle.textContent = trans.subscriptionSubtitle;
    
    // Update subscribe buttons
    const subscribeBtns = document.querySelectorAll('.subscribe-btn');
    subscribeBtns.forEach(btn => {
        btn.textContent = trans.subscribeNow;
    });
    
    // Update chatbot if it exists
    const chatbotHeader = document.querySelector('.chatbot-header-title');
    if (chatbotHeader) chatbotHeader.textContent = trans.chatbotTitle;
    
    const chatbotInput = document.querySelector('.chatbot-input');
    if (chatbotInput) chatbotInput.placeholder = trans.chatbotPlaceholder;
    
    // Show notification
    const message = currentLang === 'mr' 
        ? 'भाषा मराठी मध्ये बदलली' 
        : 'Language changed to English';
    
    showNotification(message);
}

/**
 * Helper function to update element content
 * @param {string} id - Element ID
 * @param {string} content - New HTML content
 */
function updateElement(id, content) {
    const element = document.getElementById(id);
    if (element) {
        element.innerHTML = content;
    }
}

/**
 * Show a temporary notification
 * @param {string} message - Message to display
 */
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 16px 24px;
        background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%);
        color: #0a0a0f;
        font-weight: 600;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3);
    `;
    notification.textContent = message;
    
    // Add animation keyframes if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/* ============================================= */
/* FILE UPLOAD FUNCTIONS */
/* ============================================= */

/**
 * Initialize file upload functionality
 * Handles drag & drop and click-to-upload
 */
function initFileUpload() {
    const uploadZone = document.getElementById('uploadZone');
    const mediaInput = document.getElementById('mediaInput');
    const uploadPreview = document.getElementById('uploadPreview');
    const previewImage = document.getElementById('previewImage');
    const previewAudio = document.getElementById('previewAudio');
    const audioFileName = document.getElementById('audioFileName');
    
    if (!uploadZone || !mediaInput) return;
    
    // Handle file selection
    mediaInput.addEventListener('change', function(e) {
        handleFileSelect(e.target.files[0]);
    });
    
    // Drag and drop handlers
    uploadZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    });
    
    uploadZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
    });
    
    uploadZone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    });
}

/**
 * Handle file selection
 * @param {File} file - Selected file
 */
function handleFileSelect(file) {
    if (!file) return;
    
    // Validate file size
    const maxSize = currentTab === 'videos' ? 20 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
        showNotification(`File too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`);
        return;
    }
    
    // Store selected file
    selectedFile = file;
    
    // Show preview
    const uploadZone = document.getElementById('uploadZone');
    const uploadPreview = document.getElementById('uploadPreview');
    const previewImage = document.getElementById('previewImage');
    const previewAudio = document.getElementById('previewAudio');
    const previewVideo = document.getElementById('previewVideo');
    const audioFileName = document.getElementById('audioFileName');
    const videoFileName = document.getElementById('videoFileName');
    
    uploadZone.style.display = 'none';
    uploadPreview.classList.add('active');
    
    // Reset all previews
    previewImage.style.display = 'none';
    previewAudio.classList.remove('active');
    previewVideo.style.display = 'none';
    
    if (file.type.startsWith('image/')) {
        previewImage.style.display = 'block';
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else if (file.type.startsWith('audio/')) {
        previewAudio.classList.add('active');
        audioFileName.textContent = file.name;
    } else if (file.type.startsWith('video/')) {
        previewVideo.style.display = 'block';
        videoFileName.textContent = file.name;
    }
    
    resetResultBox();
}

/**
 * Remove selected file and reset upload area
 */
function removeFile() {
    selectedFile = null;
    
    const uploadZone = document.getElementById('uploadZone');
    const uploadPreview = document.getElementById('uploadPreview');
    const mediaInput = document.getElementById('mediaInput');
    const previewImage = document.getElementById('previewImage');
    const previewAudio = document.getElementById('previewAudio');
    const previewVideo = document.getElementById('previewVideo');
    const messageInput = document.getElementById('messageInput');
    
    if (uploadZone) uploadZone.style.display = 'block';
    if (uploadPreview) uploadPreview.classList.remove('active');
    if (previewImage) previewImage.style.display = 'none';
    if (previewAudio) previewAudio.classList.remove('active');
    if (previewVideo) previewVideo.style.display = 'none';
    
    if (mediaInput) {
        mediaInput.value = '';
    }
    if (messageInput) {
        messageInput.value = '';
    }
    
    resetResultBox();
}

/**
 * Reset the result box to default state
 */
function resetResultBox() {
    const resultBox = document.getElementById('resultBox');
    const resultIcon = document.getElementById('resultIcon');
    const resultDetails = document.getElementById('resultDetails');
    const confidenceBar = document.getElementById('confidenceBar');
    
    if (resultBox) {
        resultBox.textContent = 'Upload a file and click "Analyze Media" to see results here.';
        resultBox.className = 'result-box';
    }
    
    if (resultIcon) {
        resultIcon.textContent = '📊';
    }
    
    if (resultDetails) {
        resultDetails.classList.remove('active');
    }
    
    if (confidenceBar) {
        confidenceBar.style.width = '0%';
    }
}

/* ============================================= */
/* AI MEDIA ANALYSIS */
/* ============================================= */

/**
 * Analyze uploaded media for AI manipulation
 * Simulates AI detection with random probability
 */
function analyzeMedia() {
    const resultBox = document.getElementById('resultBox');
    const resultIcon = document.getElementById('resultIcon');
    const resultDetails = document.getElementById('resultDetails');
    const confidenceBar = document.getElementById('confidenceBar');
    const confidenceValue = document.getElementById('confidenceValue');
    const analysisTime = document.getElementById('analysisTime');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const messageInput = document.getElementById('messageInput');
    
    // Check if file or message is provided
    if (currentTab === 'messages') {
        if (!messageInput.value.trim()) {
            showNotification('Please enter a message to analyze!');
            return;
        }
    } else if (!selectedFile) {
        showNotification('Please upload a file first!');
        return;
    }
    
    // Disable button and show analyzing state
    if (analyzeBtn) {
        analyzeBtn.disabled = true;
        const type = currentTab === 'messages' ? 'Message' : 'Content';
        analyzeBtn.innerHTML = `<span class="loading"></span> Analyzing ${type}...`;
    }
    
    if (resultBox) {
        resultBox.textContent = '🔄 Analyzing... Please wait.';
        resultBox.className = 'result-box analyzing';
    }
    
    if (resultIcon) {
        resultIcon.textContent = '⏳';
    }
    
    // Simulate analysis time (1.5-3 seconds)
    const analysisDelay = 1500 + Math.random() * 1500;
    const startTime = Date.now();
    
    setTimeout(() => {
        // Generate random result
        const probability = Math.random() * 100;
        const confidence = Math.floor(70 + Math.random() * 25); // 70-95%
        const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
        
        let result, resultClass, icon;
        
        if (probability < 33) {
            // Likely AI/Fraud (Red)
            const typeText = currentTab === 'messages' ? 'FRAUDULENT MESSAGE' : 'LIKELY AI GENERATED';
            const descText = currentTab === 'messages' ? 'This message matches known phishing patterns and scam indicators.' : 'This media shows strong indicators of artificial generation.';
            result = `🔴 ${typeText}\n\n${descText}\nConfidence: ${confidence}%\n\nRecommendation: Exercise extreme caution. Do not share or act upon this content.`;
            resultClass = 'danger';
            icon = '🚨';
        } else if (probability < 66) {
            // Suspicious (Yellow)
            result = `🟡 SUSPICIOUS CONTENT\n\nThis ${currentTab === 'messages' ? 'message' : 'media'} contains some anomalies that warrant further investigation.\nConfidence: ${confidence}%\n\nRecommendation: Verify through additional sources before trusting.`;
            resultClass = 'warning';
            icon = '⚠️';
        } else {
            // Likely Real (Green)
            const typeText = currentTab === 'messages' ? 'LIKELY SAFE' : 'LIKELY AUTHENTIC';
            result = `🟢 ${typeText}\n\nThis ${currentTab === 'messages' ? 'message' : 'media'} appears to be genuine with no significant issues detected.\nConfidence: ${confidence}%\n\nNote: Always verify important content through multiple sources.`;
            resultClass = 'safe';
            icon = '✅';
        }
        
        // Update result box
        if (resultBox) {
            resultBox.textContent = result;
            resultBox.className = `result-box ${resultClass}`;
        }
        
        if (resultIcon) {
            resultIcon.textContent = icon;
        }
        
        // Show and update result details
        if (resultDetails) {
            resultDetails.classList.add('active');
        }
        
        if (confidenceBar) {
            confidenceBar.style.width = `${confidence}%`;
            
            // Color based on result
            if (resultClass === 'danger') {
                confidenceBar.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            } else if (resultClass === 'warning') {
                confidenceBar.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
            } else {
                confidenceBar.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            }
        }
        
        if (confidenceValue) {
            confidenceValue.textContent = `${confidence}%`;
        }
        
        if (analysisTime) {
            analysisTime.textContent = `${timeTaken}s`;
        }
        
        // Re-enable button
        if (analyzeBtn) {
            analyzeBtn.disabled = false;
            const btnType = currentTab === 'messages' ? 'Message' : 'Content';
            analyzeBtn.innerHTML = `<span class="btn-icon">🔍</span><span class="btn-text">Analyze ${btnType}</span>`;
        }
        
    }, analysisDelay);
}

/* ============================================= */
/* COUNTER ANIMATION */
/* ============================================= */

/**
 * Initialize counter animation for statistics
 * Uses Intersection Observer for visibility detection
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');
    
    if (counters.length === 0) return;
    
    // Create Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    // Observe all counters
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

/**
 * Animate a single counter from 0 to target value
 * @param {Element} element - Counter element
 * @param {number} target - Target value
 */
function animateCounter(element, target) {
    const duration = 2000; // 2 seconds
    const start = 0;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * (target - start) + start);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

/* ============================================= */
/* UTILITY FUNCTIONS */
/* ============================================= */

/**
 * Debounce function to limit execution rate
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to limit execution rate
 * @param {Function} func - Function to throttle
 * @param {number} limit - Minimum time between executions
 */
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Check if element is in viewport
 * @param {Element} element - Element to check
 * @returns {boolean} Whether element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/* ============================================= */
/* KEYBOARD NAVIGATION */
/* ============================================= */

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navToggle && navMenu) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

/* ============================================= */
/* CONSOLE BRANDING */
/* ============================================= */

// Display branding in console
console.log(`
%c🛡️ TrustNet.Ai
%cCyber Safety Platform

Protecting citizens from AI-powered threats.
National Hackathon 2026 Project

For support: cybercell@maharashtra.gov.in
Emergency: 1930
`,
'color: #00d4ff; font-size: 24px; font-weight: bold;',
'color: #a0a0b0; font-size: 12px;'
);

/* ============================================= */
/* AWARENESS QUIZ */
/* ============================================= */

/**
 * Check quiz answer
 * @param {HTMLButtonElement} btn - The clicked button
 * @param {boolean} isCorrect - Whether the answer is correct
 */
function checkAnswer(btn, isCorrect) {
    // Get all options in this question
    const options = btn.parentElement.querySelectorAll('.quiz-option');
    
    // Disable all options
    options.forEach(opt => opt.disabled = true);
    
    if (isCorrect) {
        btn.classList.add('correct');
        showNotification('✅ Correct! Good job being vigilant.');
    } else {
        btn.classList.add('wrong');
        // Find and highlight correct answer
        options.forEach(opt => {
            if (opt.onclick && opt.onclick.toString().includes('true')) {
                opt.classList.add('correct');
            }
        });
        showNotification('❌ Incorrect. Learn the red flag and stay safe!');
    }
}

/* ============================================= */
/* SUBSCRIPTION HANDLERS */
/* ============================================= */

/**
 * Initialize subscription buttons
 */
function initSubscriptions() {
    const subscribeBtns = document.querySelectorAll('.subscribe-btn');
    
    subscribeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const plan = this.getAttribute('data-plan');
            const price = this.getAttribute('data-price');
            
            // Check if user is logged in
            const session = localStorage.getItem('trustnet_session');
            if (!session) {
                showNotification('Please login to subscribe to a plan.');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1500);
                return;
            }
            
            handleSubscription(plan, price);
        });
    });
}

/**
 * Handle subscription process
 * @param {string} plan - Plan name
 * @param {string} price - Plan price
 */
function handleSubscription(plan, price) {
    showNotification(`Processing ${plan} subscription for ₹${price}...`);
    
    // Call our API to create a checkout session
    fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            plan, 
            price: parseInt(price),
            email: JSON.parse(localStorage.getItem('trustnet_session')).email
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.url) {
            // Redirect to Stripe Checkout
            window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url: data.url } }, "*");
        } else {
            showNotification('Error creating payment session. Please try again.');
        }
    })
    .catch(err => {
        console.error('Payment error:', err);
        showNotification('Connection error. Using simulation mode.');
        
        // Simulation for demo if API fails
        setTimeout(() => {
            showNotification('Subscription successful! (Simulation Mode)');
        }, 2000);
    });
}

/* ============================================= */
/* ERROR HANDLING */
/* ============================================= */

// Global error handler
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error: ', msg, '\nURL: ', url, '\nLine: ', lineNo);
    return false;
};

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
});

/* ============================================= */
/* CHATBOT FUNCTIONALITY */
/* ============================================= */

const chatbotResponses = {
    how_to_use: {
        en: "**How to use TrustNet.Ai:**\n\n1. **Login**: First, click the 'Login' button in the navigation bar to create an account or sign in.\n2. **Navigate to Detection**: Go to the 'Detection' section on the homepage.\n3. **Select Media Type**: Choose between Images, Voices, Videos, or Messages tabs.\n4. **Upload**: Drop your suspicious file or paste the text you want to verify.\n5. **Analyze**: Click the 'Analyze Content' button. Our AI will process it in seconds.\n6. **Get Results**: View the confidence score and safety recommendations.\n7. **Stay Informed**: Explore the 'Awareness' section for tips and quizzes.",
        mr: "**TrustNet.Ai कसे वापरावे:**\n\n1. **लॉगिन**: प्रथम, खाते तयार करण्यासाठी किंवा साइन इन करण्यासाठी नेव्हिगेशन बारमधील 'लॉगिन' बटणावर क्लिक करा.\n2. **शोध कडे जा**: मुख्यपृष्ठावरील 'शोध' (Detection) विभागावर जा.\n3. **मीडिया प्रकार निवडा**: प्रतिमा, आवाज, व्हिडिओ किंवा संदेश टॅबमधून निवडा.\n4. **अपलोड करा**: तुमची संशयास्पद फाइल ड्रॉप करा किंवा तुम्हाला पडताळायचा असलेला मजकूर पेस्ट करा.\n5. **विश्लेषण करा**: 'सामग्री विश्लेषण करा' बटणावर क्लिक करा. आमचे AI काही सेकंदात त्यावर प्रक्रिया करेल.\n6. **निकाल मिळवा**: आत्मविश्वास स्कोर आणि सुरक्षा शिफारसी पहा.\n7. **माहितीपूर्ण राहा**: टिप्स आणि क्विझसाठी 'जागरूकता' विभाग एक्सप्लोर करा."
    },
    how_it_works: {
        en: "**How TrustNet.Ai Works:**\n\nTrustNet.Ai is powered by advanced Artificial Intelligence to protect you from digital fraud:\n\n• **Deep Learning Models**: We use neural networks trained on millions of real and manipulated media samples.\n• **Artifact Analysis**: Our AI detects microscopic traces of manipulation like inconsistent lighting, biometric errors, and frequency anomalies in voices.\n• **Real-time Processing**: Analysis is performed instantly in our secure cloud, giving you results in under 5 seconds.\n• **Multi-Layered Defense**: We combine image, voice, and text analysis to provide comprehensive protection.\n• **Citizen-Centric**: Designed specifically for the people of Maharashtra with full Marathi language support.",
        mr: "**TrustNet.Ai कसे कार्य करते:**\n\nTrustNet.Ai तुम्हाला डिजिटल फसवणुकीपासून वाचवण्यासाठी प्रगत आर्टिफिशिअल इंटेलिजन्सद्वारे समर्थित आहे:\n\n• **डीप लर्निंग मॉडेल्स**: आम्ही लाखो वास्तविक आणि हाताळलेल्या मीडिया नमुन्यांवर प्रशिक्षित न्यूरल नेटवर्क्स वापरतो.\n• **आर्टिफॅक्ट विश्लेषण**: आमचे AI विसंगत प्रकाश, बायोमेट्रिक चुका आणि आवाजातील फ्रिक्वेन्सी विसंगती यासारखे सूक्ष्म फेरफार शोधते.\n• **रिअल-टाइम प्रोसेसिंग**: विश्लेषण आमच्या सुरक्षित क्लाउडमध्ये त्वरित केले जाते, जे तुम्हाला 5 सेकंदात निकाल देते.\n• **बहु-स्तरीय संरक्षण**: आम्ही सर्वसमावेशक संरक्षण प्रदान करण्यासाठी प्रतिमा, आवाज आणि मजकूर विश्लेषणाचे संयोजन करतो.\n• **नागरिक-केंद्रित**: पूर्ण मराठी भाषा समर्थनासह महाराष्ट्रातील लोकांसाठी विशेषतः डिझाइन केलेले."
    },
    what_is_deepfake: {
        en: "**What is a Deepfake?**\n\nDeepfakes are AI-generated fake media that look real:\n\n• **Fake Images**: AI creates photos of people who don't exist\n• **Voice Cloning**: Criminals copy someone's voice to make scam calls\n• **Video Manipulation**: Putting someone's face on another person's body\n\n**Warning Signs:**\n- Unnatural blinking\n- Blurry edges around face\n- Inconsistent lighting\n- 6 fingers on hands\n- Robotic voice patterns",
        mr: "**डीपफेक म्हणजे काय?**\n\nडीपफेक हे AI-निर्मित खोटे मीडिया आहेत जे खरे दिसतात:\n\n• **खोट्या प्रतिमा**: AI अस्तित्वात नसलेल्या लोकांचे फोटो तयार करते\n• **व्हॉइस क्लोनिंग**: गुन्हेगार स्कॅम कॉल करण्यासाठी कोणाचा तरी आवाज कॉपी करतात\n• **व्हिडिओ हाताळणी**: एखाद्याचा चेहरा दुसऱ्याच्या शरीरावर ठेवणे\n\n**चेतावणी चिन्हे:**\n- अनैसर्गिक डोळे मिचकावणे\n- चेहऱ्याभोवती अस्पष्ट कडा\n- विसंगत प्रकाशयोजना\n- हातावर 6 बोटे\n- रोबोटिक आवाज पॅटर्न"
    },
    report_scam: {
        en: "**How to Report a Scam:**\n\n📞 **Emergency Helplines:**\n• Cyber Crime Helpline: 1930\n• Women Helpline: 181\n• Police: 100\n\n🌐 **Online Reporting:**\n• Visit: cybercrime.gov.in\n• Register complaint with details\n• Attach evidence (screenshots, recordings)\n\n⚠️ **Important:** Don't delete evidence! Save all messages, call logs, and transaction details.",
        mr: "**स्कॅम कसा रिपोर्ट करायचा:**\n\n📞 **आणीबाणी हेल्पलाइन:**\n• सायबर क्राइम हेल्पलाइन: 1930\n• महिला हेल्पलाइन: 181\n• पोलीस: 100\n\n🌐 **ऑनलाइन रिपोर्टिंग:**\n• भेट द्या: cybercrime.gov.in\n• तपशीलांसह तक्रार नोंदवा\n• पुरावे जोडा (स्क्रीनशॉट, रेकॉर्डिंग)\n\n⚠️ **महत्त्वाचे:** पुरावे हटवू नका! सर्व संदेश, कॉल लॉग आणि व्यवहार तपशील जतन करा."
    },
    subscription: {
        en: "**Subscription Plans:**\n\n💰 **Standard - ₹99/month**\n• Unlimited Image Scans\n• Voice Scam Detection\n• WhatsApp Bot Access\n• Email Support\n\n⭐ **Semi-Annual - ₹499/6 months** (Best Value)\n• All Standard features\n• Video Deepfake Analysis\n• Priority Threat Alerts\n• Personal Safety Dashboard\n\n👑 **Premium - ₹799/year**\n• All Semi-Annual features\n• 24/7 Helpline Access\n• Family Protection (5 Users)\n• Direct Cyber Cell Referral",
        mr: "**सदस्यता योजना:**\n\n💰 **स्टँडर्ड - ₹99/महिना**\n• अमर्यादित प्रतिमा स्कॅन\n• व्हॉइस स्कॅम शोध\n• WhatsApp बॉट प्रवेश\n• ईमेल समर्थन\n\n⭐ **सहामाही - ₹499/6 महिने** (सर्वोत्तम मूल्य)\n• सर्व स्टँडर्ड वैशिष्ट्ये\n• व्हिडिओ डीपफेक विश्लेषण\n• प्राधान्य धोका सूचना\n• वैयक्तिक सुरक्षा डॅशबोर्ड\n\n👑 **प्रीमियम - ₹799/वर्ष**\n• सर्व सहामाही वैशिष्ट्ये\n• 24/7 हेल्पलाइन प्रवेश\n• कुटुंब संरक्षण (5 वापरकर्ते)\n• थेट सायबर सेल रेफरल"
    },
    default: {
        en: "I'm here to help! You can ask me about:\n\n• How to use this platform\n• How our AI detection works\n• What are deepfakes\n• How to report scams\n• Subscription plans\n\nOr click one of the quick action buttons above!",
        mr: "मी मदत करण्यासाठी येथे आहे! तुम्ही मला विचारू शकता:\n\n• हे प्लॅटफॉर्म कसे वापरायचे\n• आमचे AI शोध कसे कार्य करते\n• डीपफेक म्हणजे काय\n• स्कॅम कसा रिपोर्ट करायचा\n• सदस्यता योजना\n\nकिंवा वरील क्विक अॅक्शन बटणांपैकी एक क्लिक करा!"
    }
};

let chatbotOpen = false;

function toggleChatbot() {
    const container = document.getElementById('chatbotContainer');
    const toggle = document.getElementById('chatbotToggle');
    
    chatbotOpen = !chatbotOpen;
    
    if (chatbotOpen) {
        container.classList.add('active');
        toggle.style.display = 'none';
    } else {
        container.classList.remove('active');
        toggle.style.display = 'flex';
    }
}

function askQuestion(questionKey) {
    const response = chatbotResponses[questionKey] || chatbotResponses.default;
    const messagesContainer = document.getElementById('chatbotMessages');
    
    const questionTexts = {
        how_to_use: 'How to use?',
        how_it_works: 'How it works?',
        what_is_deepfake: 'What is Deepfake?',
        report_scam: 'How to report a scam?',
        subscription: 'Subscription info'
    };
    
    addUserMessage(questionTexts[questionKey] || questionKey);
    
    setTimeout(() => {
        addBotMessage(response.en, response.mr);
        scrollChatToBottom();
    }, 500);
}

function sendChatMessage() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    addUserMessage(message);
    input.value = '';
    
    setTimeout(() => {
        const response = findBestResponse(message);
        addBotMessage(response.en, response.mr);
        scrollChatToBottom();
    }, 500);
}

function handleChatKeypress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function findBestResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('how to use') || lowerMessage.includes('कसे वापरायचे') || lowerMessage.includes('use')) {
        return chatbotResponses.how_to_use;
    }
    if (lowerMessage.includes('how it works') || lowerMessage.includes('कसे कार्य') || lowerMessage.includes('work')) {
        return chatbotResponses.how_it_works;
    }
    if (lowerMessage.includes('deepfake') || lowerMessage.includes('डीपफेक') || lowerMessage.includes('fake')) {
        return chatbotResponses.what_is_deepfake;
    }
    if (lowerMessage.includes('report') || lowerMessage.includes('scam') || lowerMessage.includes('रिपोर्ट') || lowerMessage.includes('स्कॅम') || lowerMessage.includes('helpline')) {
        return chatbotResponses.report_scam;
    }
    if (lowerMessage.includes('subscription') || lowerMessage.includes('price') || lowerMessage.includes('plan') || lowerMessage.includes('सदस्यता') || lowerMessage.includes('किंमत')) {
        return chatbotResponses.subscription;
    }
    
    return chatbotResponses.default;
}

function addUserMessage(text) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const quickActions = messagesContainer.querySelector('.chatbot-quick-actions');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot-message user';
    messageDiv.innerHTML = `
        <span class="message-avatar">👤</span>
        <div class="message-content">
            <p>${escapeHtml(text)}</p>
        </div>
    `;
    
    if (quickActions) {
        messagesContainer.insertBefore(messageDiv, quickActions);
    } else {
        messagesContainer.appendChild(messageDiv);
    }
    
    scrollChatToBottom();
}

function addBotMessage(enText, mrText) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const quickActions = messagesContainer.querySelector('.chatbot-quick-actions');
    
    const formattedEn = formatChatMessage(enText);
    const formattedMr = formatChatMessage(mrText);
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot-message bot';
    messageDiv.innerHTML = `
        <span class="message-avatar">🤖</span>
        <div class="message-content">
            <p>${formattedEn}</p>
            <p style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1);">${formattedMr}</p>
        </div>
    `;
    
    if (quickActions) {
        messagesContainer.insertBefore(messageDiv, quickActions);
    } else {
        messagesContainer.appendChild(messageDiv);
    }
}

function formatChatMessage(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>')
        .replace(/•/g, '&bull;');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function scrollChatToBottom() {
    const messagesContainer = document.getElementById('chatbotMessages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
