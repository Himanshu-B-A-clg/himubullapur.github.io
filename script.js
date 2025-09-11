// Device Detection and Download Functions
function detectDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent);
    const isIOS = /iphone|ipad|ipod/i.test(userAgent);
    const isAndroid = /android/i.test(userAgent);
    
    let deviceType = 'Desktop';
    if (isTablet) {
        deviceType = 'Tablet';
    } else if (isMobile) {
        deviceType = 'Mobile';
    }
    
    return {
        type: deviceType,
        isMobile,
        isTablet,
        isIOS,
        isAndroid,
        isDesktop: !isMobile && !isTablet
    };
}

function updateDeviceInfo() {
    const device = detectDevice();
    const deviceTypeElement = document.getElementById('device-type');
    const downloadBtn = document.getElementById('download-btn');
    const installBtn = document.getElementById('install-btn');
    
    if (deviceTypeElement) {
        deviceTypeElement.textContent = `Device: ${device.type}`;
    }
    
    // Show appropriate download option based on device
    if (device.isMobile || device.isTablet) {
        // Show PWA install option for mobile/tablet
        if (downloadBtn) downloadBtn.style.display = 'none';
        if (installBtn) installBtn.style.display = 'flex';
    } else {
        // Show download option for desktop
        if (downloadBtn) downloadBtn.style.display = 'flex';
        if (installBtn) installBtn.style.display = 'none';
    }
}

function downloadApp() {
    const device = detectDevice();
    
    if (device.isIOS) {
        // For iOS, try to trigger add to home screen
        triggerIOSInstall();
    } else if (device.isAndroid) {
        // For Android, show install prompt
        installPWA();
    } else {
        // For Windows/Desktop, try to install PWA
        installPWA();
    }
}

function triggerIOSInstall() {
    // For iOS, we can't programmatically trigger "Add to Home Screen"
    // But we can show a simple notification with instructions
    showNotification('For iPhone: Tap the Share button (square with arrow) and select "Add to Home Screen"', 'info', 5000);
    
    // Try to trigger any available install prompt
    if (window.deferredPrompt) {
        window.deferredPrompt.prompt();
        window.deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                showNotification('App installed successfully!', 'success');
            }
            window.deferredPrompt = null;
        });
    }
}

function showIOSInstallInstructions() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h2>Add to Home Screen</h2>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="ios-install-guide">
                    <div class="ios-icon">
                        <i class="fab fa-apple"></i>
                    </div>
                    <h3>Install on iPhone/iPad</h3>
                    <p>Add this app to your home screen for easy access:</p>
                    
                    <div class="install-steps">
                        <div class="step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <strong>Tap the Share button</strong>
                                <p>Look for the share icon (square with arrow up) at the bottom of Safari</p>
                            </div>
                        </div>
                        
                        <div class="step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <strong>Scroll down and tap "Add to Home Screen"</strong>
                                <p>You'll see this option in the share menu</p>
                            </div>
                        </div>
                        
                        <div class="step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <strong>Tap "Add" to confirm</strong>
                                <p>The app will appear on your home screen like a native app</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="ios-benefits">
                        <h4>Benefits:</h4>
                        <ul>
                            <li><i class="fas fa-check"></i> Quick access from home screen</li>
                            <li><i class="fas fa-check"></i> Works offline</li>
                            <li><i class="fas fa-check"></i> No app store required</li>
                            <li><i class="fas fa-check"></i> Native app experience</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="this.closest('.modal').remove()">Got it!</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function showDesktopInstallInstructions() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h2>Install on Windows/Desktop</h2>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="desktop-install-guide">
                    <div class="desktop-icon">
                        <i class="fas fa-desktop"></i>
                    </div>
                    <h3>Install as Desktop App</h3>
                    <p>Get the best experience by installing this as a desktop app:</p>
                    
                    <div class="browser-instructions">
                        <div class="browser-item">
                            <div class="browser-icon chrome">
                                <i class="fab fa-chrome"></i>
                            </div>
                            <div class="browser-steps">
                                <h4>Google Chrome</h4>
                                <ol>
                                    <li>Look for the install icon in the address bar</li>
                                    <li>Click "Install" when prompted</li>
                                    <li>Or go to Menu → "Install DSI Placement Portal"</li>
                                </ol>
                            </div>
                        </div>
                        
                        <div class="browser-item">
                            <div class="browser-icon edge">
                                <i class="fab fa-edge"></i>
                            </div>
                            <div class="browser-steps">
                                <h4>Microsoft Edge</h4>
                                <ol>
                                    <li>Click the install icon in the address bar</li>
                                    <li>Click "Install" when prompted</li>
                                    <li>Or go to Menu → "Apps" → "Install this site as an app"</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                    
                    <div class="desktop-benefits">
                        <h4>Benefits:</h4>
                        <ul>
                            <li><i class="fas fa-check"></i> Faster loading and better performance</li>
                            <li><i class="fas fa-check"></i> Works offline</li>
                            <li><i class="fas fa-check"></i> Native app-like experience</li>
                            <li><i class="fas fa-check"></i> Easy access from desktop</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                <button class="btn btn-primary" onclick="triggerPWAInstall()">Try Install Now</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function showDetailedInstallInstructions(platform) {
    const instructions = {
        iOS: {
            title: 'Install on iOS',
            steps: [
                '1. Tap the Share button (square with arrow up)',
                '2. Scroll down and tap "Add to Home Screen"',
                '3. Tap "Add" to confirm',
                '4. The app will appear on your home screen'
            ]
        },
        Android: {
            title: 'Install on Android',
            steps: [
                '1. Tap the three-dot menu in your browser',
                '2. Select "Add to Home screen" or "Install app"',
                '3. Tap "Add" or "Install" to confirm',
                '4. The app will appear on your home screen'
            ]
        }
    };
    
    const instruction = instructions[platform];
    let message = `${instruction.title}:\n\n${instruction.steps.join('\n')}`;
    
    // Show as a detailed notification
    showNotification(message, 'info', 10000); // Show for 10 seconds
}

function showPWAInstallModal() {
    // Create a modal with detailed PWA installation instructions
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h2>Install DSI Placement Portal</h2>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="install-instructions">
                    <div class="install-icon">
                        <i class="fas fa-download"></i>
                    </div>
                    <h3>Install as a Progressive Web App (PWA)</h3>
                    <p>Get the best experience by installing this app on your device:</p>
                    
                    <div class="browser-instructions">
                        <div class="browser-item">
                            <div class="browser-icon chrome">
                                <i class="fab fa-chrome"></i>
                            </div>
                            <div class="browser-steps">
                                <h4>Google Chrome</h4>
                                <ol>
                                    <li>Look for the install icon in the address bar</li>
                                    <li>Click "Install" when prompted</li>
                                    <li>Or go to Menu → "Install DSI Placement Portal"</li>
                                </ol>
                            </div>
                        </div>
                        
                        <div class="browser-item">
                            <div class="browser-icon edge">
                                <i class="fab fa-edge"></i>
                            </div>
                            <div class="browser-steps">
                                <h4>Microsoft Edge</h4>
                                <ol>
                                    <li>Click the install icon in the address bar</li>
                                    <li>Click "Install" when prompted</li>
                                    <li>Or go to Menu → "Apps" → "Install this site as an app"</li>
                                </ol>
                            </div>
                        </div>
                        
                        <div class="browser-item">
                            <div class="browser-icon firefox">
                                <i class="fab fa-firefox"></i>
                            </div>
                            <div class="browser-steps">
                                <h4>Firefox</h4>
                                <ol>
                                    <li>Go to Menu → "Install"</li>
                                    <li>Click "Install" when prompted</li>
                                    <li>The app will be added to your applications</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                    
                    <div class="install-benefits">
                        <h4>Benefits of Installing:</h4>
                        <ul>
                            <li><i class="fas fa-check"></i> Faster loading and better performance</li>
                            <li><i class="fas fa-check"></i> Works offline</li>
                            <li><i class="fas fa-check"></i> Native app-like experience</li>
                            <li><i class="fas fa-check"></i> Easy access from your desktop</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                <button class="btn btn-primary" onclick="triggerPWAInstall()">Try Install Now</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function triggerPWAInstall() {
    if (window.deferredPrompt) {
        window.deferredPrompt.prompt();
        window.deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                showNotification('App installed successfully!', 'success');
            } else {
                showNotification('Installation cancelled. You can try again later.', 'info');
            }
            window.deferredPrompt = null;
        });
    } else {
        showNotification('Install prompt not available. Please use your browser\'s menu to install.', 'info');
    }
    
    // Close the modal
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

function installPWA() {
    console.log('🔧 Attempting to install PWA...');
    console.log('🔍 Deferred prompt available:', !!window.deferredPrompt);
    
    // Try to trigger the install prompt directly
    if (window.deferredPrompt) {
        console.log('✅ Triggering install prompt...');
        window.deferredPrompt.prompt();
        window.deferredPrompt.userChoice.then((choiceResult) => {
            console.log('📱 User choice:', choiceResult.outcome);
            if (choiceResult.outcome === 'accepted') {
                showNotification('App installed successfully!', 'success');
            } else {
                showNotification('Installation cancelled', 'info');
            }
            window.deferredPrompt = null;
        });
    } else {
        console.log('❌ No install prompt available');
        // If no install prompt available, show browser-specific instructions
        const device = detectDevice();
        if (device.isAndroid) {
            showNotification('Tap the menu button (⋮) and select "Add to Home screen" or "Install app"', 'info', 5000);
        } else if (device.isIOS) {
            showNotification('Tap the Share button (square with arrow) and select "Add to Home Screen"', 'info', 5000);
        } else {
            showNotification('Look for the install icon in your browser\'s address bar or try refreshing the page', 'info', 5000);
        }
    }
}

function setupPWAInstallPrompt() {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('💾 PWA install prompt available');
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later
        window.deferredPrompt = e;
        
        // Show install button for all devices when prompt is available
        const downloadBtn = document.getElementById('download-btn');
        if (downloadBtn) {
            downloadBtn.style.display = 'flex';
            downloadBtn.innerHTML = '<i class="fas fa-download"></i><span class="download-text">Install App</span>';
        }
        
        console.log('✅ Install prompt ready - button should be visible');
    });
    
    // Listen for the appinstalled event
    window.addEventListener('appinstalled', () => {
        console.log('✅ PWA was installed');
        showNotification('App installed successfully!', 'success');
        window.deferredPrompt = null;
        
        // Hide install button after successful installation
        const downloadBtn = document.getElementById('download-btn');
        if (downloadBtn) {
            downloadBtn.style.display = 'none';
        }
    });
    
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('✅ App is already installed');
        const downloadBtn = document.getElementById('download-btn');
        if (downloadBtn) {
            downloadBtn.style.display = 'none';
        }
    }
}

function checkPWARequirements() {
    console.log('🔍 Checking PWA requirements...');
    
    const requirements = {
        https: location.protocol === 'https:' || location.hostname === 'localhost',
        serviceWorker: 'serviceWorker' in navigator,
        manifest: !!document.querySelector('link[rel="manifest"]'),
        icons: document.querySelectorAll('link[rel="icon"]').length > 0
    };
    
    console.log('📋 PWA Requirements:', requirements);
    
    if (!requirements.https) {
        console.warn('⚠️ HTTPS required for PWA install prompt');
        showNotification('PWA install requires HTTPS. Use localhost or deploy to HTTPS.', 'warning', 5000);
    }
    
    if (!requirements.serviceWorker) {
        console.warn('⚠️ Service Worker not supported');
    }
    
    if (!requirements.manifest) {
        console.warn('⚠️ Web App Manifest not found');
    }
    
    if (!requirements.icons) {
        console.warn('⚠️ App icons not found');
    }
    
    const allRequirementsMet = Object.values(requirements).every(req => req);
    console.log('✅ All PWA requirements met:', allRequirementsMet);
    
    if (allRequirementsMet) {
        console.log('🎉 PWA is ready for installation!');
    } else {
        console.log('❌ PWA requirements not fully met');
    }
}

// Test function for debugging login
function testStudentLogin() {
    console.log('🧪 Testing student login...');
    console.log('📊 AppState.students:', AppState.students);
    console.log('🔍 Looking for student 1DS20CS001...');
    
    const testStudent = AppState.students.find(s => s.usn === '1DS20CS001');
    console.log('👤 Test student found:', testStudent);
    
    if (testStudent) {
        console.log('✅ Test credentials: USN=1DS20CS001, Password=Stu@123');
    } else {
        console.log('❌ Test student not found in AppState.students');
    }
}

// Theme Management
let currentTheme = 'light'; // Default theme, no localStorage

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
});

// Global error handler to catch and log errors
window.addEventListener('error', function(event) {
    console.error('Global error caught:', event.error);
    console.error('Error details:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
    });
    
    // Show user-friendly error message
    if (event.error && event.error.message.includes('classList')) {
        console.warn('DOM element not found - this is usually harmless');
    }
});

function initializeTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    
    if (!themeToggle) {
        console.warn('Theme toggle element not found');
        return;
    }
    
    const themeIcon = themeToggle.querySelector('i');
    
    // Set initial theme
    body.setAttribute('data-theme', currentTheme);
    
    // Update theme toggle icon
    if (currentTheme === 'dark') {
        themeIcon.className = 'fas fa-sun';
        themeToggle.title = 'Switch to Light Mode';
    } else {
        themeIcon.className = 'fas fa-moon';
        themeToggle.title = 'Switch to Dark Mode';
    }
}

function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Toggle theme
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Apply theme
    body.setAttribute('data-theme', currentTheme);
    
    // Update icon and title
    if (currentTheme === 'dark') {
        themeIcon.className = 'fas fa-sun';
        themeToggle.title = 'Switch to Light Mode';
    } else {
        themeIcon.className = 'fas fa-moon';
        themeToggle.title = 'Switch to Dark Mode';
    }
    
    // Theme preference is not persisted (no localStorage)
    
    // Show notification
    showNotification(`Switched to ${currentTheme} mode`, 'info');
}

function toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const menuToggle = document.getElementById('mobile-menu-toggle');
    
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
}

// Close mobile menu when clicking on nav links
function closeMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const menuToggle = document.getElementById('mobile-menu-toggle');
    
    navMenu.classList.remove('active');
    menuToggle.classList.remove('active');
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const navMenu = document.getElementById('nav-menu');
    const menuToggle = document.getElementById('mobile-menu-toggle');
    
    if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});

// Firebase Database Functions
let isFirebaseReady = false;
let firebaseListeners = {};

// Wait for Firebase to be ready
function waitForFirebase() {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max wait
        
        const checkFirebase = () => {
            attempts++;
            
            // Check if Firebase initialization failed
            if (window.firebaseError) {
                console.error('❌ Firebase initialization failed:', window.firebaseError);
                updateConnectionStatus('error');
                reject(window.firebaseError);
                return;
            }
            
            // Check if Firebase is ready
            if (window.firebaseInitialized && window.firebaseDatabase && window.firebaseRef && window.firebaseSet && window.firebaseGet) {
                isFirebaseReady = true;
                console.log('✅ Firebase is ready');
                updateConnectionStatus('connected');
                resolve();
            } else if (attempts >= maxAttempts) {
                console.error('❌ Firebase initialization timeout');
                updateConnectionStatus('error');
                reject(new Error('Firebase initialization timeout'));
            } else {
                console.log(`⏳ Waiting for Firebase... (attempt ${attempts}/${maxAttempts})`);
                updateConnectionStatus('connecting');
                setTimeout(checkFirebase, 100);
            }
        };
        
        checkFirebase();
    });
}

// Firebase Database Functions
async function saveDataToFirebase(data) {
    console.log('saveDataToFirebase called with data:', data);
    if (!isFirebaseReady) {
        console.log('Firebase not ready, waiting...');
        await waitForFirebase();
    }
    
    
    try {
        console.log('Firebase is ready, processing data...');
        // Clean data for Firebase (remove functions and undefined values)
        const cleanData = {
            jobs: data.jobs || [],
            shortlistedData: data.shortlistedData || [],
            jobShortlisted: data.jobShortlisted || {},
            notifications: (data.notifications || []).map(notification => ({
                id: notification.id || '',
                title: notification.title || '',
                message: notification.message || '',
                type: notification.type || 'info',
                timestamp: notification.timestamp || Date.now(),
                // Remove the action.callback function
                action: notification.action && notification.action.text ? {
                    text: notification.action.text
                } : null
            })).filter(notification => notification.id && notification.title), // Remove empty notifications
            admins: data.admins || [],
            students: data.students || [],
            eligibilityCriteria: data.eligibilityCriteria || {
                min10thMarks: 60,
                min12thMarks: 60,
                minCGPAMarks: 6.0
            }
        };
        
        console.log('Clean data prepared:', cleanData);
        console.log('Students in clean data:', cleanData.students.length);
        
        const dataRef = window.firebaseRef(window.firebaseDatabase, 'placementPortalData');
        console.log('Saving to Firebase...');
        await window.firebaseSet(dataRef, cleanData);
        console.log('✅ Data saved to Firebase successfully');
        showNotification('Data synced to cloud!', 'success');
    } catch (error) {
        console.error('❌ Error saving to Firebase:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
        // No localStorage fallback - cloud-only storage
        showNotification('Error syncing to cloud - please check connection', 'error');
        throw error; // Re-throw to be caught by calling function
    }
}

async function loadDataFromFirebase() {
    if (!isFirebaseReady) await waitForFirebase();
    
    try {
        // Load data from Firebase
        console.log('Loading data from Firebase...');
        
        const dataRef = window.firebaseRef(window.firebaseDatabase, 'placementPortalData');
        const snapshot = await window.firebaseGet(dataRef);
        
        if (snapshot.exists()) {
            const data = snapshot.val();
            
            // Update app state with Firebase data
            AppState.jobs = data.jobs || [];
            AppState.shortlistedData = data.shortlistedData || [];
            AppState.jobShortlisted = data.jobShortlisted || {};
            AppState.notifications = data.notifications || [];
            AppState.admins = data.admins || [];
            AppState.students = data.students || [];
            AppState.eligibilityCriteria = data.eligibilityCriteria || {
                min10thMarks: 60,
                min12thMarks: 60,
                minCGPAMarks: 6.0
            };
            
            AppState.filteredJobs = [...AppState.jobs];
            AppState.filteredShortlistedData = [...AppState.shortlistedData];
            
            console.log('✅ Data loaded from Firebase successfully');
            console.log(`Loaded: ${AppState.jobs.length} jobs, ${AppState.notifications.length} notifications`);
        } else {
            // No data in Firebase, start with empty state
            console.log('No data in Firebase, starting with empty state');
            AppState.jobs = [];
            AppState.shortlistedData = [];
            AppState.jobShortlisted = {};
            AppState.notifications = [];
            AppState.admins = [];
            AppState.students = [];
            AppState.eligibilityCriteria = {
                min10thMarks: 60,
                min12thMarks: 60,
                minCGPAMarks: 6.0
            };
            
            AppState.filteredJobs = [...AppState.jobs];
            AppState.filteredShortlistedData = [...AppState.shortlistedData];
        }
        
    } catch (error) {
        console.error('❌ Error in loadDataFromFirebase:', error);
        // Start with empty state on error
        AppState.jobs = [];
        AppState.shortlistedData = [];
        AppState.jobShortlisted = {};
        AppState.notifications = [];
        AppState.admins = [];
        AppState.students = [];
        AppState.eligibilityCriteria = {
            min10thMarks: 60,
            min12thMarks: 60,
            minCGPAMarks: 6.0
        };
        
        AppState.filteredJobs = [...AppState.jobs];
        AppState.filteredShortlistedData = [...AppState.shortlistedData];
        
        showNotification('Error loading data from cloud', 'error');
    }
}

// Connection status management
function updateConnectionStatus(status) {
    const indicator = document.getElementById('connection-indicator');
    if (!indicator) return;
    
    const icon = indicator.querySelector('i');
    const text = indicator.querySelector('span');
    
    switch (status) {
        case 'connected':
            indicator.className = 'connection-indicator connected';
            icon.className = 'fas fa-wifi';
            text.textContent = 'Live Sync';
            break;
        case 'connecting':
            indicator.className = 'connection-indicator connecting';
            icon.className = 'fas fa-wifi';
            text.textContent = 'Connecting...';
            break;
        case 'offline':
            indicator.className = 'connection-indicator offline';
            icon.className = 'fas fa-wifi-slash';
            text.textContent = 'Offline Mode';
            break;
        case 'error':
            indicator.className = 'connection-indicator error';
            icon.className = 'fas fa-exclamation-triangle';
            text.textContent = 'Sync Error';
            break;
    }
}

// Real-time listeners for instant updates
function setupFirebaseListeners() {
    if (!isFirebaseReady) {
        updateConnectionStatus('connecting');
        return;
    }
    
    try {
        const dataRef = window.firebaseRef(window.firebaseDatabase, 'placementPortalData');
        
        // Store previous notification IDs for real-time detection
        let previousNotificationIds = AppState.notifications.map(n => n.id);
        
        // Listen for real-time updates
        const unsubscribe = window.firebaseOnValue(dataRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                
                // Debug: Log notification data to identify old notifications
                console.log('Firebase real-time update received:');
                console.log('Notifications count:', data.notifications ? data.notifications.length : 0);
                if (data.notifications && data.notifications.length > 0) {
                    console.log('Notification IDs:', data.notifications.map(n => n.id));
                    console.log('Notification timestamps:', data.notifications.map(n => n.timestamp));
                }
                
                // Store old notifications for comparison
                const oldNotifications = [...AppState.notifications];
                
                // Update app state
                AppState.jobs = data.jobs || [];
                AppState.shortlistedData = data.shortlistedData || [];
                AppState.jobShortlisted = data.jobShortlisted || {};
                AppState.notifications = data.notifications || [];
                AppState.admins = data.admins || [];
                AppState.students = data.students || [];
                AppState.eligibilityCriteria = data.eligibilityCriteria || {
                    min10thMarks: 60,
                    min12thMarks: 60,
                    minCGPAMarks: 6.0
                };
                
                AppState.filteredJobs = [...AppState.jobs];
                AppState.filteredShortlistedData = [...AppState.shortlistedData];
                
                // Check for new notifications by comparing IDs
                const newNotificationIds = AppState.notifications.map(n => n.id);
                const hasNewNotifications = newNotificationIds.length > previousNotificationIds.length || 
                    newNotificationIds.some(id => !previousNotificationIds.includes(id));
                
                // Handle new notifications with real-time alerts
                if (hasNewNotifications && AppState.notifications.length > 0) {
                    // Find the newest notification that wasn't in the previous list
                    const newNotifications = AppState.notifications.filter(n => 
                        !previousNotificationIds.includes(n.id)
                    );
                    
                    if (newNotifications.length > 0) {
                        // Show the latest new notification
                        const latestNewNotification = newNotifications[0];
                        console.log('🔔 New notification detected:', latestNewNotification);
                        handleRealtimeNotification(latestNewNotification);
                    }
                }
                
                // Update previous notification IDs
                previousNotificationIds = newNotificationIds;
                
                // Update UI if needed
                if (document.getElementById('admin-job-list')) {
                    loadAdminJobList();
                }
                if (document.getElementById('job-listings')) {
                    loadJobs();
                }
                if (document.getElementById('admin-list')) {
                    loadAdminList();
                }
                if (document.getElementById('companies-grid')) {
                    loadCompanyView();
                }
                if (document.getElementById('notifications-list')) {
                    displayNotifications();
                }
                if (document.getElementById('admin-notifications-list')) {
                    loadAdminNotifications();
                }
                if (document.getElementById('all-notifications-list')) {
                    loadAllNotifications();
                }
                if (document.getElementById('student-notifications-list')) {
                    loadStudentNotifications();
                }
                
                // Always update notification badge
                updateNotificationBadge();
                
                updateConnectionStatus('connected');
                console.log('Real-time update received from Firebase');
                
                // Show subtle update indicator
                showUpdateIndicator();
            } else {
                // No data in Firebase - clear everything
                console.log('No data in Firebase, clearing all data');
                AppState.jobs = [];
                AppState.shortlistedData = [];
                AppState.jobShortlisted = {};
                AppState.notifications = [];
                AppState.admins = [];
                AppState.students = [];
                
                AppState.filteredJobs = [...AppState.jobs];
                AppState.filteredShortlistedData = [...AppState.shortlistedData];
                
                // Update UI
                if (document.getElementById('notifications-list')) {
                    displayNotifications();
                }
                if (document.getElementById('admin-notifications-list')) {
                    loadAdminNotifications();
                }
                if (document.getElementById('all-notifications-list')) {
                    loadAllNotifications();
                }
            }
        }, (error) => {
            console.error('Firebase listener error:', error);
            updateConnectionStatus('error');
        });
        
        firebaseListeners.data = unsubscribe;
        console.log('Firebase real-time listeners set up');
        
    } catch (error) {
        console.error('Error setting up Firebase listeners:', error);
        updateConnectionStatus('error');
    }
}

// Global State Management
const AppState = {
    currentUser: null,
    jobs: [],
    filteredJobs: [],
    currentJobId: null,
    editingJobId: null,
    shortlistedData: [],
    filteredShortlistedData: [],
    currentCompanyData: [],
    currentCompanyFullData: null,
    showShortlistedBanner: false,
    notifications: [],
    jobShortlisted: {}, // Store shortlisted data per job
    admins: [], // Store admin users
    students: [], // Store student data
    currentStudent: null, // Currently logged in student
    eligibilityCriteria: {
        min10thMarks: 60, // Minimum 10th marks percentage
        min12thMarks: 60, // Minimum 12th marks percentage
        minCGPAMarks: 6.0 // Minimum CGPA
    },
    salaryRanges: {
        below10: 'Below 10 LPA',
        below20: 'Below 20 LPA', 
        above20: '20 LPA+'
    }
};

// Sample Data - Empty array for clean start (removed test data)

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    initializePWA();
});

async function initializeApp() {
    try {
        // Check if running from file:// protocol
        if (location.protocol === 'file:') {
            console.log('⚠️ Running from file:// protocol - some features may not work');
            console.log('💡 For full functionality, serve the app from a web server (localhost, GitHub Pages, etc.)');
        }
        
        // Load data from Firebase (cloud-only)
        await loadDataFromFirebase();
        
        // Create default notifications if none exist
        createDefaultNotifications();
        
        // Set up real-time listeners
        setupFirebaseListeners();
        
        // Set up offline detection
        setupOfflineDetection();
        
        // Initialize navigation (with DOM ready check)
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', updateNavigationForStudent);
        } else {
            updateNavigationForStudent();
        }
        
        // Restore login state if exists
        restoreLoginState();
        
        // Show homepage by default (will be overridden if user is logged in)
        showHomepage();
        
        // Load jobs
        loadJobs();
        
        // Add sample data if none exists
        if (AppState.students.length === 0) {
            addSampleStudentData();
        }
        if (AppState.jobs.length === 0) {
            addSampleJobData(false);
        }
        
        // Test login functionality
        setTimeout(() => {
            testStudentLogin();
        }, 1000);
        
        // Set up PWA install prompt
        setupPWAInstallPrompt();
        
        // Check PWA requirements
        checkPWARequirements();
        
        // Initialize animations
        animateElements();
        
        // Set up periodic job status checks (every 5 minutes)
        setInterval(checkAndUpdateJobStatuses, 5 * 60 * 1000);
        
        console.log('✅ App initialized successfully');
        
    } catch (error) {
        console.error('❌ App initialization failed:', error);
        
        // Show error message to user
        showNotification('Failed to connect to database. Please refresh the page.', 'error');
        
        // Set up offline detection anyway
        setupOfflineDetection();
        
        // Show student dashboard with empty state
        showStudentDashboard();
        loadJobs();
        animateElements();
    }
}

// Offline detection and handling
function setupOfflineDetection() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
        console.log('Connection restored');
        updateConnectionStatus('connecting');
        // Try to reconnect to Firebase
        setTimeout(() => {
            setupFirebaseListeners();
        }, 1000);
    });
    
    window.addEventListener('offline', () => {
        console.log('Connection lost');
        updateConnectionStatus('offline');
    });
    
    // Initial connection status
    if (navigator.onLine) {
        updateConnectionStatus('connecting');
    } else {
        updateConnectionStatus('offline');
    }
}

// Data persistence functions (Firebase cloud-only)
async function saveDataToStorage() {
    console.log('saveDataToStorage called');
    const dataToSave = {
        jobs: AppState.jobs,
        shortlistedData: AppState.shortlistedData,
        jobShortlisted: AppState.jobShortlisted,
        notifications: AppState.notifications,
        admins: AppState.admins,
        students: AppState.students,
        eligibilityCriteria: AppState.eligibilityCriteria
    };
    
    console.log('Data to save:', dataToSave);
    console.log('Students count:', dataToSave.students.length);
    
    // Save to Firebase (primary)
    await saveDataToFirebase(dataToSave);
    
    // No localStorage backup - cloud-only storage
}

function loadDataFromStorage() {
    // No localStorage - always start with empty state
    console.log('Starting with empty state - no localStorage');
    
    AppState.jobs = [];
    AppState.shortlistedData = [];
    AppState.jobShortlisted = {};
    AppState.notifications = [];
    AppState.admins = [];
    AppState.students = [];
    AppState.eligibilityCriteria = {
        min10thMarks: 60,
        min12thMarks: 60,
        minCGPAMarks: 6.0
    };
    AppState.filteredJobs = [];
    AppState.filteredShortlistedData = [];
    
    console.log('✅ Empty state initialized');
}


// Debug function - no localStorage
function debugLocalStorage() {
    console.log('No localStorage - using cloud-only storage');
}

// Legacy download functions removed - now using PDF download instead

function downloadShortlistedData() {
    try {
        if (AppState.shortlistedData.length === 0) {
            showNotification('No shortlisted data available to download', 'warning');
            return;
        }

        const csvContent = convertToCSV(AppState.shortlistedData);
        downloadCSV(csvContent, 'shortlisted_candidates.csv');
        showNotification('Shortlisted data downloaded successfully!', 'success');
    } catch (error) {
        console.error('Error downloading shortlisted data:', error);
        showNotification('Error downloading shortlisted data', 'error');
    }
}

function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    // Add headers
    csvRows.push(headers.join(','));
    
    // Add data rows
    for (const row of data) {
        const values = headers.map(header => {
            const value = row[header];
            // Escape commas and quotes in CSV
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value || '';
        });
        csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
}

function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

// Test Notification Function
function testNotification() {
    console.log('🧪 Testing notification system...');
    
    // Add a test notification
    addNotification({
        type: 'info',
        title: 'Test Notification - Firebase Working!',
        message: `This test notification was created at ${new Date().toLocaleTimeString()}. If you can see this, Firebase is working correctly!`,
        action: {
            text: 'Got it!',
            callback: () => showNotification('Test notification acknowledged!', 'success')
        }
    });
    
    // Show success message
    showNotification('Real-time test notification sent! Check for enhanced features like sound and browser notifications.', 'success');
    
    // Update the notifications display
    loadAdminNotifications();
    displayNotifications();
    
    console.log('✅ Real-time test notification created - Enhanced system is working!');
}

// Test enhanced real-time notification system
function testRealtimeNotification() {
    console.log('🚀 Testing enhanced real-time notification system...');
    
    // Add a test notification that will trigger real-time updates
    addNotification({
        type: 'success',
        title: '🚀 Real-time System Test',
        message: 'This notification demonstrates the enhanced real-time features including sound, browser notifications, and animated display. It should appear automatically without any user action!',
        action: {
            text: 'Test Action',
            callback: () => showNotification('Real-time action executed!', 'success')
        }
    });
    
    showNotification('Real-time notification test completed! Check for automatic display.', 'success');
}

// Simple test function to verify real-time notifications work
function testSimpleRealtime() {
    console.log('🔔 Testing simple real-time notification...');
    
    // Create a simple test notification
    const testNotification = {
        id: Date.now(),
        type: 'info',
        title: '🔔 Simple Real-time Test',
        message: 'This is a simple test to verify real-time notifications are working automatically.',
        timestamp: Date.now(),
        time: new Date().toISOString(),
        read: false,
        realtime: true
    };
    
    // Show it immediately
    handleRealtimeNotification(testNotification);
    
    console.log('✅ Simple real-time test completed');
}

// Clear All Notifications Function (for debugging)
async function clearAllNotifications() {
    // Default admin password
    const defaultAdminPassword = 'admin123';
    
    // Prompt for admin password
    const enteredPassword = prompt('Enter admin password to clear all notifications:');
    
    if (enteredPassword === null) {
        // User cancelled
        return;
    }
    
    if (enteredPassword !== defaultAdminPassword) {
        showNotification('Invalid admin password! Access denied.', 'error');
        return;
    }
    
    if (!confirm('Are you sure you want to clear ALL notifications? This action cannot be undone.')) {
        return;
    }
    
    try {
        // Clear notifications from app state
        AppState.notifications = [];
        
        // Save to Firebase
        await saveDataToStorage();
        
        // Update UI
        displayNotifications();
        loadAdminNotifications();
        loadAllNotifications();
        
        showNotification('All notifications cleared successfully!', 'success');
        console.log('All notifications cleared from Firebase');
        
    } catch (error) {
        console.error('Error clearing notifications:', error);
        showNotification('Error clearing notifications', 'error');
    }
}

// Clear All Jobs Function
async function clearAllJobs() {
    // Default admin password
    const defaultAdminPassword = 'admin123';
    
    // Prompt for admin password
    const enteredPassword = prompt('Enter admin password to clear all jobs:');
    
    if (enteredPassword === null) {
        // User cancelled
        return;
    }
    
    if (enteredPassword !== defaultAdminPassword) {
        showNotification('Invalid admin password! Access denied.', 'error');
        return;
    }
    
    if (!confirm('Are you sure you want to clear ALL jobs? This action cannot be undone.')) {
        return;
    }
    
    try {
        // Clear jobs from app state
        AppState.jobs = [];
        AppState.filteredJobs = [];
        
        // Save to Firebase
        await saveDataToStorage();
        
        // Update UI
        loadJobs();
        loadAdminJobList();
        
        showNotification('All jobs cleared successfully!', 'success');
        console.log('All jobs cleared from Firebase');
        
    } catch (error) {
        console.error('Error clearing jobs:', error);
        showNotification('Error clearing jobs', 'error');
    }
}

// Clear All Shortlisted Data Function
async function clearAllShortlistedData() {
    // Default admin password
    const defaultAdminPassword = 'admin123';
    
    // Prompt for admin password
    const enteredPassword = prompt('Enter admin password to clear all shortlisted data:');
    
    if (enteredPassword === null) {
        // User cancelled
        return;
    }
    
    if (enteredPassword !== defaultAdminPassword) {
        showNotification('Invalid admin password! Access denied.', 'error');
        return;
    }
    
    if (!confirm('Are you sure you want to clear ALL shortlisted data? This action cannot be undone.')) {
        return;
    }
    
    try {
        // Clear shortlisted data from app state
        AppState.shortlistedData = [];
        AppState.filteredShortlistedData = [];
        AppState.jobShortlisted = {};
        
        // Save to Firebase
        await saveDataToStorage();
        
        // Update UI
        loadShortlistedView();
        loadCompanyView();
        
        showNotification('All shortlisted data cleared successfully!', 'success');
        console.log('All shortlisted data cleared from Firebase');
        
    } catch (error) {
        console.error('Error clearing shortlisted data:', error);
        showNotification('Error clearing shortlisted data', 'error');
    }
}

// Force Refresh Data Function (for debugging)
async function forceRefreshData() {
    try {
        console.log('Force refreshing data from Firebase...');
        
        // Reset Firebase ready state and try to reconnect
        isFirebaseReady = false;
        await waitForFirebase();
        
        await loadDataFromFirebase();
        
        // Update all UI components
        if (document.getElementById('admin-job-list')) {
            loadAdminJobList();
        }
        if (document.getElementById('job-listings')) {
            loadJobs();
        }
        if (document.getElementById('admin-list')) {
            loadAdminList();
        }
        if (document.getElementById('companies-grid')) {
            loadCompanyView();
        }
        if (document.getElementById('notifications-list')) {
            displayNotifications();
        }
        if (document.getElementById('admin-notifications-list')) {
            loadAdminNotifications();
        }
        if (document.getElementById('all-notifications-list')) {
            loadAllNotifications();
        }
        
        showNotification('Data refreshed from Firebase!', 'success');
        console.log('Data refresh completed');
        
    } catch (error) {
        console.error('Error refreshing data:', error);
        showNotification('Error refreshing data: ' + error.message, 'error');
    }
}

// Retry Firebase Connection Function
async function retryFirebaseConnection() {
    try {
        console.log('Retrying Firebase connection...');
        updateConnectionStatus('connecting');
        
        // Reset Firebase ready state
        isFirebaseReady = false;
        window.firebaseInitialized = false;
        window.firebaseError = null;
        
        // Wait for Firebase to be ready again
        await waitForFirebase();
        
        // Test Firebase connection
        await testFirebaseConnection();
        
        // Set up listeners again
        setupFirebaseListeners();
        
        // Load data
        await loadDataFromFirebase();
        
        showNotification('Firebase connection restored!', 'success');
        console.log('Firebase connection retry successful');
        
    } catch (error) {
        console.error('Firebase connection retry failed:', error);
        showNotification('Failed to reconnect to Firebase: ' + error.message, 'error');
    }
}

// Test Firebase Connection Function
async function testFirebaseConnection() {
    try {
        console.log('Testing Firebase connection...');
        
        if (!window.firebaseDatabase || !window.firebaseRef) {
            throw new Error('Firebase not initialized');
        }
        
        // Test with a simple read operation
        const testRef = window.firebaseRef(window.firebaseDatabase, 'test');
        const snapshot = await window.firebaseGet(testRef);
        
        console.log('✅ Firebase connection test successful');
        console.log('📊 Test data:', snapshot.exists() ? snapshot.val() : 'No test data (this is normal)');
        
        // Also test writing a simple value
        const writeTestRef = window.firebaseRef(window.firebaseDatabase, 'connectionTest');
        await window.firebaseSet(writeTestRef, {
            timestamp: Date.now(),
            message: 'Connection test successful',
            userAgent: navigator.userAgent.substring(0, 50) + '...'
        });
        
        console.log('✅ Firebase write test successful');
        showNotification('Firebase connection test passed! ✅', 'success');
        return true;
        
    } catch (error) {
        console.error('❌ Firebase connection test failed:', error);
        showNotification('Firebase connection test failed: ' + error.message, 'error');
        throw error;
    }
}

// Download Website as PDF Function
async function downloadWebsiteAsPDF() {
    try {
        console.log('Generating PDF of the website...');
        showNotification('Generating PDF... Please wait', 'info');
        
        // Create a new window with the current page content
        const printWindow = window.open('', '_blank');
        
        // Get the current page content
        const currentContent = document.documentElement.outerHTML;
        
        // Create a clean HTML for PDF generation
        const pdfContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Dayananda Sagar Institutions - Placement Portal</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 20px; 
                        line-height: 1.6;
                        color: #333;
                    }
                    .header { 
                        text-align: center; 
                        border-bottom: 2px solid #ff6f00; 
                        padding-bottom: 20px; 
                        margin-bottom: 30px;
                    }
                    .section { 
                        margin-bottom: 30px; 
                        page-break-inside: avoid;
                    }
                    .section h2 { 
                        color: #ff6f00; 
                        border-bottom: 1px solid #ddd; 
                        padding-bottom: 10px;
                    }
                    .job-card { 
                        border: 1px solid #ddd; 
                        padding: 15px; 
                        margin-bottom: 15px; 
                        border-radius: 8px;
                        background: #f9f9f9;
                    }
                    .notification-item { 
                        border-left: 4px solid #ff6f00; 
                        padding: 10px; 
                        margin-bottom: 10px; 
                        background: #f5f5f5;
                    }
                    .stats { 
                        display: flex; 
                        justify-content: space-around; 
                        margin: 20px 0;
                    }
                    .stat-item { 
                        text-align: center; 
                        padding: 15px; 
                        background: #f0f0f0; 
                        border-radius: 8px;
                    }
                    @media print {
                        .no-print { display: none !important; }
                        body { margin: 0; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Dayananda Sagar Institutions</h1>
                    <h2>Placement Portal</h2>
                    <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                </div>
                
                <div class="section">
                    <h2>📊 Portal Statistics</h2>
                    <div class="stats">
                        <div class="stat-item">
                            <h3>${AppState.jobs.length}</h3>
                            <p>Total Jobs</p>
                        </div>
                        <div class="stat-item">
                            <h3>${AppState.notifications.length}</h3>
                            <p>Notifications</p>
                        </div>
                        <div class="stat-item">
                            <h3>${AppState.shortlistedData.length}</h3>
                            <p>Shortlisted Candidates</p>
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <h2>📋 Job Listings</h2>
                    ${AppState.jobs.map(job => `
                        <div class="job-card">
                            <h3>${job.position} - ${job.company}</h3>
                            <p><strong>Location:</strong> ${job.location}</p>
                            <p><strong>Type:</strong> ${job.type}</p>
                            <p><strong>Salary:</strong> ${job.salary}</p>
                            <p><strong>Status:</strong> ${job.status}</p>
                            <p><strong>Posted:</strong> ${new Date(job.postedDate).toLocaleDateString()}</p>
                            <p><strong>Description:</strong> ${job.description}</p>
                        </div>
                    `).join('')}
                </div>
                
                <div class="section">
                    <h2>🔔 Notifications</h2>
                    ${AppState.notifications.map(notification => `
                        <div class="notification-item">
                            <h4>${notification.title}</h4>
                            <p>${notification.message}</p>
                            <small>Posted: ${new Date(notification.timestamp).toLocaleDateString()}</small>
                        </div>
                    `).join('')}
                </div>
                
                <div class="section">
                    <h2>📈 Shortlisted Candidates</h2>
                    ${AppState.shortlistedData.map(candidate => `
                        <div class="job-card">
                            <h3>${candidate.name}</h3>
                            <p><strong>Company:</strong> ${candidate.company}</p>
                            <p><strong>Position:</strong> ${candidate.position}</p>
                            <p><strong>Status:</strong> ${candidate.status}</p>
                            <p><strong>Date:</strong> ${new Date(candidate.date).toLocaleDateString()}</p>
                        </div>
                    `).join('')}
                </div>
            </body>
            </html>
        `;
        
        // Write content to new window
        printWindow.document.write(pdfContent);
        printWindow.document.close();
        
        // Wait for content to load, then trigger print
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
            showNotification('PDF download initiated! Check your print dialog.', 'success');
        }, 1000);
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        showNotification('Error generating PDF: ' + error.message, 'error');
    }
}

// Real-time Update Indicator
function showUpdateIndicator() {
    const indicator = document.getElementById('connection-indicator');
    if (indicator) {
        // Add a subtle pulse animation
        indicator.style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => {
            indicator.style.animation = '';
        }, 500);
    }
}

// Clear all test data - no localStorage
function clearTestData() {
    console.log('No localStorage to clear - using cloud-only storage');
    
    // Reset app state completely
    AppState.jobs = [];
    AppState.filteredJobs = [];
    AppState.shortlistedData = [];
    AppState.filteredShortlistedData = [];
    AppState.jobShortlisted = {};
    AppState.notifications = [];
    AppState.admins = [];
    AppState.currentCompanyData = [];
    AppState.currentCompanyFullData = null;
    
    // Clear any existing UI
    const companiesGrid = document.getElementById('companies-grid');
    if (companiesGrid) {
        companiesGrid.innerHTML = `
            <div class="no-companies-message">
                <div class="no-data-icon">
                    <i class="fas fa-building"></i>
                </div>
                <h3>No Companies with Shortlisted Candidates</h3>
                <p>Companies will appear here once the admin uploads shortlisted data.</p>
            </div>
        `;
    }
    
    // Update UI immediately
    loadJobs();
    loadAdminJobList();
    
    showNotification('All test data cleared successfully!', 'success');
    
    // Reload the page to ensure clean state
    setTimeout(() => {
        location.reload();
    }, 1000);
}

// Clear only shortlisted data
async function clearShortlistedData() {
    try {
        showNotification('Clearing ALL dummy data from database and cache...', 'info');
        
        // Clear from Firebase database - multiple paths
        if (typeof database !== 'undefined') {
            // Clear all possible Firebase paths
            const paths = [
                'jobs',
                'shortlistedData', 
                'jobShortlisted',
                'placementPortalData',
                'shortlisted',
                'candidates',
                'companies'
            ];
            
            for (const path of paths) {
                try {
                    const refPath = ref(database, path);
                    await set(refPath, {});
                    console.log(`Cleared Firebase path: ${path}`);
                } catch (error) {
                    console.log(`Could not clear path ${path}:`, error);
                }
            }
        }
        
        // Clear all data from AppState
        AppState.shortlistedData = [];
        AppState.filteredShortlistedData = [];
        AppState.jobShortlisted = {};
        AppState.currentCompanyData = [];
        AppState.currentCompanyFullData = null;
        AppState.jobs = [];
        AppState.filteredJobs = [];
        AppState.notifications = [];
        AppState.admins = [];
        
        // No localStorage to clear - using cloud-only storage
        
        // Clear UI immediately and force empty state
        const companiesGrid = document.getElementById('companies-grid');
        if (companiesGrid) {
            companiesGrid.innerHTML = `
                <div class="no-companies-message">
                    <div class="no-data-icon">
                        <i class="fas fa-building"></i>
                    </div>
                    <h3>No Companies with Shortlisted Candidates</h3>
                    <p>Companies will appear here once the admin uploads shortlisted data.</p>
                </div>
            `;
        }
        
        // Clear all UI elements
        const shortlistedDataSection = document.getElementById('shortlisted-data-section');
        if (shortlistedDataSection) {
            shortlistedDataSection.style.display = 'none';
        }
        
        const noShortlistedData = document.getElementById('no-shortlisted-data');
        if (noShortlistedData) {
            noShortlistedData.style.display = 'block';
        }
        
        const jobListings = document.getElementById('job-listings');
        if (jobListings) {
            jobListings.innerHTML = '';
        }
        
        // Disable Firebase listeners temporarily
        if (window.firebaseListeners) {
            Object.values(window.firebaseListeners).forEach(unsubscribe => {
                if (typeof unsubscribe === 'function') {
                    unsubscribe();
                }
            });
            window.firebaseListeners = {};
        }
        
        showNotification('ALL dummy data cleared! Reloading page...', 'success');
        
        // Force reload with cache busting
        setTimeout(() => {
            window.location.href = window.location.href + '?clear=' + Date.now();
        }, 1500);
        
    } catch (error) {
        console.error('Error clearing data:', error);
        showNotification('Error clearing data: ' + error.message, 'error');
    }
}

// Debug function to show current app state
function debugAppState() {
    console.log('=== CURRENT APP STATE ===');
    console.log('Jobs:', AppState.jobs);
    console.log('Shortlisted Data:', AppState.shortlistedData);
    console.log('Job Shortlisted:', AppState.jobShortlisted);
    console.log('Filtered Shortlisted Data:', AppState.filteredShortlistedData);
    console.log('========================');
}

// Debug function to check Firebase database
async function debugFirebaseData() {
    try {
        if (typeof database !== 'undefined') {
            console.log('=== FIREBASE DATABASE DATA ===');
            
            // Check jobs
            const jobsRef = ref(database, 'jobs');
            const jobsSnapshot = await get(jobsRef);
            console.log('Firebase Jobs:', jobsSnapshot.val());
            
            // Check shortlisted data
            const shortlistedRef = ref(database, 'shortlistedData');
            const shortlistedSnapshot = await get(shortlistedRef);
            console.log('Firebase Shortlisted Data:', shortlistedSnapshot.val());
            
            // Check job shortlisted data
            const jobShortlistedRef = ref(database, 'jobShortlisted');
            const jobShortlistedSnapshot = await get(jobShortlistedRef);
            console.log('Firebase Job Shortlisted:', jobShortlistedSnapshot.val());
            
            console.log('==============================');
        } else {
            console.log('Firebase database not available');
        }
    } catch (error) {
        console.error('Error checking Firebase data:', error);
    }
}

// Make debug functions available globally for testing
window.debugLocalStorage = debugLocalStorage;
window.debugAppState = debugAppState;
window.debugFirebaseData = debugFirebaseData;
window.clearTestData = clearTestData;
window.clearShortlistedData = clearShortlistedData;

// Test job creation function removed to prevent dummy data

// Student Data Management Functions
function generateRandomPassword(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

function validateStudentData(studentData) {
    console.log('Validating student data:', studentData);
    
    const requiredFields = ['usn', 'name', 'email', 'cgpa', 'marks10th', 'marks12th'];
    for (const field of requiredFields) {
        const value = studentData[field];
        if (!value || value.toString().trim() === '' || value.toString().trim() === 'undefined') {
            console.log(`Validation failed: Missing required field: ${field}, value:`, value);
            return `Missing required field: ${field}`;
        }
    }
    
    // Validate email format - be more lenient
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentData.email)) {
        console.log(`Validation failed: Invalid email format: ${studentData.email}`);
        return `Invalid email format: ${studentData.email}`;
    }
    
    // Validate numeric fields
    const cgpa = parseFloat(studentData.cgpa);
    const marks10th = parseFloat(studentData.marks10th);
    const marks12th = parseFloat(studentData.marks12th);
    
    if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
        console.log(`Validation failed: Invalid CGPA: ${studentData.cgpa}`);
        return `CGPA must be between 0 and 10, got: ${studentData.cgpa}`;
    }
    
    if (isNaN(marks10th) || marks10th < 0 || marks10th > 100) {
        console.log(`Validation failed: Invalid 10th marks: ${studentData.marks10th}`);
        return `10th marks must be between 0 and 100, got: ${studentData.marks10th}`;
    }
    
    if (isNaN(marks12th) || marks12th < 0 || marks12th > 100) {
        console.log(`Validation failed: Invalid 12th marks: ${studentData.marks12th}`);
        return `12th marks must be between 0 and 100, got: ${studentData.marks12th}`;
    }
    
    console.log('Validation passed for student data');
    return null; // No validation errors
}

function processStudentDataFromCSV(csvData) {
    console.log('processStudentDataFromCSV called with data:', csvData);
    const students = [];
    const errors = [];
    
    console.log('Processing', csvData.length, 'rows of data');
    
    // Skip header row
    for (let i = 1; i < csvData.length; i++) {
        console.log(`Processing row ${i}:`, csvData[i]);
        const row = csvData[i];
        if (row.length < 6) {
            errors.push(`Row ${i + 1}: Insufficient data columns (need at least 6 columns)`);
            continue;
        }
        
        const studentData = {
            usn: (row[0] && row[0].toString().trim() !== '') ? row[0].toString().trim() : '',
            name: (row[1] && row[1].toString().trim() !== '') ? row[1].toString().trim() : '',
            email: (row[2] && row[2].toString().trim() !== '') ? row[2].toString().trim() : '',
            cgpa: (row[3] && row[3].toString().trim() !== '') ? row[3].toString().trim() : '',
            marks10th: (row[4] && row[4].toString().trim() !== '') ? row[4].toString().trim() : '',
            marks12th: (row[5] && row[5].toString().trim() !== '') ? row[5].toString().trim() : ''
        };
        
        console.log('Student data extracted:', studentData);
        
        // Skip rows with completely empty data
        if (!studentData.usn && !studentData.name && !studentData.email && !studentData.cgpa && !studentData.marks10th && !studentData.marks12th) {
            console.log(`Skipping empty row ${i + 1}`);
            continue;
        }
        
        const validationError = validateStudentData(studentData);
        if (validationError) {
            console.log(`Validation error for row ${i + 1}:`, validationError);
            errors.push(`Row ${i + 1}: ${validationError}`);
            continue;
        }
        console.log('Student data validated successfully');
        
        // Check for duplicate email and USN
        if (AppState.students.some(s => s.email === studentData.email)) {
            console.log(`Duplicate email found for row ${i + 1}:`, studentData.email);
            errors.push(`Row ${i + 1}: Email already exists`);
            continue;
        }
        
        if (AppState.students.some(s => s.usn === studentData.usn)) {
            console.log(`Duplicate USN found for row ${i + 1}:`, studentData.usn);
            errors.push(`Row ${i + 1}: USN already exists`);
            continue;
        }
        
        // Generate password and add to student data
        const student = {
            id: `student_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            usn: studentData.usn,
            name: studentData.name,
            email: studentData.email,
            cgpa: parseFloat(studentData.cgpa),
            marks10th: parseFloat(studentData.marks10th),
            marks12th: parseFloat(studentData.marks12th),
            password: generateRandomPassword(),
            createdAt: new Date().toISOString(),
            isEligible: checkStudentEligibility(studentData)
        };
        
        console.log('Created student object:', student);
        students.push(student);
        console.log('Added student to array. Total students so far:', students.length);
    }
    
    console.log('Final result - Students:', students.length, 'Errors:', errors.length);
    console.log('Students array:', students);
    console.log('Errors array:', errors);
    
    return { students, errors };
}

function checkStudentEligibility(studentData) {
    const cgpa = parseFloat(studentData.cgpa);
    const marks10th = parseFloat(studentData.marks10th);
    const marks12th = parseFloat(studentData.marks12th);
    
    return cgpa >= AppState.eligibilityCriteria.minCGPAMarks &&
           marks10th >= AppState.eligibilityCriteria.min10thMarks &&
           marks12th >= AppState.eligibilityCriteria.min12thMarks;
}

function checkStudentEligibilityForJob(studentData, job) {
    const cgpa = parseFloat(studentData.cgpa);
    const marks10th = parseFloat(studentData.marks10th);
    const marks12th = parseFloat(studentData.marks12th);
    
    // Use job-specific requirements if available, otherwise use global criteria
    const minCgpa = job.academicRequirements?.minCGPAMarks || AppState.eligibilityCriteria.minCGPAMarks;
    const min10th = job.academicRequirements?.min10thMarks || AppState.eligibilityCriteria.min10thMarks;
    const min12th = job.academicRequirements?.min12thMarks || AppState.eligibilityCriteria.min12thMarks;
    
    // Check academic eligibility first
    const academicEligible = cgpa >= minCgpa &&
                           marks10th >= min10th &&
                           marks12th >= min12th;
    
    if (!academicEligible) {
        console.log('❌ Student not academically eligible for job:', job.id);
        return false;
    }
    
    // Check salary range eligibility using our new logic
    const salaryEligible = canStudentApplyToJobSilent(studentData, job);
    
    console.log('🎯 Job eligibility check:', {
        jobId: job.id,
        jobTitle: job.title,
        academicEligible,
        salaryEligible,
        finalEligible: academicEligible && salaryEligible
    });
    
    return academicEligible && salaryEligible;
}

// Function to get detailed eligibility failure reasons
function getEligibilityFailureReasons(studentData, job) {
    const reasons = [];
    
    const cgpa = parseFloat(studentData.cgpa);
    const marks10th = parseFloat(studentData.marks10th);
    const marks12th = parseFloat(studentData.marks12th);
    
    // Use job-specific requirements if available, otherwise use global criteria
    const minCgpa = job.academicRequirements?.minCGPAMarks || AppState.eligibilityCriteria.minCGPAMarks;
    const min10th = job.academicRequirements?.min10thMarks || AppState.eligibilityCriteria.min10thMarks;
    const min12th = job.academicRequirements?.min12thMarks || AppState.eligibilityCriteria.min12thMarks;
    
    // Check academic eligibility (percentage criteria)
    if (cgpa < minCgpa) {
        reasons.push(`CGPA requirement not met (${cgpa} < ${minCgpa})`);
    }
    if (marks10th < min10th) {
        reasons.push(`10th marks requirement not met (${marks10th}% < ${min10th}%)`);
    }
    if (marks12th < min12th) {
        reasons.push(`12th marks requirement not met (${marks12th}% < ${min12th}%)`);
    }
    
    // Check placement policy eligibility
    const salaryEligible = canStudentApplyToJobSilent(studentData, job);
    if (!salaryEligible) {
        const studentRange = getStudentSalaryRange(studentData);
        const jobSalary = parseJobSalary(job.salary);
        
        if (studentData.isPlaced) {
            if (studentData.canApplyToJobs === '10+') {
                reasons.push(`Placement policy: You can only apply to jobs with 10+ LPA (Job salary: ${jobSalary} LPA)`);
            } else if (studentData.canApplyToJobs === '20+') {
                reasons.push(`Placement policy: You can only apply to jobs with 20+ LPA (Job salary: ${jobSalary} LPA)`);
            } else if (studentData.canApplyToJobs === 'none') {
                reasons.push(`Placement policy: You cannot apply to any jobs as you are already placed at the highest level`);
            }
        } else {
            if (job.eligibleSalaryRanges && job.eligibleSalaryRanges.length > 0) {
                reasons.push(`Placement policy: This job is only for students with specific placement status`);
            }
        }
    }
    
    return reasons;
}

// Helper function to get student salary range
function getStudentSalaryRange(student) {
    if (!student.isPlaced) return 'not-placed';
    
    const salary = parseFloat(student.currentSalary) || 0;
    if (salary < 10) return 'below10';
    if (salary < 20) return 'below20';
    return 'above20';
}

// Helper function to parse job salary
function parseJobSalary(salaryString) {
    if (!salaryString) return 0;
    
    // Extract numeric value from salary string - look for patterns like "Rs 25", "25 LPA", "25-30 LPA", etc.
    const patterns = [
        /(\d+(?:\.\d+)?)\s*-\s*\d+(?:\.\d+)?\s*LPA/i,  // Range like "25-30 LPA"
        /(\d+(?:\.\d+)?)\s*LPA/i,                      // Single value like "25 LPA"
        /Rs\s*(\d+(?:\.\d+)?)/i,                       // "Rs 25"
        /(\d+(?:\.\d+)?)/                              // Just numbers
    ];
    
    for (const pattern of patterns) {
        const match = salaryString.match(pattern);
        if (match) {
            return parseFloat(match[1]);
        }
    }
    
    return 0;
}

async function addStudentsToDatabase(students) {
    console.log('Adding students to database:', students);
    AppState.students.push(...students);
    console.log('Total students in AppState:', AppState.students.length);
    
    try {
        await saveDataToStorage();
        console.log('Data saved successfully');
        showNotification(`Successfully added ${students.length} students`, 'success');
    } catch (error) {
        console.error('Error saving student data:', error);
        showNotification('Error saving student data: ' + error.message, 'error');
    }
}

// Admin Management Functions
function showJobManagement() {
    console.log('Showing Job Management Page');
    hideAllPages();
    document.getElementById('job-management-page').classList.add('active');
    setActiveNav('admin-nav');
    loadAdminJobList();
    showNotification('Job Management page opened', 'info');
}

function showNotificationsManagement() {
    console.log('Showing Notifications Management Page');
    hideAllPages();
    document.getElementById('notifications-management-page').classList.add('active');
    setActiveNav('admin-nav');
    loadAdminNotificationsManagement();
    showNotification('Notifications Management page opened', 'info');
    
    // Add a test notification if none exist
    if (AppState.notifications.length === 0) {
        console.log('No notifications found, creating a test notification');
        addNotification({
            type: 'info',
            title: 'Test Notification',
            message: 'This is a test notification to verify edit/delete functionality works properly.'
        });
    }
    
    // Force reload the notifications management list
    setTimeout(() => {
        loadAdminNotificationsManagement();
    }, 100);
}

function loadAdminNotificationsManagement() {
    const adminNotificationsList = document.getElementById('notifications-management-list');
    if (!adminNotificationsList) return;
    
    console.log('Loading admin notifications management list, total notifications:', AppState.notifications.length);
    console.log('Notification details:', AppState.notifications.map(n => ({ id: n.id, title: n.title, idType: typeof n.id })));
    
    // Fix any notifications that might be missing timestamps
    let needsSave = false;
    AppState.notifications.forEach(notification => {
        if (!notification.timestamp) {
            console.log('Fixing notification missing timestamp:', notification.id);
            notification.timestamp = notification.time ? new Date(notification.time).getTime() : Date.now();
            needsSave = true;
        }
    });
    
    if (needsSave) {
        saveDataToStorage();
        console.log('Fixed notifications with missing timestamps');
    }
    
    // Display notifications in admin management format
    if (AppState.notifications.length === 0) {
        adminNotificationsList.innerHTML = `
            <div class="no-data-message">
                <div class="no-data-icon">
                    <i class="fas fa-bell"></i>
                </div>
                <h3>No Notifications Found</h3>
                <p>No notifications have been created yet.</p>
                <p>Use the "Add Notification" button to create new notifications.</p>
            </div>
        `;
        return;
    }
    
    adminNotificationsList.innerHTML = AppState.notifications.map(notification => `
        <div class="notification-card">
            <div class="notification-header">
                <h4 class="notification-title">${notification.title || 'Untitled Notification'}</h4>
                <span class="notification-timestamp">${formatTimestamp(notification.timestamp)}</span>
            </div>
            <div class="notification-message">
                ${notification.message || 'No message content'}
            </div>
            <div class="notification-actions">
                <button onclick="console.log('Edit button clicked for ID:', '${notification.id}'); editNotification('${notification.id}')" class="edit-btn" title="Edit Notification">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="console.log('Delete button clicked for ID:', '${notification.id}'); deleteNotification('${notification.id}')" class="delete-btn" title="Delete Notification">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function formatTimestamp(timestamp) {
    if (!timestamp) return 'Unknown';
    
    // Handle both timestamp (number) and time (ISO string) formats
    let date;
    if (typeof timestamp === 'number') {
        date = new Date(timestamp);
    } else if (typeof timestamp === 'string') {
        date = new Date(timestamp);
    } else {
        return 'Invalid date';
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
        return 'Invalid date';
    }
    
    const now = Date.now();
    const diff = now - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
}

function editNotification(notificationId) {
    console.log('=== EDIT NOTIFICATION FUNCTION START ===');
    console.log('Editing notification:', notificationId, 'Type:', typeof notificationId);
    console.log('AppState exists:', !!AppState);
    console.log('AppState.notifications exists:', !!AppState.notifications);
    console.log('AppState.notifications length:', AppState.notifications ? AppState.notifications.length : 'N/A');
    console.log('Available notifications:', AppState.notifications ? AppState.notifications.map(n => ({ id: n.id, title: n.title, idType: typeof n.id })) : 'N/A');
    
    // Check if AppState or notifications array is missing
    if (!AppState) {
        console.error('AppState is not defined!');
        showNotification('Application state not available', 'error');
        return;
    }
    
    if (!AppState.notifications) {
        console.error('AppState.notifications is not defined!');
        showNotification('Notifications data not available', 'error');
        return;
    }
    
    if (!Array.isArray(AppState.notifications)) {
        console.error('AppState.notifications is not an array!', typeof AppState.notifications);
        showNotification('Notifications data is corrupted', 'error');
        return;
    }
    
    // Find the notification - try both string and number comparison
    console.log('Searching for notification with ID:', notificationId);
    let notification = AppState.notifications.find(n => n.id == notificationId);
    console.log('First search result (==):', notification);
    
    if (!notification) {
        // Try with parsed integer
        const parsedId = parseInt(notificationId);
        console.log('Trying with parsed integer:', parsedId);
        notification = AppState.notifications.find(n => n.id === parsedId);
        console.log('Second search result (=== parsed):', notification);
    }
    if (!notification) {
        // Try with string comparison
        console.log('Trying with string comparison');
        notification = AppState.notifications.find(n => String(n.id) === String(notificationId));
        console.log('Third search result (string):', notification);
    }
    
    if (!notification) {
        console.error('Notification not found after all search attempts!');
        console.error('Searched for:', notificationId, 'Type:', typeof notificationId);
        console.error('Available IDs:', AppState.notifications.map(n => ({ id: n.id, type: typeof n.id })));
        showNotification('Notification not found', 'error');
        return;
    }
    
    console.log('Notification found:', notification);
    
    // Populate the edit form with existing data
    try {
        const idField = document.getElementById('edit-notification-id');
        const typeField = document.getElementById('edit-notification-type');
        const titleField = document.getElementById('edit-notification-title');
        const messageField = document.getElementById('edit-notification-message');
        
        if (!idField || !typeField || !titleField || !messageField) {
            console.error('Edit form elements not found');
            showNotification('Edit form not available', 'error');
            return;
        }
        
        idField.value = notification.id;
        typeField.value = notification.type || 'info';
        titleField.value = notification.title || '';
        messageField.value = notification.message || '';
    } catch (error) {
        console.error('Error populating edit form:', error);
        showNotification('Error loading edit form', 'error');
        return;
    }
    
    // Handle action data
    const actionEnabled = notification.action && notification.action.text;
    document.getElementById('edit-notification-action-enabled').checked = actionEnabled;
    
    if (actionEnabled) {
        document.getElementById('edit-notification-action-text').value = notification.action.text || '';
        document.getElementById('edit-notification-action-link').value = notification.action.link || '';
        document.getElementById('edit-notification-action-section').style.display = 'block';
    } else {
        document.getElementById('edit-notification-action-text').value = '';
        document.getElementById('edit-notification-action-link').value = '';
        document.getElementById('edit-notification-action-section').style.display = 'none';
    }
    
    // Show the edit modal
    try {
        const modal = document.getElementById('edit-notification-modal');
        if (!modal) {
            console.error('Edit notification modal not found');
            showNotification('Edit modal not available', 'error');
            return;
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        showEditNotificationModal();
        console.log('Edit modal opened successfully');
    } catch (error) {
        console.error('Error opening edit modal:', error);
        showNotification('Error opening edit form', 'error');
    }
}

function deleteNotification(notificationId) {
    console.log('=== DELETE NOTIFICATION FUNCTION START ===');
    console.log('Deleting notification:', notificationId, 'Type:', typeof notificationId);
    console.log('AppState exists:', !!AppState);
    console.log('AppState.notifications exists:', !!AppState.notifications);
    console.log('AppState.notifications length:', AppState.notifications ? AppState.notifications.length : 'N/A');
    console.log('Available notifications:', AppState.notifications ? AppState.notifications.map(n => ({ id: n.id, title: n.title, idType: typeof n.id })) : 'N/A');
    
    // Check if AppState or notifications array is missing
    if (!AppState) {
        console.error('AppState is not defined!');
        showNotification('Application state not available', 'error');
        return;
    }
    
    if (!AppState.notifications) {
        console.error('AppState.notifications is not defined!');
        showNotification('Notifications data not available', 'error');
        return;
    }
    
    if (!Array.isArray(AppState.notifications)) {
        console.error('AppState.notifications is not an array!', typeof AppState.notifications);
        showNotification('Notifications data is corrupted', 'error');
        return;
    }
    
    if (confirm('Are you sure you want to delete this notification?')) {
        console.log('User confirmed deletion');
        
        // Find the notification with robust ID comparison
        console.log('Searching for notification with ID:', notificationId);
        let notification = AppState.notifications.find(n => n.id == notificationId);
        console.log('First search result (==):', notification);
        
        if (!notification) {
            // Try with parsed integer
            const parsedId = parseInt(notificationId);
            console.log('Trying with parsed integer:', parsedId);
            notification = AppState.notifications.find(n => n.id === parsedId);
            console.log('Second search result (=== parsed):', notification);
        }
        if (!notification) {
            // Try with string comparison
            console.log('Trying with string comparison');
            notification = AppState.notifications.find(n => String(n.id) === String(notificationId));
            console.log('Third search result (string):', notification);
        }
        
        if (!notification) {
            console.error('Notification not found for deletion after all search attempts!');
            console.error('Searched for:', notificationId, 'Type:', typeof notificationId);
            console.error('Available IDs:', AppState.notifications.map(n => ({ id: n.id, type: typeof n.id })));
            showNotification('Notification not found', 'error');
            return;
        }
        
        console.log('Notification found for deletion:', notification);
        
        const notificationTitle = notification.title || 'Unknown';
        
        // Remove the notification using the found notification's ID
        AppState.notifications = AppState.notifications.filter(n => n.id !== notification.id);
        
        // Save to storage
        saveDataToStorage();
        
        // Update all notification displays
        loadAdminNotificationsManagement();
        loadAdminNotifications();
        loadAllNotifications();
        displayNotifications();
        
        showNotification(`Notification "${notificationTitle}" deleted successfully!`, 'success');
        console.log('Notification deleted successfully');
    }
}

function showStudentDataManagement() {
    console.log('Showing Student Data Management Page');
    hideAllPages();
    document.getElementById('student-management-page').classList.add('active');
    setActiveNav('admin-nav');
    loadStudentList();
    showNotification('Student Data Management page opened', 'info');
}

function showAdminManagement() {
    console.log('Showing Admin Management Page');
    hideAllPages();
    document.getElementById('admin-management-page').classList.add('active');
    setActiveNav('admin-nav');
    loadAdminManagementList();
    showNotification('Admin Management page opened', 'info');
}

function loadAdminManagementList() {
    const adminList = document.getElementById('admin-list');
    if (!adminList) return;
    
    console.log('Loading admin management list, total admins:', AppState.admins.length);
    
    // Display admins in admin management format
    if (AppState.admins.length === 0) {
        adminList.innerHTML = `
            <div class="no-data-message">
                <div class="no-data-icon">
                    <i class="fas fa-user-shield"></i>
                </div>
                <h3>No Admins Found</h3>
                <p>No admin accounts have been created yet.</p>
                <p>Use the "Add Admin" button to create new admin accounts.</p>
            </div>
        `;
        return;
    }
    
    adminList.innerHTML = AppState.admins.map(admin => `
        <div class="admin-card">
            <div class="admin-header">
                <div class="admin-identity">
                    <h4 class="admin-name">${admin.username || admin.name || 'Admin'}</h4>
                    <p class="admin-email">${admin.email || 'admin@dsi.com'}</p>
                </div>
                <div class="admin-badges">
                    <span class="admin-role-badge default">Default Admin</span>
                    <span class="admin-status-badge active">Active</span>
                </div>
            </div>
            <div class="admin-created">
                Created: ${admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'Unknown'}
            </div>
        </div>
    `).join('');
}

function showAdminTools() {
    console.log('Showing Admin Tools Page');
    hideAllPages();
    document.getElementById('admin-tools-page').classList.add('active');
    setActiveNav('admin-nav');
    showNotification('Admin Tools page opened', 'info');
}

function showAdminToolsModal() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('admin-tools-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'admin-tools-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content admin-tools-modal">
                <span class="close" onclick="closeAdminToolsModal()">&times;</span>
                <h2>Admin Management Tools</h2>
                
                <div class="admin-tools-grid">
                    <div class="tool-card" onclick="showSystemAnalytics()">
                        <div class="tool-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <h3>System Analytics</h3>
                        <p>View system statistics and performance metrics</p>
                    </div>
                    
                    <div class="tool-card" onclick="showDataBackup()">
                        <div class="tool-icon">
                            <i class="fas fa-database"></i>
                        </div>
                        <h3>Data Backup</h3>
                        <p>Backup and restore system data</p>
                    </div>
                    
                    <div class="tool-card" onclick="showSystemLogs()">
                        <div class="tool-icon">
                            <i class="fas fa-file-alt"></i>
                        </div>
                        <h3>System Logs</h3>
                        <p>View system activity and error logs</p>
                    </div>
                    
                    <div class="tool-card" onclick="showSystemSettings()">
                        <div class="tool-icon">
                            <i class="fas fa-cog"></i>
                        </div>
                        <h3>System Settings</h3>
                        <p>Configure system preferences and options</p>
                    </div>
                    
                    <div class="tool-card" onclick="showUserActivity()">
                        <div class="tool-icon">
                            <i class="fas fa-user-clock"></i>
                        </div>
                        <h3>User Activity</h3>
                        <p>Monitor user login and activity logs</p>
                    </div>
                    
                    <div class="tool-card" onclick="showSystemHealth()">
                        <div class="tool-icon">
                            <i class="fas fa-heartbeat"></i>
                        </div>
                        <h3>System Health</h3>
                        <p>Check system status and performance</p>
                    </div>
                    
                    <div class="tool-card" onclick="clearAllStudentData()">
                        <div class="tool-icon">
                            <i class="fas fa-user-times"></i>
                        </div>
                        <h3>Clear All Student Data</h3>
                        <p>Remove all student records and data</p>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAdminToolsModal() {
    const modal = document.getElementById('admin-tools-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Admin Tools Functions
function showSystemAnalytics() {
    showNotification('System Analytics feature coming soon!', 'info');
    closeAdminToolsModal();
}

function showDataBackup() {
    showNotification('Data Backup feature coming soon!', 'info');
    closeAdminToolsModal();
}

function showSystemLogs() {
    showNotification('System Logs feature coming soon!', 'info');
    closeAdminToolsModal();
}

function showSystemSettings() {
    showNotification('System Settings feature coming soon!', 'info');
    closeAdminToolsModal();
}

function showUserActivity() {
    showNotification('User Activity feature coming soon!', 'info');
    closeAdminToolsModal();
}

function showSystemHealth() {
    showNotification('System Health feature coming soon!', 'info');
    closeAdminToolsModal();
}

// Admin Tools Functions
function downloadWebsiteAsPDF() {
    try {
        // Create a new window with the current page content
        const newWindow = window.open('', '_blank');
        newWindow.document.write(`
            <html>
                <head>
                    <title>DSI Placement Portal - Export</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h1 { color: #333; text-align: center; }
                        .section { margin: 20px 0; }
                        .card { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; }
                        .stats { display: flex; gap: 20px; margin: 20px 0; }
                        .stat-item { background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center; }
                    </style>
                </head>
                <body>
                    <h1>DSI Placement Portal - System Report</h1>
                    <div class="section">
                        <h2>System Statistics</h2>
                        <div class="stats">
                            <div class="stat-item">
                                <h3>${AppState.jobs.length}</h3>
                                <p>Total Jobs</p>
                            </div>
                            <div class="stat-item">
                                <h3>${AppState.students.length}</h3>
                                <p>Total Students</p>
                            </div>
                            <div class="stat-item">
                                <h3>${AppState.notifications.length}</h3>
                                <p>Total Notifications</p>
                            </div>
                        </div>
                    </div>
                    <div class="section">
                        <h2>Export Information</h2>
                        <p><strong>Export Date:</strong> ${new Date().toLocaleString()}</p>
                        <p><strong>System Version:</strong> DSI Placement Portal v1.0</p>
                    </div>
                </body>
            </html>
        `);
        newWindow.document.close();
        
        setTimeout(() => {
            newWindow.print();
        }, 500);
        
        showNotification('PDF export opened in new window. Use browser print to save as PDF.', 'info');
    } catch (error) {
        console.error('Error creating PDF:', error);
        showNotification('Error creating PDF export', 'error');
    }
}

function refreshData() {
    showNotification('Refreshing data from Firebase...', 'info');
    loadDataFromFirebase().then(() => {
        showNotification('Data refreshed successfully!', 'success');
        // Update all relevant displays
        if (document.getElementById('admin-dashboard').classList.contains('active')) {
            loadAdminDashboard();
        }
    }).catch(error => {
        console.error('Error refreshing data:', error);
        showNotification('Error refreshing data: ' + error.message, 'error');
    });
}

function clearAllNotifications() {
    // Default admin password
    const defaultAdminPassword = 'admin123';
    
    // Prompt for admin password
    const enteredPassword = prompt('Enter admin password to clear all notifications:');
    
    if (enteredPassword === null) {
        // User cancelled
        return;
    }
    
    if (enteredPassword !== defaultAdminPassword) {
        showNotification('Invalid admin password! Access denied.', 'error');
        return;
    }
    
    if (!confirm('Are you sure you want to clear ALL notifications? This action cannot be undone.')) {
        return;
    }
    
    AppState.notifications = [];
    saveDataToStorage();
    showNotification('All notifications cleared successfully!', 'success');
    
    // Update displays
    if (document.getElementById('admin-dashboard').classList.contains('active')) {
        loadAdminNotifications();
    }
    if (document.getElementById('notifications-management-page').classList.contains('active')) {
        loadAdminNotifications();
    }
}

function clearAllJobs() {
    // Default admin password
    const defaultAdminPassword = 'admin123';
    
    // Prompt for admin password
    const enteredPassword = prompt('Enter admin password to clear all jobs:');
    
    if (enteredPassword === null) {
        // User cancelled
        return;
    }
    
    if (enteredPassword !== defaultAdminPassword) {
        showNotification('Invalid admin password! Access denied.', 'error');
        return;
    }
    
    if (!confirm('Are you sure you want to clear ALL jobs? This action cannot be undone.')) {
        return;
    }
    
    AppState.jobs = [];
    AppState.filteredJobs = [];
    saveDataToStorage();
    showNotification('All jobs cleared successfully!', 'success');
    
    // Update displays
    if (document.getElementById('admin-dashboard').classList.contains('active')) {
        loadAdminJobList();
    }
    if (document.getElementById('job-management-page').classList.contains('active')) {
        loadAdminJobList();
    }
}

function clearAllShortlistedData() {
    // Default admin password
    const defaultAdminPassword = 'admin123';
    
    // Prompt for admin password
    const enteredPassword = prompt('Enter admin password to clear all shortlisted data:');
    
    if (enteredPassword === null) {
        // User cancelled
        return;
    }
    
    if (enteredPassword !== defaultAdminPassword) {
        showNotification('Invalid admin password! Access denied.', 'error');
        return;
    }
    
    if (!confirm('Are you sure you want to clear ALL shortlisted data? This action cannot be undone.')) {
        return;
    }
    
    AppState.shortlistedData = [];
    AppState.filteredShortlistedData = [];
    AppState.jobShortlisted = {};
    saveDataToStorage();
    showNotification('All shortlisted data cleared successfully!', 'success');
    
    // Update displays
    if (document.getElementById('admin-dashboard').classList.contains('active')) {
        loadAdminDashboard();
    }
}

function clearAllStudentData() {
    // Default admin password
    const defaultAdminPassword = 'admin123';
    
    // Prompt for admin password
    const enteredPassword = prompt('Enter admin password to clear all student data:');
    
    if (enteredPassword === null) {
        // User cancelled
        return;
    }
    
    if (enteredPassword !== defaultAdminPassword) {
        showNotification('Invalid admin password! Access denied.', 'error');
        return;
    }
    
    if (!confirm('Are you sure you want to clear ALL student data? This action cannot be undone.')) {
        return;
    }
    
    AppState.students = [];
    AppState.currentStudent = null;
    saveDataToStorage();
    showNotification('All student data cleared successfully!', 'success');
    
    // Update displays
    if (document.getElementById('admin-dashboard').classList.contains('active')) {
        loadStudentList();
    }
    if (document.getElementById('student-management-page').classList.contains('active')) {
        loadStudentList();
    }
    if (document.getElementById('admin-student-list').classList.contains('active')) {
        loadStudentList();
    }
}

function testConnection() {
    showNotification('Testing Firebase connection...', 'info');
    
    if (isFirebaseReady) {
        // Test Firebase connection
        const testRef = window.firebaseRef(window.firebaseDatabase, 'test');
        window.firebaseSet(testRef, { timestamp: Date.now() }).then(() => {
            showNotification('Firebase connection test successful!', 'success');
        }).catch(error => {
            console.error('Firebase connection test failed:', error);
            showNotification('Firebase connection test failed: ' + error.message, 'error');
        });
    } else {
        showNotification('Firebase is not ready. Please wait and try again.', 'warning');
    }
}

function retryConnection() {
    showNotification('Retrying Firebase connection...', 'info');
    
    // Reset Firebase state
    isFirebaseReady = false;
    
    // Reinitialize Firebase
    initializeFirebase().then(() => {
        showNotification('Firebase connection retry successful!', 'success');
    }).catch(error => {
        console.error('Firebase connection retry failed:', error);
        showNotification('Firebase connection retry failed: ' + error.message, 'error');
    });
}

// Additional modal functions for new pages
function showAddNotificationModal() {
    // Check if the add notification modal exists in the original admin dashboard
    const existingModal = document.getElementById('add-notification-modal');
    if (existingModal) {
        existingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        showNotification('Add notification modal not found. Please use the original admin dashboard.', 'warning');
    }
}

function showAddAdminModal() {
    showNotification('Add Admin modal coming soon!', 'info');
}

// Student Management Modal Functions
function showStudentUploadModal() {
    // Check if the student upload modal exists in the original admin dashboard
    const existingModal = document.getElementById('student-upload-modal');
    if (existingModal) {
        existingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        showNotification('Student upload modal not found. Please use the original admin dashboard.', 'warning');
    }
}

function showAddStudentModal() {
    // Check if the add student modal exists in the original admin dashboard
    const existingModal = document.getElementById('add-student-modal');
    if (existingModal) {
        existingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        showNotification('Add student modal not found. Please use the original admin dashboard.', 'warning');
    }
}

function showEligibilityCriteriaModal() {
    // Check if the eligibility criteria modal exists in the original admin dashboard
    const existingModal = document.getElementById('eligibility-criteria-modal');
    if (existingModal) {
        existingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        showNotification('Eligibility criteria modal not found. Please use the original admin dashboard.', 'warning');
    }
}

// Copy to clipboard function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Password copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showNotification('Password copied to clipboard!', 'success');
        } catch (err) {
            showNotification('Failed to copy password', 'error');
        }
        document.body.removeChild(textArea);
    });
}

// Add sample student data for testing
function addSampleStudentData() {
    if (AppState.students.length > 0) {
        showNotification('Sample data already exists. Clear existing data first.', 'warning');
        return;
    }
    
    const sampleStudents = [
        {
            id: 'student_sample_1',
            usn: '1DS20CS001',
            email: 'john.doe@dsi.com',
            cgpa: 8.5,
            marks10th: 85,
            marks12th: 78,
            name: 'John Doe',
            password: 'Stu@123',
            isEligible: true,
            isPlaced: true,
            offerLetter: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
            placedSalary: 8,
            salaryRange: 'below10',
            placedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
            canApplyToJobs: '10+',
            createdAt: new Date().toISOString()
        },
        {
            id: 'student_sample_2',
            usn: '1DS20CS002',
            email: 'jane.smith@dsi.com',
            cgpa: 7.8,
            marks10th: 92,
            marks12th: 88,
            name: 'Jane Smith',
            password: 'Stu@456',
            isEligible: true,
            isPlaced: false,
            offerLetter: null,
            placedSalary: null,
            salaryRange: null,
            createdAt: new Date().toISOString()
        },
        {
            id: 'student_sample_3',
            usn: '1DS20CS003',
            email: 'mike.johnson@dsi.com',
            cgpa: 6.2,
            marks10th: 65,
            marks12th: 70,
            name: 'Mike Johnson',
            password: 'Stu@789',
            isEligible: false,
            isPlaced: false,
            offerLetter: null,
            placedSalary: null,
            salaryRange: null,
            createdAt: new Date().toISOString()
        },
        {
            id: 'student_sample_4',
            usn: '1DS20CS004',
            email: 'sarah.wilson@dsi.com',
            cgpa: 9.1,
            marks10th: 95,
            marks12th: 92,
            name: 'Sarah Wilson',
            password: 'Stu@101',
            isEligible: true,
            isPlaced: false,
            offerLetter: null,
            placedSalary: null,
            salaryRange: null,
            createdAt: new Date().toISOString()
        },
        {
            id: 'student_sample_5',
            usn: '1DS20CS005',
            email: 'alex.brown@dsi.com',
            cgpa: 5.8,
            marks10th: 58,
            marks12th: 62,
            name: 'Alex Brown',
            password: 'Stu@202',
            isEligible: false,
            isPlaced: false,
            offerLetter: null,
            placedSalary: null,
            salaryRange: null,
            createdAt: new Date().toISOString()
        }
    ];
    
    AppState.students = sampleStudents;
    saveDataToStorage();
    loadStudentList();
    updateManagementStats();
    showNotification('Sample student data added successfully!', 'success');
}

// Add sample job data for testing
function addSampleJobData(showNotification = true) {
    if (AppState.jobs.length > 0) {
        if (showNotification) {
            showNotification('Sample jobs already exist. Clear existing data first.', 'warning');
        }
        return;
    }
    
    const sampleJobs = [
        {
            id: 1,
            company: 'TechCorp',
            title: 'Software Engineer',
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            status: 'Open',
            description: 'Full-stack development role with modern technologies.',
            salary: '8-12 LPA',
            location: 'Bangalore',
            eligibility: 'Computer Science, Information Technology',
            batches: '2024, 2023',
            branches: 'CSE, IT',
            selectionProcess: 'Online Test, Technical Interview, HR Interview',
            formLink: 'https://forms.google.com/techcorp',
            academicRequirements: {
                min10thMarks: 60,
                min12thMarks: 60,
                minCGPAMarks: 6.0
            },
            eligibleSalaryRanges: ['below10', 'not-placed'], // Only allows below 10 LPA and not placed students
            applicants: []
        },
        {
            id: 2,
            company: 'DataSoft',
            title: 'Data Scientist',
            deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
            status: 'Open',
            description: 'Machine learning and data analysis role.',
            salary: '15-20 LPA',
            location: 'Mumbai',
            eligibility: 'Computer Science, Mathematics, Statistics',
            batches: '2024, 2023',
            branches: 'CSE, IT, Mathematics',
            selectionProcess: 'Online Test, Technical Interview, Case Study, HR Interview',
            formLink: 'https://forms.google.com/datasoft',
            academicRequirements: {
                min10thMarks: 70,
                min12thMarks: 70,
                minCGPAMarks: 7.0
            },
            eligibleSalaryRanges: ['below20', 'not-placed'], // Only allows below 20 LPA and not placed students
            applicants: []
        },
        {
            id: 3,
            company: 'CloudTech',
            title: 'Senior Developer',
            deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days from now
            status: 'Open',
            description: 'Senior full-stack developer with cloud experience.',
            salary: '25-30 LPA',
            location: 'Hyderabad',
            eligibility: 'Computer Science, Information Technology',
            batches: '2024, 2023, 2022',
            branches: 'CSE, IT',
            selectionProcess: 'Online Test, Technical Interview, System Design, HR Interview',
            formLink: 'https://forms.google.com/cloudtech',
            academicRequirements: {
                min10thMarks: 75,
                min12thMarks: 75,
                minCGPAMarks: 7.5
            },
            eligibleSalaryRanges: ['above20', 'not-placed'], // Only allows 20+ LPA and not placed students
            applicants: []
        },
        {
            id: 4,
            company: 'StartupXYZ',
            title: 'Full Stack Developer',
            deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
            status: 'Open',
            description: 'Full-stack development in a fast-paced startup environment.',
            salary: '6-8 LPA',
            location: 'Pune',
            eligibility: 'Computer Science, Information Technology',
            batches: '2024, 2023',
            branches: 'CSE, IT',
            selectionProcess: 'Online Test, Technical Interview, HR Interview',
            formLink: 'https://forms.google.com/startupxyz',
            academicRequirements: {
                min10thMarks: 60,
                min12thMarks: 60,
                minCGPAMarks: 6.0
            },
            eligibleSalaryRanges: ['not-placed'], // Only allows not placed students
            applicants: []
        }
    ];
    
    AppState.jobs = sampleJobs;
    saveDataToStorage();
    
    if (showNotification) {
        showNotification('Sample job data added successfully!', 'success');
    }
}

// Add sample admin data for testing
function addSampleAdminData() {
    if (AppState.admins.length > 0) {
        showNotification('Admin data already exists. Clear existing data first.', 'warning');
        return;
    }
    
    const sampleAdmins = [
        {
            id: '1',
            username: 'himu',
            email: 'admin@dsi.com',
            name: 'Himu Admin',
            role: 'Default Admin',
            status: 'Active',
            createdAt: new Date().toISOString()
        },
        {
            id: '2',
            username: 'admin2',
            email: 'admin2@dsi.com',
            name: 'Secondary Admin',
            role: 'Admin',
            status: 'Active',
            createdAt: new Date().toISOString()
        }
    ];
    
    AppState.admins = sampleAdmins;
    saveDataToStorage();
    loadAdminManagementList();
    updateManagementStats();
    showNotification('Sample admin data added successfully!', 'success');
}

// Update management card statistics
function updateManagementStats() {
    console.log('Updating management stats:', {
        jobs: AppState.jobs?.length || 0,
        notifications: AppState.notifications?.length || 0,
        students: AppState.students?.length || 0,
        admins: AppState.admins?.length || 0
    });
    
    // Update job count
    const jobCount = document.getElementById('total-jobs-count');
    if (jobCount) {
        jobCount.textContent = AppState.jobs ? AppState.jobs.length : 0;
    }
    
    // Update notification count
    const notificationCount = document.getElementById('total-notifications-count');
    if (notificationCount) {
        notificationCount.textContent = AppState.notifications ? AppState.notifications.length : 0;
    }
    
    // Update student count (both in management cards and student stats)
    const studentCount = document.getElementById('total-students-count');
    if (studentCount) {
        studentCount.textContent = `(${AppState.students ? AppState.students.length : 0})`;
    }
    
    // Update student count in management card stats
    const studentCountCard = document.getElementById('total-students-count-card');
    if (studentCountCard) {
        studentCountCard.textContent = AppState.students ? AppState.students.length : 0;
    }
    
    // Update student statistics in student management page
    updateStudentStatistics();
    
    // Update admin count
    const adminCount = document.getElementById('total-admins-count');
    if (adminCount) {
        adminCount.textContent = AppState.admins ? AppState.admins.length : 0;
    }
}

// Export Functions
function toggleExportDropdown() {
    const dropdown = document.querySelector('.export-dropdown');
    dropdown.classList.toggle('active');
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function closeDropdown(e) {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
            document.removeEventListener('click', closeDropdown);
        }
    });
}

function exportStudentData(format) {
    console.log(`Exporting student data as ${format}`);
    
    if (AppState.students.length === 0) {
        showNotification('No student data to export', 'warning');
        return;
    }
    
    // Close dropdown
    document.querySelector('.export-dropdown').classList.remove('active');
    
    switch (format) {
        case 'csv':
            exportToCSV();
            break;
        case 'excel':
            exportToExcel();
            break;
        case 'pdf':
            exportToPDF();
            break;
        default:
            showNotification('Invalid export format', 'error');
    }
}

function exportToCSV() {
    try {
        const headers = ['USN', 'Name', 'Email', 'CGPA', '10th Marks (%)', '12th Marks (%)', 'Password', 'Eligible', 'Created Date'];
        const csvContent = [
            headers.join(','),
            ...AppState.students.map(student => [
                student.usn,
                `"${student.name || 'N/A'}"`,
                student.email,
                student.cgpa,
                student.marks10th,
                student.marks12th,
                student.password,
                student.isEligible ? 'Yes' : 'No',
                new Date(student.createdAt).toLocaleDateString()
            ].map(field => `"${field}"`).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `student_data_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Student data exported as CSV successfully!', 'success');
    } catch (error) {
        console.error('Error exporting CSV:', error);
        showNotification('Error exporting CSV file', 'error');
    }
}

function exportToExcel() {
    try {
        // Check if XLSX library is available
        if (typeof XLSX === 'undefined') {
            showNotification('Excel export requires XLSX library. Please use CSV export instead.', 'warning');
            return;
        }
        
        const worksheetData = [
            ['USN', 'Name', 'Email', 'CGPA', '10th Marks (%)', '12th Marks (%)', 'Password', 'Eligible', 'Created Date'],
            ...AppState.students.map(student => [
                student.usn,
                student.name || 'N/A',
                student.email,
                student.cgpa,
                student.marks10th,
                student.marks12th,
                student.password,
                student.isEligible ? 'Yes' : 'No',
                new Date(student.createdAt).toLocaleDateString()
            ])
        ];
        
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Data');
        
        XLSX.writeFile(workbook, `student_data_${new Date().toISOString().split('T')[0]}.xlsx`);
        
        showNotification('Student data exported as Excel successfully!', 'success');
    } catch (error) {
        console.error('Error exporting Excel:', error);
        showNotification('Error exporting Excel file', 'error');
    }
}

function exportToPDF() {
    try {
        // Create a simple HTML table for PDF generation
        const tableHTML = `
            <html>
                <head>
                    <title>Student Data Export</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h1 { color: #333; text-align: center; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; font-weight: bold; }
                        tr:nth-child(even) { background-color: #f9f9f9; }
                        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <h1>Student Data Export</h1>
                    <p><strong>Export Date:</strong> ${new Date().toLocaleDateString()}</p>
                    <p><strong>Total Students:</strong> ${AppState.students.length}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>USN</th>
                                <th>Email</th>
                                <th>CGPA</th>
                                <th>10th Marks (%)</th>
                                <th>12th Marks (%)</th>
                                <th>Password</th>
                                <th>Eligible</th>
                                <th>Created Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${AppState.students.map(student => `
                                <tr>
                                    <td>${student.usn}</td>
                                    <td>${student.email}</td>
                                    <td>${student.cgpa}</td>
                                    <td>${student.marks10th}</td>
                                    <td>${student.marks12th}</td>
                                    <td>${student.password}</td>
                                    <td>${student.isEligible ? 'Yes' : 'No'}</td>
                                    <td>${new Date(student.createdAt).toLocaleDateString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="footer">
                        Generated by DSI Placement Portal on ${new Date().toLocaleString()}
                    </div>
                </body>
            </html>
        `;
        
        // Open in new window for printing/saving as PDF
        const newWindow = window.open('', '_blank');
        newWindow.document.write(tableHTML);
        newWindow.document.close();
        
        // Trigger print dialog
        setTimeout(() => {
            newWindow.print();
        }, 500);
        
        showNotification('PDF export opened in new window. Use browser print to save as PDF.', 'info');
    } catch (error) {
        console.error('Error exporting PDF:', error);
        showNotification('Error exporting PDF file', 'error');
    }
}

// Student Authentication Functions
function handleStudentLogin(event) {
    event.preventDefault();
    
    const usn = document.getElementById('student-usn').value;
    const password = document.getElementById('student-password').value;
    
    console.log('🔐 Attempting student login:', { usn, passwordLength: password.length });
    console.log('📊 Available students:', AppState.students.length);
    
    const student = AppState.students.find(s => s.usn === usn && s.password === password);
    
    if (student) {
        console.log('✅ Student found:', student.usn);
        AppState.currentStudent = student;
        
        // Save login state to localStorage
        localStorage.setItem('currentStudent', JSON.stringify(student));
        localStorage.setItem('loginType', 'student');
        
        // Ensure notifications exist before showing portal
        ensureNotificationsExist();
        
        updateNavigationForStudent();
        showNotification('Login successful!', 'success');
        
        console.log('🚀 Navigating to student portal...');
        showStudentPortal();
    } else {
        console.log('❌ Student not found or invalid credentials');
        showNotification('Invalid USN or password', 'error');
    }
}

function showStudentPortal() {
    console.log('🎓 showStudentPortal called');
    hideAllPages();
    const studentPortal = document.getElementById('student-portal');
    console.log('📄 Student portal element:', studentPortal);
    
    if (studentPortal) {
        studentPortal.classList.add('active');
        console.log('✅ Student portal activated');
    } else {
        console.error('❌ Student portal element not found!');
    }
    
    setActiveNav('student-nav');
    console.log('🧭 Navigation updated');
    
    // Wait for DOM to be fully ready before loading dashboard
    setTimeout(() => {
        console.log('⏰ Loading student dashboard...');
        loadStudentDashboard();
    }, 200);
    
    closeMobileMenu();
}

function loadStudentDashboard() {
    console.log('🎓 Loading student dashboard...');
    
    if (!AppState.currentStudent) {
        showNotification('Please login first', 'error');
        showStudentLogin();
        return;
    }
    
    const student = AppState.currentStudent;
    console.log('Student logged in:', student.usn);
    
    // Update student info display immediately
    loadStudentInfo();
    
    // Ensure notifications section is active by default and load its content
    const notificationsSection = document.getElementById('student-notifications-section');
    const availableJobsSection = document.getElementById('student-available-jobs-section');
    const myPortalSection = document.getElementById('student-my-portal-section');
    
    console.log('Sections found:', {
        notifications: !!notificationsSection,
        availableJobs: !!availableJobsSection,
        myPortal: !!myPortalSection
    });
    
    // Hide all sections first
    [notificationsSection, availableJobsSection, myPortalSection].forEach(section => {
        if (section) section.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.portal-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show notifications section as default
    if (notificationsSection) {
        notificationsSection.classList.add('active');
        const navBtn = document.getElementById('nav-notifications');
        if (navBtn) navBtn.classList.add('active');
        console.log('✅ Notifications section activated');
    }
    
    // SIMPLE APPROACH - Just use the working method directly
    console.log('🔄 Using the working section switch method...');
    showStudentSection('notifications');
}

function loadStudentInfo() {
    if (!AppState.currentStudent) {
        return;
    }
    
    const student = AppState.currentStudent;
    
    // Update student info display immediately
    document.getElementById('student-info-usn').textContent = student.usn || '-';
    document.getElementById('student-info-email').textContent = student.email || '-';
    document.getElementById('student-info-cgpa').textContent = student.cgpa || '-';
    document.getElementById('student-info-10th').textContent = student.marks10th ? student.marks10th + '%' : '-';
    document.getElementById('student-info-12th').textContent = student.marks12th ? student.marks12th + '%' : '-';
    document.getElementById('student-info-eligible').textContent = student.isEligible ? 'Yes' : 'No';
    document.getElementById('student-info-eligible').className = student.isEligible ? 'eligible-yes' : 'eligible-no';
}

function handleStudentLogout() {
    AppState.currentStudent = null;
    updateNavigationForStudent();
    showNotification('Logged out successfully', 'success');
    showStudentLogin();
}

function loadEligibleJobs() {
    if (!AppState.currentStudent) {
        document.getElementById('eligible-jobs-list').innerHTML = 
            '<div class="no-eligible-jobs"><p>Please login to view available jobs.</p></div>';
        return;
    }
    
    // Only load jobs if the available jobs section is currently active
    const jobsSection = document.getElementById('student-available-jobs-section');
    if (!jobsSection || !jobsSection.classList.contains('active')) {
        return;
    }
    
    const jobsList = document.getElementById('eligible-jobs-list');
    
    // Load all open jobs (not filtering by eligibility)
    const openJobs = AppState.jobs.filter(job => {
        // Check if job is still open
        const now = new Date();
        const deadline = new Date(job.deadline);
        return deadline > now && job.status === 'Open';
    });
    
    jobsList.innerHTML = '';
    
    if (openJobs.length === 0) {
        jobsList.innerHTML = '<div class="no-eligible-jobs"><p>No jobs available at the moment.</p></div>';
        return;
    }
    
    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    openJobs.forEach(job => {
        const jobCard = createEligibleJobCard(job);
        fragment.appendChild(jobCard);
    });
    
    jobsList.appendChild(fragment);
}

function loadStudentNotifications() {
    console.log('🔔 Loading student notifications...');
    console.log('Current student:', AppState.currentStudent ? 'Logged in' : 'Not logged in');
    console.log('Notifications count:', AppState.notifications.length);
    
    if (!AppState.currentStudent) {
        const notificationsList = document.getElementById('student-notifications-list');
        if (notificationsList) {
            notificationsList.innerHTML = 
                '<div class="no-notifications"><p>Please login to view notifications.</p></div>';
        }
        return;
    }
    
    const notificationsList = document.getElementById('student-notifications-list');
    
    // Check if the notifications list element exists and is visible
    if (!notificationsList) {
        console.error('❌ Notifications list element not found!');
        return;
    }
    
    // Check if the notifications section is active
    const notificationsSection = document.getElementById('student-notifications-section');
    if (!notificationsSection || !notificationsSection.classList.contains('active')) {
        console.log('⚠️ Notifications section not active, skipping load');
        return;
    }
    
    console.log('✅ Notifications list element found and section is active');
    
    // Load notifications immediately without any delays
    notificationsList.innerHTML = '';
    
    if (AppState.notifications.length === 0) {
        console.log('⚠️ No notifications available, creating default ones...');
        
        // Create default notifications immediately
        const defaultNotifications = [
            {
                id: Date.now() + 1,
                title: 'Welcome to DSI Placement Portal',
                message: 'Check this section regularly for important updates about placements and shortlisted candidates.',
                type: 'info',
                timestamp: new Date().toISOString(),
                read: false
            },
            {
                id: Date.now() + 2,
                title: 'Test Notification - Firebase Working!',
                message: `This test notification was created at ${new Date().toLocaleTimeString()}. If you can see this, Firebase is working correctly!`,
                type: 'success',
                timestamp: new Date().toISOString(),
                read: false
            }
        ];
        
        AppState.notifications = defaultNotifications;
        
        // Save to Firebase
        saveDataToStorage().then(() => {
            console.log('✅ Default notifications created and saved');
        }).catch(error => {
            console.error('❌ Error saving default notifications:', error);
        });
    }
    
    console.log('✅ Found notifications:', AppState.notifications.length);
    
    // Show recent notifications (first 10 - newest first due to unshift)
    const recentNotifications = AppState.notifications.slice(0, 10);
    
    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    recentNotifications.forEach(notification => {
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification-item ${notification.read ? 'read' : 'unread'}`;
        
        const timeAgo = getTimeAgo(new Date(notification.timestamp));
        
        notificationElement.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${getNotificationIcon(notification.type)}"></i>
            </div>
            <div class="notification-content">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
                <span class="notification-time">${timeAgo}</span>
            </div>
        `;
        
        fragment.appendChild(notificationElement);
    });
    
    notificationsList.appendChild(fragment);
    console.log('✅ Notifications loaded successfully');
}

function createEligibleJobCard(job) {
    const card = document.createElement('div');
    card.className = 'eligible-job-card';
    
    const formattedDeadline = new Date(job.deadline).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    
    // Check if student is eligible for this job
    const isEligible = AppState.currentStudent ? checkStudentEligibilityForJob(AppState.currentStudent, job) : false;
    const eligibilityReasons = AppState.currentStudent ? getEligibilityFailureReasons(AppState.currentStudent, job) : [];
    
    card.innerHTML = `
        <div class="job-header">
            <div>
                <div class="company-name">${job.company}</div>
                <div class="job-title">${job.title}</div>
            </div>
            <div class="status-badge open">Open</div>
        </div>
        <div class="job-details">
            <div class="job-detail-item">
                <i class="fas fa-calendar"></i>
                <span>Deadline: ${formattedDeadline}</span>
            </div>
            <div class="job-detail-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>${job.location}</span>
            </div>
            <div class="job-detail-item">
                <i class="fas fa-rupee-sign"></i>
                <span>${job.salary || 'Not specified'}</span>
            </div>
        </div>
        <div class="job-actions">
            <button class="view-details-btn" data-job-id="${job.id}">
                <i class="fas fa-eye"></i>
                View Details
            </button>
        </div>
    `;
    
    // Add click event listener to the view details button
    const viewDetailsBtn = card.querySelector('.view-details-btn');
    viewDetailsBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card click event
        console.log('View Details button clicked for job:', job);
        showJobDetail(job.id);
    });
    
    
    return card;
}

function studentLogout() {
    AppState.currentStudent = null;
    
    // Clear login state from localStorage
    localStorage.removeItem('currentStudent');
    localStorage.removeItem('loginType');
    
    showNotification('Logged out successfully', 'info');
    showStudentLogin();
}


// Admin Student Management Functions
function showStudentUploadModal() {
    document.getElementById('student-upload-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeStudentUploadModal() {
    document.getElementById('student-upload-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Reset form
    document.getElementById('student-file-input').value = '';
    document.getElementById('student-data-viewer').style.display = 'none';
    document.getElementById('student-upload-progress').style.display = 'none';
    document.getElementById('upload-errors').style.display = 'none';
}

// Eligibility Criteria Functions
function showEligibilityCriteriaModal() {
    document.getElementById('eligibility-criteria-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Populate current criteria
    document.getElementById('min-10th-marks').value = AppState.eligibilityCriteria.min10thMarks;
    document.getElementById('min-12th-marks').value = AppState.eligibilityCriteria.min12thMarks;
    document.getElementById('min-cgpa-marks').value = AppState.eligibilityCriteria.minCGPAMarks;
}

function closeEligibilityCriteriaModal() {
    document.getElementById('eligibility-criteria-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showOfferLetterUploadModal() {
    console.log('Showing offer letter upload modal');
    const modal = document.getElementById('offer-letter-upload-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Populate student dropdown
        const studentSelect = document.getElementById('student-select');
        studentSelect.innerHTML = '<option value="">Choose a student...</option>';
        
        console.log('Populating student dropdown with students:', AppState.students.length);
        AppState.students.forEach(student => {
            console.log('Adding student to dropdown:', { id: student.id, usn: student.usn, name: student.name });
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = `${student.usn} - ${student.name || student.email}`;
            studentSelect.appendChild(option);
        });
        
        showNotification('Offer letter upload modal opened', 'info');
    } else {
        showNotification('Offer letter upload modal not found', 'error');
    }
}

function closeOfferLetterUploadModal() {
    const modal = document.getElementById('offer-letter-upload-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        document.getElementById('offer-letter-form').reset();
    }
}

function updateEligibilityCriteria(event) {
    event.preventDefault();
    
    const min10th = parseFloat(document.getElementById('min-10th-marks').value);
    const min12th = parseFloat(document.getElementById('min-12th-marks').value);
    const minCgpa = parseFloat(document.getElementById('min-cgpa-marks').value);
    
    if (isNaN(min10th) || isNaN(min12th) || isNaN(minCgpa)) {
        showNotification('Please enter valid numbers for all criteria', 'error');
        return;
    }
    
    if (min10th < 0 || min10th > 100 || min12th < 0 || min12th > 100 || minCgpa < 0 || minCgpa > 10) {
        showNotification('Please enter valid ranges: 10th/12th (0-100%), CGPA (0-10)', 'error');
        return;
    }
    
    AppState.eligibilityCriteria = {
        min10thMarks: min10th,
        min12thMarks: min12th,
        minCGPAMarks: minCgpa
    };
    
    // Update eligibility for all students
    AppState.students.forEach(student => {
        student.isEligible = checkStudentEligibility(student);
    });
    
    saveDataToStorage();
    closeEligibilityCriteriaModal();
    loadStudentList();
    
    // Update eligibility criteria inputs in Add Job modal if it's open
    if (document.getElementById('job-form-modal').classList.contains('active')) {
        document.getElementById('job-10th-marks').value = AppState.eligibilityCriteria.min10thMarks;
        document.getElementById('job-12th-marks').value = AppState.eligibilityCriteria.min12thMarks;
        document.getElementById('job-cgpa-marks').value = AppState.eligibilityCriteria.minCGPAMarks;
        
        // Reset salary range checkboxes to default if it's a new job
        if (!AppState.editingJobId) {
            populateSalaryRangeCheckboxes(['not-placed']);
        }
    }
    
    showNotification('Eligibility criteria updated successfully', 'success');
}

function uploadOfferLetter(event) {
    event.preventDefault();
    
    const studentId = document.getElementById('student-select').value;
    const fileInput = document.getElementById('offer-letter-file');
    const companyName = document.getElementById('company-name').value.trim();
    const offerType = document.getElementById('offer-type').value;
    const salary = parseFloat(document.getElementById('placed-salary').value);
    const salaryRange = document.getElementById('salary-range').value;
    
    console.log('Upload offer letter - studentId:', studentId);
    console.log('Available students:', AppState.students.map(s => ({ id: s.id, usn: s.usn })));
    
    if (!studentId || !fileInput.files[0] || !companyName || !offerType || !salary || !salaryRange) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    const student = AppState.students.find(s => s.id === studentId);
    if (!student) {
        console.error('Student not found with ID:', studentId);
        console.error('Available student IDs:', AppState.students.map(s => s.id));
        showNotification('Student not found', 'error');
        return;
    }
    
    // Convert file to base64 for storage
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        // Update student with offer letter information
        student.isPlaced = true;
        student.placedSalary = salary;
        student.salaryRange = salaryRange;
        student.companyName = companyName;
        student.offerType = offerType;
        student.offerLetter = e.target.result; // Base64 encoded file
        student.placedDate = new Date().toISOString();
        
        // Update eligibility based on salary
        updateStudentJobEligibility(student);
        
        // Save to storage
        saveDataToStorage();
        
        // Update UI
        loadStudentList();
        updateStudentStatistics();
        closeOfferLetterUploadModal();
        
        showNotification(`Offer letter uploaded for ${student.usn} at ${companyName} (${offerType}, ${salary} LPA)`, 'success');
    };
    
    reader.onerror = function() {
        showNotification('Error reading file', 'error');
    };
    
    reader.readAsDataURL(file);
}

function updateStudentJobEligibility(student) {
    console.log('🔄 Updating student job eligibility:', {
        id: student.id,
        usn: student.usn,
        isPlaced: student.isPlaced,
        salaryRange: student.salaryRange,
        placedSalary: student.placedSalary
    });
    
    // Update job eligibility based on placement status and salary
    if (student.isPlaced) {
        switch (student.salaryRange) {
            case 'below10':
                // Can only apply to jobs with 10+ LPA
                student.canApplyToJobs = '10+';
                console.log('✅ Set canApplyToJobs to 10+ (below 10 LPA)');
                break;
            case 'below20':
                // Can only apply to jobs with 20+ LPA
                student.canApplyToJobs = '20+';
                console.log('✅ Set canApplyToJobs to 20+ (below 20 LPA)');
                break;
            case 'above20':
                // Cannot apply to any jobs (already placed at highest level)
                student.canApplyToJobs = 'none';
                console.log('✅ Set canApplyToJobs to none (20+ LPA)');
                break;
            default:
                console.log('⚠️ Unknown salary range:', student.salaryRange);
                student.canApplyToJobs = 'all';
        }
    } else {
        // Not placed, can apply to all jobs
        student.canApplyToJobs = 'all';
        console.log('✅ Set canApplyToJobs to all (not placed)');
    }
    
    console.log('🎯 Final canApplyToJobs:', student.canApplyToJobs);
}

// Debug function to test eligibility manually
function debugEligibility() {
    console.log('🔧 DEBUGGING ELIGIBILITY:');
    console.log('Current Student:', AppState.currentStudent);
    console.log('All Jobs:', AppState.jobs);
    
    if (AppState.currentStudent && AppState.jobs.length > 0) {
        AppState.jobs.forEach((job, index) => {
            console.log(`\n--- Job ${index + 1}: ${job.company} - ${job.title} ---`);
            console.log('Job eligibleSalaryRanges:', job.eligibleSalaryRanges);
            console.log('Student salaryRange:', AppState.currentStudent.salaryRange);
            console.log('Student isPlaced:', AppState.currentStudent.isPlaced);
            
            const canApply = canStudentApplyToJobSilent(AppState.currentStudent, job);
            console.log('Can Apply:', canApply);
        });
    }
}

// Function to add name field to existing students without names
function migrateStudentNames() {
    let updatedCount = 0;
    
    AppState.students.forEach(student => {
        if (!student.name || student.name === 'N/A') {
            // Prompt for name or set a default
            const newName = prompt(`Enter name for student ${student.usn} (${student.email}):`);
            if (newName && newName.trim() !== '') {
                student.name = newName.trim();
                updatedCount++;
            }
        }
    });
    
    if (updatedCount > 0) {
        saveDataToStorage();
        loadStudentList();
        showNotification(`Updated names for ${updatedCount} students`, 'success');
    } else {
        showNotification('No students needed name updates', 'info');
    }
}

// Debug function to check specific job eligibility
function debugJobEligibility(jobTitle) {
    if (!AppState.currentStudent) {
        console.log('❌ No student logged in');
        return;
    }
    
    const job = AppState.jobs.find(j => j.title.toLowerCase().includes(jobTitle.toLowerCase()) || 
                                      j.company.toLowerCase().includes(jobTitle.toLowerCase()));
    
    if (!job) {
        console.log(`❌ Job not found: ${jobTitle}`);
        console.log('Available jobs:', AppState.jobs.map(j => `${j.company} - ${j.title}`));
        return;
    }
    
    console.log(`🔍 Debugging eligibility for: ${job.company} - ${job.title}`);
    console.log('Job data:', job);
    console.log('Student data:', AppState.currentStudent);
    
    // Check academic eligibility
    const cgpa = parseFloat(AppState.currentStudent.cgpa);
    const marks10th = parseFloat(AppState.currentStudent.marks10th);
    const marks12th = parseFloat(AppState.currentStudent.marks12th);
    
    const minCgpa = job.academicRequirements?.minCGPAMarks || AppState.eligibilityCriteria.minCGPAMarks;
    const min10th = job.academicRequirements?.min10thMarks || AppState.eligibilityCriteria.min10thMarks;
    const min12th = job.academicRequirements?.min12thMarks || AppState.eligibilityCriteria.min12thMarks;
    
    console.log('Academic check:', {
        cgpa: `${cgpa} >= ${minCgpa} = ${cgpa >= minCgpa}`,
        marks10th: `${marks10th} >= ${min10th} = ${marks10th >= min10th}`,
        marks12th: `${marks12th} >= ${min12th} = ${marks12th >= min12th}`
    });
    
    const academicEligible = cgpa >= minCgpa && marks10th >= min10th && marks12th >= min12th;
    console.log('Academic eligible:', academicEligible);
    
    // Check salary eligibility
    const salaryEligible = canStudentApplyToJobSilent(AppState.currentStudent, job);
    console.log('Salary eligible:', salaryEligible);
    
    // Final result
    const finalEligible = academicEligible && salaryEligible;
    console.log('Final eligible:', finalEligible);
    
    // Get failure reasons
    const reasons = getEligibilityFailureReasons(AppState.currentStudent, job);
    console.log('Failure reasons:', reasons);
}

// Student Offer Letter Upload Function
function uploadStudentOfferLetter(event) {
    event.preventDefault();
    
    if (!AppState.currentStudent) {
        showNotification('Please login as a student first', 'error');
        return;
    }
    
    const fileInput = document.getElementById('student-offer-file');
    const companyName = document.getElementById('student-company-name').value.trim();
    const offerType = document.getElementById('student-offer-type').value;
    const salary = parseFloat(document.getElementById('student-salary').value);
    const salaryRange = document.getElementById('student-salary-range').value;
    
    if (!fileInput.files[0] || !companyName || !offerType || !salary || !salaryRange) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Convert file to base64 for storage
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        // Update current student with offer letter information
        AppState.currentStudent.isPlaced = true;
        AppState.currentStudent.placedSalary = salary;
        AppState.currentStudent.salaryRange = salaryRange;
        AppState.currentStudent.companyName = companyName;
        AppState.currentStudent.offerType = offerType;
        AppState.currentStudent.offerLetter = e.target.result; // Base64 encoded file
        AppState.currentStudent.placedDate = new Date().toISOString();
        
        // Update the student in AppState.students array
        let studentIndex = AppState.students.findIndex(s => s.id === AppState.currentStudent.id);
        if (studentIndex !== -1) {
            AppState.students[studentIndex] = { ...AppState.currentStudent };
        }
        
        // Update eligibility based on salary
        updateStudentJobEligibility(AppState.currentStudent);
        
        // Update the student in AppState.students array again with updated eligibility
        studentIndex = AppState.students.findIndex(s => s.id === AppState.currentStudent.id);
        if (studentIndex !== -1) {
            AppState.students[studentIndex] = { ...AppState.currentStudent };
        }
        
        // Save to storage
        saveDataToStorage();
        
        console.log('💾 Student data after upload:', {
            id: AppState.currentStudent.id,
            usn: AppState.currentStudent.usn,
            isPlaced: AppState.currentStudent.isPlaced,
            placedSalary: AppState.currentStudent.placedSalary,
            salaryRange: AppState.currentStudent.salaryRange,
            canApplyToJobs: AppState.currentStudent.canApplyToJobs
        });
        
        // Update UI
        loadStudentInfo();
        loadStudentOfferLetterSection();
        
        // Reset form
        document.getElementById('student-offer-letter-form').reset();
        
        showNotification(`Offer letter uploaded successfully! ${companyName} (${offerType}, ${salary} LPA)`, 'success');
    };
    
    reader.onerror = function() {
        showNotification('Error reading file', 'error');
    };
    
    reader.readAsDataURL(file);
}

// Load student offer letter section
function loadStudentOfferLetterSection() {
    if (!AppState.currentStudent) return;
    
    const student = AppState.currentStudent;
    console.log('📊 Loading student offer letter section:', {
        id: student.id,
        usn: student.usn,
        isPlaced: student.isPlaced,
        placedSalary: student.placedSalary,
        salaryRange: student.salaryRange,
        canApplyToJobs: student.canApplyToJobs
    });
    
    // Ensure eligibility is up-to-date
    updateStudentJobEligibility(student);
    
    // Update current status
    const statusDiv = document.getElementById('student-current-status');
    if (statusDiv) {
        statusDiv.innerHTML = `
            <div class="status-info">
                <div class="status-item">
                    <strong>Placement Status:</strong>
                    <span class="status-badge ${student.isPlaced ? 'placed' : 'not-placed'}">
                        ${student.isPlaced ? 'Placed' : 'Not Placed'}
                    </span>
                </div>
                ${student.isPlaced ? `
                    <div class="status-item">
                        <strong>Company Name:</strong>
                        <span>${student.companyName || 'N/A'}</span>
                    </div>
                    <div class="status-item">
                        <strong>Type of Offer:</strong>
                        <span>${student.offerType || 'N/A'}</span>
                    </div>
                    <div class="status-item">
                        <strong>Salary:</strong>
                        <span>${student.placedSalary} LPA (${AppState.salaryRanges[student.salaryRange]})</span>
                    </div>
                    <div class="status-item">
                        <strong>Placed Date:</strong>
                        <span>${new Date(student.placedDate).toLocaleDateString()}</span>
                    </div>
                    <div class="status-item">
                        <strong>Can Apply To:</strong>
                        <span class="eligibility-info">${getEligibilityText(student.canApplyToJobs)}</span>
                    </div>
                ` : `
                    <div class="status-item">
                        <strong>Can Apply To:</strong>
                        <span class="eligibility-info">All jobs</span>
                    </div>
                `}
            </div>
        `;
    }
    
    // Show/hide download section based on placement status
    const downloadSection = document.getElementById('offer-letter-download-section');
    const downloadInfo = document.getElementById('offer-letter-download-info');
    
    if (student.isPlaced && student.offerLetter) {
        downloadSection.style.display = 'block';
        downloadInfo.innerHTML = `
            <div class="download-info">
                <p><strong>You have an offer letter available for download.</strong></p>
                <div class="offer-details">
                    <p><strong>Company Name:</strong> ${student.companyName || 'N/A'}</p>
                    <p><strong>Type of Offer:</strong> ${student.offerType || 'N/A'}</p>
                    <p><strong>Salary:</strong> ${student.placedSalary} LPA (${AppState.salaryRanges[student.salaryRange]})</p>
                    <p><strong>Placed Date:</strong> ${new Date(student.placedDate).toLocaleDateString()}</p>
                </div>
                <div class="download-actions">
                    <button onclick="viewStudentOfferLetter()" class="btn btn-secondary">
                        <i class="fas fa-eye"></i>
                        View Offer Letter
                    </button>
                    <button onclick="downloadStudentOfferLetter()" class="btn btn-outline">
                        <i class="fas fa-file-pdf"></i>
                        Download Letter Only
                    </button>
                </div>
            </div>
        `;
    } else {
        downloadSection.style.display = 'none';
    }
    
    // Load job applications
    loadStudentApplications();
}

// Get eligibility text for display
function getEligibilityText(canApplyTo) {
    console.log('📝 Getting eligibility text for:', canApplyTo);
    let text;
    switch (canApplyTo) {
        case 'all': 
            text = 'All jobs';
            break;
        case '10+': 
            text = 'Jobs with 10+ LPA only';
            break;
        case '20+': 
            text = 'Jobs with 20+ LPA only';
            break;
        case 'none': 
            text = 'Cannot apply to any jobs';
            break;
        default: 
            text = 'All jobs';
            console.log('⚠️ Unknown canApplyTo value:', canApplyTo);
    }
    console.log('📝 Returning eligibility text:', text);
    return text;
}

// Load student job applications
function loadStudentApplications() {
    // Job Applications section has been removed from UI
    return;
    
    const student = AppState.currentStudent;
    
    console.log('🎯 Loading student applications for:', {
        student: {
            id: student.id,
            usn: student.usn,
            isPlaced: student.isPlaced,
            placedSalary: student.placedSalary,
            salaryRange: student.salaryRange,
            canApplyToJobs: student.canApplyToJobs
        },
        totalJobs: AppState.jobs.length
    });
    
    // Get eligible jobs based on student's placement status and job's salary range eligibility
    const eligibleJobs = AppState.jobs.filter(job => {
        const canApply = canStudentApplyToJobSilent(student, job);
        console.log(`🔍 Job ${job.id} (${job.company} - ${job.title}): ${canApply ? 'ELIGIBLE' : 'NOT ELIGIBLE'}`);
        return canApply;
    });
    
    console.log(`📊 Filtered ${AppState.jobs.length} jobs down to ${eligibleJobs.length} eligible jobs`);
    
    // Debug: Run manual eligibility check
    debugEligibility();
    
    if (eligibleJobs.length === 0) {
        applicationsDiv.innerHTML = `
            <div class="no-applications">
                <p>${student.isPlaced ? 'You cannot apply to any jobs based on your current placement status.' : 'No jobs available for application.'}</p>
            </div>
        `;
        return;
    }
    
    applicationsDiv.innerHTML = eligibleJobs.map(job => `
        <div class="application-card">
            <div class="job-info">
                <h5>${job.title}</h5>
                <p><strong>Company:</strong> ${job.company}</p>
                <p><strong>Salary:</strong> ${job.salary} LPA</p>
                <p><strong>Location:</strong> ${job.location}</p>
                <p><strong>Deadline:</strong> ${new Date(job.deadline).toLocaleDateString()}</p>
            </div>
            <div class="application-actions">
                <button onclick="applyForJob('${job.id}')" class="btn btn-primary">
                    <i class="fas fa-paper-plane"></i>
                    Apply Now
                </button>
            </div>
        </div>
    `).join('');
}

// Helper function to extract numeric salary from salary string
function extractSalaryValue(salaryString) {
    if (!salaryString) return 0;
    
    // Use the same improved parsing logic as parseJobSalary
    return parseJobSalary(salaryString);
}

// Check if student can apply to a job based on salary range eligibility (silent check for filtering)
function canStudentApplyToJobSilent(student, job) {
    console.log('🔍 Checking eligibility:', {
        student: {
            id: student.id,
            usn: student.usn,
            isPlaced: student.isPlaced,
            salaryRange: student.salaryRange,
            canApplyToJobs: student.canApplyToJobs
        },
        job: {
            id: job.id,
            title: job.title,
            company: job.company,
            salary: job.salary,
            eligibleSalaryRanges: job.eligibleSalaryRanges
        }
    });
    
    // Debug: Check if job has eligibleSalaryRanges
    if (!job.eligibleSalaryRanges) {
        console.log('⚠️ Job has no eligibleSalaryRanges field:', job);
    }
    
    // If job doesn't have salary range eligibility defined, use old logic
    if (!job.eligibleSalaryRanges || job.eligibleSalaryRanges.length === 0) {
        console.log('📝 Job has no salary range eligibility, using old logic');
        if (student.isPlaced) {
            const jobSalary = extractSalaryValue(job.salary);
            console.log('💰 Job salary extracted:', jobSalary);
            switch (student.canApplyToJobs) {
                case '10+':
                    if (jobSalary < 10) {
                        console.log('❌ Student can only apply to 10+ LPA jobs, job salary is', jobSalary);
                        return false;
                    }
                    break;
                case '20+':
                    if (jobSalary < 20) {
                        console.log('❌ Student can only apply to 20+ LPA jobs, job salary is', jobSalary);
                        return false;
                    }
                    break;
                case 'none':
                    console.log('❌ Student cannot apply to any jobs');
                    return false;
            }
        }
        console.log('✅ Student can apply (old logic)');
        return true;
    }
    
    // Check based on job's salary range eligibility settings
    let studentRange = 'not-placed';
    if (student.isPlaced) {
        studentRange = student.salaryRange;
    }
    
    console.log('🎯 Student range:', studentRange, 'Job allows:', job.eligibleSalaryRanges);
    
    // Check if the job allows this student's salary range
    if (!job.eligibleSalaryRanges.includes(studentRange)) {
        console.log('❌ Student range not in job eligibility');
        return false;
    }
    
    // Additional check: If student is placed, also check if they can apply based on job salary
    if (student.isPlaced && student.canApplyToJobs !== 'all') {
        const jobSalary = extractSalaryValue(job.salary);
        console.log('💰 Job salary:', jobSalary, 'Student can apply to:', student.canApplyToJobs);
        
        switch (student.canApplyToJobs) {
            case '10+':
                if (jobSalary < 10) {
                    console.log('❌ Student can only apply to 10+ LPA jobs, job salary is', jobSalary);
                    return false;
                }
                break;
            case '20+':
                if (jobSalary < 20) {
                    console.log('❌ Student can only apply to 20+ LPA jobs, job salary is', jobSalary);
                    return false;
                }
                break;
            case 'none':
                console.log('❌ Student cannot apply to any jobs');
                return false;
        }
    }
    
    console.log('✅ Student can apply (new logic)');
    return true;
}

// Check if student can apply to a job based on salary range eligibility (with notifications)
function canStudentApplyToJob(student, job) {
    // If job doesn't have salary range eligibility defined, use old logic
    if (!job.eligibleSalaryRanges || job.eligibleSalaryRanges.length === 0) {
        if (student.isPlaced) {
            const jobSalary = extractSalaryValue(job.salary);
            switch (student.canApplyToJobs) {
                case '10+':
                    if (jobSalary < 10) {
                        showNotification('You can only apply to jobs with 10+ LPA', 'warning');
                        return false;
                    }
                    break;
                case '20+':
                    if (jobSalary < 20) {
                        showNotification('You can only apply to jobs with 20+ LPA', 'warning');
                        return false;
                    }
                    break;
                case 'none':
                    showNotification('You cannot apply to any jobs as you are already placed at the highest level', 'warning');
                    return false;
            }
        }
        return true;
    }
    
    // Check based on job's salary range eligibility settings
    let studentRange = 'not-placed';
    if (student.isPlaced) {
        studentRange = student.salaryRange;
    }
    
    if (!job.eligibleSalaryRanges.includes(studentRange)) {
        const rangeText = AppState.salaryRanges[studentRange] || 'not placed';
        showNotification(`This job is not available for students ${rangeText.toLowerCase()}`, 'warning');
        return false;
    }
    
    // Additional check: If student is placed, also check if they can apply based on job salary
    if (student.isPlaced && student.canApplyToJobs !== 'all') {
        const jobSalary = extractSalaryValue(job.salary);
        
        switch (student.canApplyToJobs) {
            case '10+':
                if (jobSalary < 10) {
                    showNotification('You can only apply to jobs with 10+ LPA', 'warning');
                    return false;
                }
                break;
            case '20+':
                if (jobSalary < 20) {
                    showNotification('You can only apply to jobs with 20+ LPA', 'warning');
                    return false;
                }
                break;
            case 'none':
                showNotification('You cannot apply to any jobs as you are already placed at the highest level', 'warning');
                return false;
        }
    }
    
    return true;
}

// Apply for a job
function applyForJob(jobId) {
    if (!AppState.currentStudent) {
        showNotification('Please login as a student first', 'error');
        return;
    }
    
    const job = AppState.jobs.find(j => j.id === jobId);
    if (!job) {
        showNotification('Job not found', 'error');
        return;
    }
    
    const student = AppState.currentStudent;
    
    // Check if student can apply to this job based on salary range eligibility
    if (!canStudentApplyToJob(student, job)) {
        return;
    }
    
    // Check if already applied
    if (!job.applications) job.applications = [];
    if (job.applications.some(app => app.studentId === student.id)) {
        showNotification('You have already applied for this job', 'warning');
        return;
    }
    
    // Add application
    job.applications.push({
        studentId: student.id,
        studentUSN: student.usn,
        studentEmail: student.email,
        appliedDate: new Date().toISOString(),
        status: 'pending'
    });
    
    // Save to storage
    saveDataToStorage();
    
    // Update UI
    loadStudentApplications();
    
    showNotification(`Successfully applied for ${job.title} at ${job.company}`, 'success');
}

// View offer letter with student details
function viewOfferLetter(studentId) {
    const student = AppState.students.find(s => s.id === studentId);
    if (!student || !student.offerLetter) {
        showNotification('Offer letter not found', 'error');
        return;
    }
    
    // Create modal to display offer letter
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
            <span class="close" onclick="closeOfferLetterModal(this)">&times;</span>
            <h2>Offer Letter - ${student.usn}</h2>
            
            <div class="student-details">
                <div class="detail-row">
                    <span class="detail-label">Student Name:</span>
                    <span class="detail-value">${student.name || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">USN:</span>
                    <span class="detail-value">${student.usn}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${student.email}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Company Name:</span>
                    <span class="detail-value">${student.companyName || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Type of Offer:</span>
                    <span class="detail-value">${student.offerType || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Salary:</span>
                    <span class="detail-value">${student.placedSalary} LPA (${AppState.salaryRanges[student.salaryRange]})</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Placed Date:</span>
                    <span class="detail-value">${new Date(student.placedDate).toLocaleDateString()}</span>
                </div>
            </div>
            
            <div class="offer-letter-preview">
                <h3>Offer Letter Preview</h3>
                ${student.offerLetter.startsWith('data:image/') ? 
                    `<img src="${student.offerLetter}" alt="Offer Letter" style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 8px;">` :
                    `<iframe src="${student.offerLetter}" style="width: 100%; height: 500px; border: 1px solid #ddd; border-radius: 8px;"></iframe>`
                }
            </div>
            
            <div class="modal-actions">
                <button onclick="downloadOfferLetter('${student.id}')" class="btn btn-outline">
                    <i class="fas fa-file-pdf"></i>
                    Download Letter Only
                </button>
                <button onclick="closeOfferLetterModal(this)" class="btn btn-secondary">
                    Close
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Add click outside to close functionality
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeOfferLetterModal(e.target);
        }
    });
}

// Close offer letter modal and restore body scroll
function closeOfferLetterModal(element) {
    const modal = element.closest('.modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = ''; // Restore body scroll
    }
}

// Download offer letter
function downloadOfferLetter(studentId) {
    const student = AppState.students.find(s => s.id === studentId);
    if (!student || !student.offerLetter) {
        showNotification('Offer letter not found', 'error');
        return;
    }
    
    try {
        // Create filename
        const filename = `OfferLetter_${student.usn}_${student.placedSalary}LPA.pdf`;
        
        // Create download link
        const link = document.createElement('a');
        link.href = student.offerLetter;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification(`Offer letter downloaded: ${filename}`, 'success');
    } catch (error) {
        console.error('Error downloading offer letter:', error);
        showNotification('Error downloading offer letter', 'error');
    }
}


function downloadOfferLetterWithDetailsOld(studentId) {
    const student = AppState.students.find(s => s.id === studentId);
    if (!student || !student.offerLetter) {
        showNotification('Offer letter not found', 'error');
        return;
    }
    
    try {
        console.log('Generating PDF with offer letter details for:', student.usn);
        showNotification('Generating PDF... Please wait', 'info');
        
        // Create a new window with the offer letter content
        const printWindow = window.open('', '_blank');
        
        // Create HTML content that matches the modal view exactly
        const pdfContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Offer Letter - ${student.usn}</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 20px; 
                        line-height: 1.6;
                        color: #333;
                        background: #fff;
                    }
                    .header { 
                        text-align: center; 
                        border-bottom: 2px solid #ff6f00; 
                        padding-bottom: 20px; 
                        margin-bottom: 30px;
                    }
                    .header h1 {
                        color: #ff6f00;
                        margin: 0;
                        font-size: 28px;
                    }
                    .section { 
                        margin-bottom: 30px; 
                        page-break-inside: avoid;
                    }
                    .section h2 { 
                        color: #ff6f00; 
                        border-bottom: 1px solid #ddd; 
                        padding-bottom: 10px;
                        font-size: 20px;
                    }
                    .student-details {
                        background: #f9f9f9;
                        padding: 20px;
                        border-radius: 8px;
                        margin-bottom: 20px;
                    }
                    .detail-row {
                        display: flex;
                        margin-bottom: 10px;
                        padding: 5px 0;
                    }
                    .detail-label {
                        font-weight: bold;
                        width: 150px;
                        color: #555;
                    }
                    .detail-value {
                        flex: 1;
                        color: #333;
                    }
                    .offer-letter-section {
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        overflow: hidden;
                        margin-top: 20px;
                    }
                    .offer-letter-header {
                        background: #f5f5f5;
                        padding: 15px;
                        border-bottom: 1px solid #ddd;
                        font-weight: bold;
                        color: #333;
                    }
                    .offer-letter-content {
                        padding: 20px;
                        min-height: 400px;
                    }
                    .offer-letter-iframe {
                        width: 100%;
                        height: 600px;
                        border: none;
                        border-radius: 4px;
                        background: #fff;
                    }
                    .offer-letter-image {
                        max-width: 100%;
                        height: auto;
                        border-radius: 4px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        display: block;
                        margin: 0 auto;
                    }
                    .offer-letter-content {
                        padding: 20px;
                        min-height: 400px;
                        background: #fff;
                    }
                    @media print {
                        .no-print { display: none !important; }
                        body { margin: 0; }
                        .section { page-break-inside: avoid; }
                        .offer-letter-section { page-break-inside: avoid; }
                        .offer-letter-iframe { 
                            height: 800px !important;
                            width: 100% !important;
                            background: #fff !important;
                        }
                        .offer-letter-content {
                            background: #fff !important;
                            padding: 10px !important;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Offer Letter - ${student.usn}</h1>
                    <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                </div>
                
                <div class="section">
                    <h2>Student Details</h2>
                    <div class="student-details">
                        <div class="detail-row">
                            <span class="detail-label">Student Name:</span>
                            <span class="detail-value">${student.name || 'N/A'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">USN:</span>
                            <span class="detail-value">${student.usn}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Email:</span>
                            <span class="detail-value">${student.email}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Company Name:</span>
                            <span class="detail-value">${student.companyName || 'N/A'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Type of Offer:</span>
                            <span class="detail-value">${student.offerType || 'N/A'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Salary:</span>
                            <span class="detail-value">${student.placedSalary} LPA (${AppState.salaryRanges[student.salaryRange]})</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Placed Date:</span>
                            <span class="detail-value">${new Date(student.placedDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <h2>Offer Letter</h2>
                    <div class="offer-letter-section">
                        <div class="offer-letter-header">
                            Offer Letter Content
                        </div>
                        <div class="offer-letter-content">
                            ${student.offerLetter.startsWith('data:image/') 
                                ? `<img src="${student.offerLetter}" class="offer-letter-image" alt="Offer Letter">`
                                : `<iframe src="${student.offerLetter}" class="offer-letter-iframe" title="Offer Letter" allow="fullscreen" referrerpolicy="no-referrer-when-downgrade"></iframe>`
                            }
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
        
        // Write content to new window
        printWindow.document.write(pdfContent);
        printWindow.document.close();
        
        // Wait for content to load, then trigger print
        setTimeout(() => {
            // Ensure iframe is fully loaded before printing
            const iframe = printWindow.document.querySelector('.offer-letter-iframe');
            if (iframe) {
                iframe.onload = function() {
                    setTimeout(() => {
                        printWindow.print();
                        printWindow.close();
                        showNotification('PDF download initiated! Check your print dialog.', 'success');
                    }, 1000);
                };
            } else {
                // For images, print immediately
                printWindow.print();
                printWindow.close();
                showNotification('PDF download initiated! Check your print dialog.', 'success');
            }
        }, 3000); // Wait longer for iframe to load
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        showNotification('Error generating PDF: ' + error.message, 'error');
    }
}

// Student offer letter view and download functions
function viewStudentOfferLetter() {
    if (!AppState.currentStudent || !AppState.currentStudent.offerLetter) {
        showNotification('No offer letter found', 'error');
        return;
    }
    
    const student = AppState.currentStudent;
    
    // Create modal to display offer letter
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
            <span class="close" onclick="closeOfferLetterModal(this)">&times;</span>
            <h2>Your Offer Letter</h2>
            
            <div class="student-details">
                <div class="detail-row">
                    <span class="detail-label">Student Name:</span>
                    <span class="detail-value">${student.name || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">USN:</span>
                    <span class="detail-value">${student.usn}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${student.email}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Company Name:</span>
                    <span class="detail-value">${student.companyName || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Type of Offer:</span>
                    <span class="detail-value">${student.offerType || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Salary:</span>
                    <span class="detail-value">${student.placedSalary} LPA (${AppState.salaryRanges[student.salaryRange]})</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Placed Date:</span>
                    <span class="detail-value">${new Date(student.placedDate).toLocaleDateString()}</span>
                </div>
            </div>
            
            <div class="offer-letter-preview">
                <h3>Offer Letter</h3>
                ${student.offerLetter.startsWith('data:image/') ? 
                    `<img src="${student.offerLetter}" alt="Offer Letter" style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 8px;">` :
                    `<iframe src="${student.offerLetter}" style="width: 100%; height: 500px; border: 1px solid #ddd; border-radius: 8px;"></iframe>`
                }
            </div>
            
            <div class="modal-actions">
                <button onclick="downloadStudentOfferLetter()" class="btn btn-outline">
                    <i class="fas fa-file-pdf"></i>
                    Download Letter Only
                </button>
                <button onclick="closeOfferLetterModal(this)" class="btn btn-secondary">
                    Close
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Add click outside to close functionality
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeOfferLetterModal(e.target);
        }
    });
}

function downloadStudentOfferLetter() {
    if (!AppState.currentStudent || !AppState.currentStudent.offerLetter) {
        showNotification('No offer letter found', 'error');
        return;
    }
    
    const student = AppState.currentStudent;
    
    try {
        // Create filename
        const filename = `MyOfferLetter_${student.usn}_${student.placedSalary}LPA.pdf`;
        
        // Create download link
        const link = document.createElement('a');
        link.href = student.offerLetter;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification(`Offer letter downloaded: ${filename}`, 'success');
    } catch (error) {
        console.error('Error downloading offer letter:', error);
        showNotification('Error downloading offer letter', 'error');
    }
}


function downloadStudentOfferLetterWithDetailsOld() {
    if (!AppState.currentStudent || !AppState.currentStudent.offerLetter) {
        showNotification('No offer letter found', 'error');
        return;
    }
    
    const student = AppState.currentStudent;
    
    try {
        console.log('Generating PDF with offer letter details...');
        showNotification('Generating PDF... Please wait', 'info');
        
        // Create a new window with the offer letter content
        const printWindow = window.open('', '_blank');
        
        // Add error handling for blocked content
        printWindow.addEventListener('error', function(e) {
            console.log('Window error detected:', e);
        });
        
        // Create HTML content that matches the modal view exactly
        const pdfContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Your Offer Letter - ${student.usn}</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 20px; 
                        line-height: 1.6;
                        color: #333;
                        background: #fff;
                    }
                    .header { 
                        text-align: center; 
                        border-bottom: 2px solid #ff6f00; 
                        padding-bottom: 20px; 
                        margin-bottom: 30px;
                    }
                    .header h1 {
                        color: #ff6f00;
                        margin: 0;
                        font-size: 28px;
                    }
                    .section { 
                        margin-bottom: 30px; 
                        page-break-inside: avoid;
                    }
                    .section h2 { 
                        color: #ff6f00; 
                        border-bottom: 1px solid #ddd; 
                        padding-bottom: 10px;
                        font-size: 20px;
                    }
                    .student-details {
                        background: #f9f9f9;
                        padding: 20px;
                        border-radius: 8px;
                        margin-bottom: 20px;
                    }
                    .detail-row {
                        display: flex;
                        margin-bottom: 10px;
                        padding: 5px 0;
                    }
                    .detail-label {
                        font-weight: bold;
                        width: 150px;
                        color: #555;
                    }
                    .detail-value {
                        flex: 1;
                        color: #333;
                    }
                    .offer-letter-section {
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        overflow: hidden;
                        margin-top: 20px;
                    }
                    .offer-letter-header {
                        background: #f5f5f5;
                        padding: 15px;
                        border-bottom: 1px solid #ddd;
                        font-weight: bold;
                        color: #333;
                    }
                    .offer-letter-content {
                        padding: 20px;
                        min-height: 400px;
                        background: #fff;
                    }
                    .offer-letter-iframe {
                        width: 100%;
                        height: 600px;
                        border: none;
                        border-radius: 4px;
                        background: #fff;
                    }
                    .offer-letter-image {
                        max-width: 100%;
                        height: auto;
                        border-radius: 4px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        display: block;
                        margin: 0 auto;
                    }
                    @media print {
                        .no-print { display: none !important; }
                        body { margin: 0; }
                        .section { page-break-inside: avoid; }
                        .offer-letter-section { page-break-inside: avoid; }
                        .offer-letter-iframe { 
                            height: 800px !important;
                            width: 100% !important;
                            background: #fff !important;
                        }
                        .offer-letter-content {
                            background: #fff !important;
                            padding: 10px !important;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Your Offer Letter</h1>
                    <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                </div>
                
                <div class="section">
                    <h2>Student Details</h2>
                    <div class="student-details">
                        <div class="detail-row">
                            <span class="detail-label">Student Name:</span>
                            <span class="detail-value">${student.name || 'N/A'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">USN:</span>
                            <span class="detail-value">${student.usn}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Email:</span>
                            <span class="detail-value">${student.email}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Company Name:</span>
                            <span class="detail-value">${student.companyName || 'N/A'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Type of Offer:</span>
                            <span class="detail-value">${student.offerType || 'N/A'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Salary:</span>
                            <span class="detail-value">${student.placedSalary} LPA (${AppState.salaryRanges[student.salaryRange]})</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Placed Date:</span>
                            <span class="detail-value">${new Date(student.placedDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <h2>Offer Letter</h2>
                    <div class="offer-letter-section">
                        <div class="offer-letter-header">
                            Offer Letter Content
                        </div>
                        <div class="offer-letter-content">
                            ${student.offerLetter.startsWith('data:image/') 
                                ? `<img src="${student.offerLetter}" class="offer-letter-image" alt="Offer Letter">`
                                : `<iframe src="${student.offerLetter}" class="offer-letter-iframe" title="Offer Letter" allow="fullscreen" referrerpolicy="no-referrer-when-downgrade"></iframe>`
                            }
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
        
        // Write content to new window
        printWindow.document.write(pdfContent);
        printWindow.document.close();
        
        // Wait for content to load, then trigger print
        setTimeout(() => {
            // Ensure iframe is fully loaded before printing
            const iframe = printWindow.document.querySelector('.offer-letter-iframe');
            if (iframe) {
                iframe.onload = function() {
                    setTimeout(() => {
                        printWindow.print();
                        printWindow.close();
                        showNotification('PDF download initiated! Check your print dialog.', 'success');
                    }, 1000);
                };
            } else {
                // For images, print immediately
                printWindow.print();
                printWindow.close();
                showNotification('PDF download initiated! Check your print dialog.', 'success');
            }
        }, 3000); // Wait longer for iframe to load
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        showNotification('Error generating PDF: ' + error.message, 'error');
    }
}

// Helper function to create simple offer letter representation
function createSimpleOfferLetterRepresentation(ctx, student) {
    // Create a simple representation that shows the actual offer letter content
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 800, 600);
    
    // Add border to match modal styling
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, 800, 600);
    
    // Add a simple note that this is the offer letter content
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Offer Letter Content', 400, 50);
    
    ctx.font = '14px Arial';
    ctx.fillText('(This is the actual offer letter content from the modal)', 400, 80);
    
    // Add a placeholder for the actual content
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(50, 120, 700, 400);
    
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.strokeRect(50, 120, 700, 400);
    
    // Add text indicating this is the offer letter
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('The actual offer letter content would be displayed here', 400, 200);
    ctx.fillText('as it appears in the modal view', 400, 220);
    
    // Add note at bottom
    ctx.font = '10px Arial';
    ctx.fillText('Note: This represents the offer letter content from the modal', 400, 550);
}

// Helper function to capture iframe content more effectively
function captureIframeContent(iframe, doc, yPosition, student) {
    return new Promise((resolve, reject) => {
        if (!window.html2canvas) {
            reject(new Error('html2canvas not available'));
            return;
        }

        console.log('Starting iframe capture for:', iframe.src);

        // Try multiple approaches to capture the iframe content
        const captureAttempts = [
            // Attempt 1: Direct iframe capture
            () => {
                console.log('Attempt 1: Direct iframe capture');
                return html2canvas(iframe, {
                    useCORS: true,
                    allowTaint: true,
                    scale: 1,
                    width: 800,
                    height: 600,
                    backgroundColor: '#ffffff'
                });
            },
            
            // Attempt 2: Capture iframe content document
            () => {
                console.log('Attempt 2: Capture iframe content document');
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (!iframeDoc || !iframeDoc.body) {
                    throw new Error('Cannot access iframe document');
                }
                
                console.log('Iframe document body found, creating temp div');
                const tempDiv = document.createElement('div');
                tempDiv.style.width = '800px';
                tempDiv.style.height = '600px';
                tempDiv.style.position = 'absolute';
                tempDiv.style.left = '-9999px';
                tempDiv.style.top = '-9999px';
                tempDiv.style.overflow = 'hidden';
                tempDiv.style.backgroundColor = '#ffffff';
                tempDiv.innerHTML = iframeDoc.body.innerHTML;
                
                document.body.appendChild(tempDiv);
                
                return html2canvas(tempDiv, {
                    useCORS: true,
                    allowTaint: true,
                    scale: 1,
                    backgroundColor: '#ffffff'
                }).then(canvas => {
                    document.body.removeChild(tempDiv);
                    return canvas;
                });
            },
            
            // Attempt 3: Capture iframe window content
            () => {
                console.log('Attempt 3: Capture iframe window content');
                const iframeWindow = iframe.contentWindow;
                if (!iframeWindow || !iframeWindow.document) {
                    throw new Error('Cannot access iframe window');
                }
                
                return html2canvas(iframeWindow.document.body, {
                    useCORS: true,
                    allowTaint: true,
                    scale: 1,
                    backgroundColor: '#ffffff'
                });
            }
        ];

        // Try each capture method
        let attemptIndex = 0;
        const tryNextAttempt = () => {
            if (attemptIndex >= captureAttempts.length) {
                console.log('All capture attempts failed');
                reject(new Error('All capture attempts failed'));
                return;
            }

            console.log(`Trying capture attempt ${attemptIndex + 1}`);
            captureAttempts[attemptIndex]()
                .then(canvas => {
                    console.log(`Capture attempt ${attemptIndex + 1} succeeded`);
                    const imgData = canvas.toDataURL('image/png');
                    addImageToPDF(doc, imgData, yPosition, student);
                    resolve(canvas);
                })
                .catch(error => {
                    console.error(`Capture attempt ${attemptIndex + 1} failed:`, error);
                    attemptIndex++;
                    tryNextAttempt();
                });
        };

        tryNextAttempt();
    });
}

// Helper function to add image to PDF
function addImageToPDF(doc, imgData, yPosition, student) {
    try {
        // Calculate dimensions to fit on page
        const maxWidth = 170;
        const maxHeight = 200;
        let imgWidth = 170;
        let imgHeight = 150;
        
        // Add image to PDF
        doc.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
        
        // Save the PDF
        const filename = `PlacementDetails_${student.usn}_${student.companyName || 'Company'}_${student.placedSalary}LPA.pdf`;
        doc.save(filename);
        
        showNotification(`Placement details PDF downloaded: ${filename}`, 'success');
    } catch (error) {
        console.error('Error adding image to PDF:', error);
        showNotification('Error generating PDF. Please try again.', 'error');
    }
}

// Helper function to create fallback content when iframe capture fails
function createFallbackContent(doc, yPosition, student) {
    try {
        // Create a canvas to draw the fallback content
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 600;
        
        // Create a more informative fallback
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 800, 600);
        
        // Add border
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, 800, 600);
        
        // Add title
        ctx.fillStyle = '#333';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Offer Letter Content', 400, 50);
        
        // Add note about the content
        ctx.font = '14px Arial';
        ctx.fillText('This section contains the actual offer letter content', 400, 80);
        ctx.fillText('as displayed in the modal view', 400, 100);
        
        // Add a placeholder box
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(50, 150, 700, 400);
        
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        ctx.strokeRect(50, 150, 700, 400);
        
        // Add content description
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.fillText('The offer letter content from the modal would be displayed here', 400, 200);
        ctx.fillText('This includes the actual PDF or image content', 400, 220);
        
        // Add technical note
        ctx.font = '10px Arial';
        ctx.fillStyle = '#999';
        ctx.fillText('Note: If you see this message, the iframe content capture failed', 400, 500);
        ctx.fillText('This may be due to cross-origin restrictions or loading issues', 400, 520);
        
        // Convert to image and add to PDF
        const imgData = canvas.toDataURL('image/png');
        addImageToPDF(doc, imgData, yPosition, student);
        
    } catch (error) {
        console.error('Error creating fallback content:', error);
        showNotification('Error generating PDF. Please try again.', 'error');
    }
}

// New function to handle PDF offer letter content more reliably
function handlePDFOfferLetterContent(doc, yPosition, student) {
    return new Promise((resolve, reject) => {
        console.log('Starting PDF offer letter content handling for:', student.offerLetter);
        
        // Create a visible iframe to capture content
        const iframe = document.createElement('iframe');
        iframe.src = student.offerLetter;
        iframe.style.width = '800px';
        iframe.style.height = '600px';
        iframe.style.border = '1px solid #ddd';
        iframe.style.borderRadius = '8px';
        iframe.style.position = 'fixed';
        iframe.style.left = '50%';
        iframe.style.top = '50%';
        iframe.style.transform = 'translate(-50%, -50%)';
        iframe.style.zIndex = '9999';
        iframe.style.backgroundColor = '#ffffff';
        
        // Add loading overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
        overlay.style.zIndex = '9998';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.innerHTML = '<div style="color: white; font-size: 18px; text-align: center;"><div>Capturing offer letter content...</div><div style="font-size: 14px; margin-top: 10px;">Please wait while we capture the content</div></div>';
        
        document.body.appendChild(overlay);
        document.body.appendChild(iframe);
        
        let captureAttempted = false;
        
        iframe.onload = function() {
            console.log('Iframe loaded, waiting for content...');
            setTimeout(() => {
                if (captureAttempted) return;
                captureAttempted = true;
                
                try {
                    console.log('Attempting to capture iframe content...');
                    
                    if (window.html2canvas) {
                        // Try direct iframe capture first
                        html2canvas(iframe, {
                            useCORS: true,
                            allowTaint: true,
                            scale: 1,
                            width: 800,
                            height: 600,
                            backgroundColor: '#ffffff',
                            logging: true
                        }).then(canvas => {
                            console.log('Direct iframe capture successful');
                            const imgData = canvas.toDataURL('image/png');
                            addImageToPDF(doc, imgData, yPosition, student);
                            
                            // Clean up
                            document.body.removeChild(iframe);
                            document.body.removeChild(overlay);
                            resolve();
                        }).catch(error => {
                            console.error('Direct iframe capture failed:', error);
                            
                            // Try alternative approach
                            try {
                                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                                if (iframeDoc && iframeDoc.body) {
                                    console.log('Trying content document capture...');
                                    
                                    const tempDiv = document.createElement('div');
                                    tempDiv.style.width = '800px';
                                    tempDiv.style.height = '600px';
                                    tempDiv.style.position = 'absolute';
                                    tempDiv.style.left = '-9999px';
                                    tempDiv.style.top = '-9999px';
                                    tempDiv.style.overflow = 'hidden';
                                    tempDiv.style.backgroundColor = '#ffffff';
                                    tempDiv.innerHTML = iframeDoc.body.innerHTML;
                                    
                                    document.body.appendChild(tempDiv);
                                    
                                    html2canvas(tempDiv, {
                                        useCORS: true,
                                        allowTaint: true,
                                        scale: 1,
                                        backgroundColor: '#ffffff',
                                        logging: true
                                    }).then(canvas => {
                                        console.log('Content document capture successful');
                                        const imgData = canvas.toDataURL('image/png');
                                        addImageToPDF(doc, imgData, yPosition, student);
                                        
                                        // Clean up
                                        document.body.removeChild(tempDiv);
                                        document.body.removeChild(iframe);
                                        document.body.removeChild(overlay);
                                        resolve();
                                    }).catch(error2 => {
                                        console.error('Content document capture failed:', error2);
                                        // Final fallback
                                        createFallbackContent(doc, yPosition, student);
                                        
                                        // Clean up
                                        document.body.removeChild(tempDiv);
                                        document.body.removeChild(iframe);
                                        document.body.removeChild(overlay);
                                        resolve();
                                    });
                                } else {
                                    console.error('Cannot access iframe document');
                                    // Final fallback
                                    createFallbackContent(doc, yPosition, student);
                                    
                                    // Clean up
                                    document.body.removeChild(iframe);
                                    document.body.removeChild(overlay);
                                    resolve();
                                }
                            } catch (error3) {
                                console.error('Alternative capture failed:', error3);
                                // Final fallback
                                createFallbackContent(doc, yPosition, student);
                                
                                // Clean up
                                document.body.removeChild(iframe);
                                document.body.removeChild(overlay);
                                resolve();
                            }
                        });
                    } else {
                        console.error('html2canvas not available');
                        // Final fallback
                        createFallbackContent(doc, yPosition, student);
                        
                        // Clean up
                        document.body.removeChild(iframe);
                        document.body.removeChild(overlay);
                        resolve();
                    }
                } catch (error) {
                    console.error('Error processing iframe:', error);
                    // Final fallback
                    createFallbackContent(doc, yPosition, student);
                    
                    // Clean up
                    document.body.removeChild(iframe);
                    document.body.removeChild(overlay);
                    resolve();
                }
            }, 3000); // Wait 3 seconds for iframe to fully load
        };
        
        iframe.onerror = function() {
            console.error('Iframe failed to load');
            if (captureAttempted) return;
            captureAttempted = true;
            
            // Final fallback
            createFallbackContent(doc, yPosition, student);
            
            // Clean up
            document.body.removeChild(iframe);
            document.body.removeChild(overlay);
            resolve();
        };
        
        // Timeout fallback
        setTimeout(() => {
            if (captureAttempted) return;
            captureAttempted = true;
            
            console.error('Iframe capture timeout');
            // Final fallback
            createFallbackContent(doc, yPosition, student);
            
            // Clean up
            document.body.removeChild(iframe);
            document.body.removeChild(overlay);
            resolve();
        }, 10000); // 10 second timeout
    });
}

// Manual Student Entry Functions
function showAddStudentModal() {
    document.getElementById('add-student-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Clear form
    document.getElementById('add-student-form').reset();
}

function closeAddStudentModal() {
    document.getElementById('add-student-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Clear form
    document.getElementById('add-student-form').reset();
}

async function handleAddStudent(event) {
    event.preventDefault();
    
    const studentData = {
        usn: document.getElementById('manual-usn').value.trim(),
        name: document.getElementById('manual-name').value.trim(),
        email: document.getElementById('manual-email').value.trim(),
        cgpa: document.getElementById('manual-cgpa').value.trim(),
        marks10th: document.getElementById('manual-10th').value.trim(),
        marks12th: document.getElementById('manual-12th').value.trim()
    };
    
    // Validate the data
    const validationError = validateStudentData(studentData);
    if (validationError) {
        showNotification(validationError, 'error');
        return;
    }
    
    // Check for duplicate email and USN
    if (AppState.students.some(s => s.email === studentData.email)) {
        showNotification('Email already exists', 'error');
        return;
    }
    
    if (AppState.students.some(s => s.usn === studentData.usn)) {
        showNotification('USN already exists', 'error');
        return;
    }
    
    try {
        // Create student object
        const student = {
            id: `student_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            usn: studentData.usn,
            email: studentData.email,
            cgpa: parseFloat(studentData.cgpa),
            marks10th: parseFloat(studentData.marks10th),
            marks12th: parseFloat(studentData.marks12th),
            name: studentData.name,
            password: generateRandomPassword(),
            createdAt: new Date().toISOString(),
            isEligible: checkStudentEligibility(studentData)
        };
        
        // Add to database
        await addStudentsToDatabase([student]);
        
        // Close modal and refresh list
        closeAddStudentModal();
        loadStudentList();
        
        showNotification(`Student ${student.usn} added successfully! Password: ${student.password}`, 'success');
        
    } catch (error) {
        console.error('Error adding student:', error);
        showNotification('Error adding student: ' + error.message, 'error');
    }
}



function handleStudentFileDrop(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        processStudentFile(files[0]);
    }
}

function handleStudentFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        processStudentFile(file);
    }
}

function processStudentFile(file) {
    console.log('Processing student file:', file.name, file.type, file.size);
    
    const progressDiv = document.getElementById('student-upload-progress');
    const progressFill = document.getElementById('student-progress-fill');
    const progressText = document.getElementById('student-progress-text');
    
    if (!progressDiv || !progressFill || !progressText) {
        console.error('Required elements not found for student upload progress');
        showNotification('Error: Upload interface not properly initialized', 'error');
        return;
    }
    
    progressDiv.style.display = 'block';
    progressFill.style.width = '0%';
    progressText.textContent = 'Reading file...';
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = e.target.result;
            let csvData;
            
            console.log('File read successfully, processing...');
            
            if (file.name.endsWith('.csv')) {
                console.log('Processing CSV file');
                csvData = parseCSV(data);
                console.log('CSV data parsed:', csvData.length, 'rows');
                console.log('CSV data content:', csvData);
            } else if (file.name.endsWith('.xlsx')) {
                console.log('Processing XLSX file');
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                csvData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                console.log('XLSX data parsed:', csvData.length, 'rows');
            } else {
                throw new Error('Unsupported file format. Please use .csv or .xlsx files.');
            }
            
            if (!csvData || csvData.length === 0) {
                throw new Error('No data found in file');
            }
            
            progressFill.style.width = '50%';
            progressText.textContent = 'Processing data...';
            
            setTimeout(() => {
                const result = processStudentDataFromCSV(csvData);
                console.log('Student data processed:', result);
                displayStudentPreview(result);
                
                progressFill.style.width = '100%';
                progressText.textContent = 'Complete!';
                
                setTimeout(() => {
                    progressDiv.style.display = 'none';
                }, 1000);
            }, 500);
            
        } catch (error) {
            console.error('Error processing file:', error);
            showNotification('Error processing file: ' + error.message, 'error');
            progressDiv.style.display = 'none';
        }
    };
    
    reader.onerror = function() {
        console.error('Error reading file');
        showNotification('Error reading file. Please try again.', 'error');
        progressDiv.style.display = 'none';
    };
    
    if (file.name.endsWith('.csv')) {
        reader.readAsText(file, 'UTF-8');
    } else {
        reader.readAsBinaryString(file);
    }
}

function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    return lines.map(line => {
        // Handle CSV with quoted fields and commas inside quotes
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        
        return result.map(cell => cell.replace(/^"|"$/g, '').trim());
    });
}

function displayStudentPreview(result) {
    console.log('displayStudentPreview called with result:', result);
    const { students, errors } = result;
    
    console.log('Students to display:', students);
    console.log('Errors found:', errors);
    
    // Show errors if any
    const errorsDiv = document.getElementById('upload-errors');
    const errorList = document.getElementById('error-list');
    
    if (errors.length > 0) {
        console.log('Showing errors:', errors);
        errorsDiv.style.display = 'block';
        errorList.innerHTML = errors.map(error => `<li>${error}</li>`).join('');
    } else {
        errorsDiv.style.display = 'none';
    }
    
    // Display preview table
    const table = document.getElementById('student-preview-table');
    const header = document.getElementById('student-preview-header');
    const body = document.getElementById('student-preview-body');
    
    if (!table || !header || !body) {
        console.error('Required table elements not found');
        showNotification('Error: Preview table not found', 'error');
        return;
    }
    
    header.innerHTML = `
        <tr>
            <th>USN</th>
            <th>Name</th>
            <th>Email</th>
            <th>CGPA</th>
            <th>10th Marks</th>
            <th>12th Marks</th>
            <th>Password</th>
            <th>Eligible</th>
        </tr>
    `;
    
    body.innerHTML = students.map(student => `
        <tr>
            <td>${student.usn}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.cgpa}</td>
            <td>${student.marks10th}%</td>
            <td>${student.marks12th}%</td>
            <td>${student.password}</td>
            <td><span class="${student.isEligible ? 'eligible-yes' : 'eligible-no'}">${student.isEligible ? 'Yes' : 'No'}</span></td>
        </tr>
    `).join('');
    
    // Store students for saving
    window.pendingStudents = students;
    console.log('Stored pending students:', window.pendingStudents);
    console.log('Number of pending students:', window.pendingStudents ? window.pendingStudents.length : 0);
    
    // Enable save button if there are valid students (even if there are some errors)
    const saveBtn = document.getElementById('save-student-btn');
    if (saveBtn) {
        saveBtn.disabled = students.length === 0;
        console.log('Save button disabled:', saveBtn.disabled, 'Students count:', students.length);
    } else {
        console.error('Save button not found');
    }
    
    const dataViewer = document.getElementById('student-data-viewer');
    if (dataViewer) {
        dataViewer.style.display = 'block';
        console.log('Data viewer displayed');
    } else {
        console.error('Data viewer not found');
    }
}

async function saveStudentData() {
    console.log('saveStudentData called');
    console.log('Pending students:', window.pendingStudents);
    
    if (window.pendingStudents && window.pendingStudents.length > 0) {
        try {
            console.log('Saving', window.pendingStudents.length, 'students to database');
            await addStudentsToDatabase(window.pendingStudents);
            closeStudentUploadModal();
            loadStudentList();
            window.pendingStudents = null;
            showNotification(`Successfully saved ${window.pendingStudents.length} students!`, 'success');
        } catch (error) {
            console.error('Error in saveStudentData:', error);
            showNotification('Error saving student data: ' + error.message, 'error');
        }
    } else {
        console.warn('No pending students to save');
        showNotification('No student data to save. Please upload a file first.', 'warning');
    }
}

function loadStudentList() {
    // Check if we're in the admin student management page
    const adminStudentList = document.getElementById('admin-student-list');
    if (adminStudentList) {
        loadAdminStudentList();
        return;
    }
    
    // Original function for regular student list
    const studentList = document.getElementById('student-list');
    const totalStudents = document.getElementById('total-students');
    const eligibleStudents = document.getElementById('eligible-students');
    const ineligibleStudents = document.getElementById('ineligible-students');
    
    if (!studentList) return; // Exit if not on student page
    
    // Update stats
    const total = AppState.students.length;
    const eligible = AppState.students.filter(s => s.isEligible).length;
    const ineligible = total - eligible;
    
    if (totalStudents) totalStudents.textContent = total;
    if (eligibleStudents) eligibleStudents.textContent = eligible;
    if (ineligibleStudents) ineligibleStudents.textContent = ineligible;
    
    // Display students
    if (AppState.students.length === 0) {
        studentList.innerHTML = '<div class="no-data-message"><p>No students added yet. Upload student data to get started.</p></div>';
        return;
    }
    
    studentList.innerHTML = AppState.students.map(student => `
        <div class="student-card">
            <div class="student-info">
                <h4>${student.name || 'N/A'} (${student.usn})</h4>
                <p><strong>Email:</strong> ${student.email}</p>
                <p><strong>CGPA:</strong> ${student.cgpa} | <strong>10th:</strong> ${student.marks10th}% | <strong>12th:</strong> ${student.marks12th}%</p>
                <p><strong>Password:</strong> ${student.password}</p>
                ${student.isPlaced ? `
                    <div class="placement-info">
                        <p><strong>Status:</strong> <span class="placed-status">Placed</span></p>
                        <p><strong>Salary:</strong> ${student.placedSalary} LPA (${AppState.salaryRanges[student.salaryRange]})</p>
                        <p><strong>Placed Date:</strong> ${new Date(student.placedDate).toLocaleDateString()}</p>
                    </div>
                ` : `
                    <div class="placement-info">
                        <p><strong>Status:</strong> <span class="not-placed-status">Not Placed</span></p>
                    </div>
                `}
            </div>
            <div class="student-actions">
                <span class="student-eligible-badge ${student.isEligible ? 'eligible' : 'ineligible'}">
                    ${student.isEligible ? 'Eligible' : 'Ineligible'}
                </span>
                <button onclick="editStudent('${student.id}')" class="edit-btn">
                    <i class="fas fa-edit"></i>
                    Edit
                </button>
                ${student.isPlaced && student.offerLetter ? `
                    <button onclick="viewOfferLetter('${student.id}')" class="view-btn">
                        <i class="fas fa-eye"></i>
                        View Offer
                    </button>
                    <button onclick="downloadOfferLetter('${student.id}')" class="download-btn">
                        <i class="fas fa-download"></i>
                        Download
                    </button>
                ` : ''}
                <button onclick="deleteStudent('${student.id}')" class="delete-btn">
                    <i class="fas fa-trash"></i>
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

function loadAdminStudentList() {
    const adminStudentList = document.getElementById('admin-student-list');
    if (!adminStudentList) return;
    
    console.log('Loading admin student list, total students:', AppState.students.length);
    
    // Update statistics
    updateStudentStatistics();
    
    // Get filtered students
    const filteredStudents = getFilteredStudents();
    
    // Display students in admin format
    if (filteredStudents.length === 0) {
        if (AppState.students.length === 0) {
            adminStudentList.innerHTML = `
                <div class="no-data-message">
                    <div class="no-data-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <h3>No Students Found</h3>
                    <p>No students have been added to the system yet.</p>
                    <p>Use the upload feature or add students manually to get started.</p>
                </div>
            `;
        } else {
            adminStudentList.innerHTML = `
                <div class="no-data-message">
                    <div class="no-data-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3>No Matching Students</h3>
                    <p>No students match your current search or filter criteria.</p>
                    <p>Try adjusting your search terms or filter options.</p>
                </div>
            `;
        }
        return;
    }
    
    adminStudentList.innerHTML = filteredStudents.map(student => `
        <div class="admin-student-card" data-usn="${student.usn}" data-email="${student.email}" data-name="${student.name || ''}" data-eligible="${student.isEligible}">
            <div class="student-header">
                <div class="student-identity">
                    <h4>${student.usn}</h4>
                    <span class="student-eligible-badge ${student.isEligible ? 'eligible' : 'ineligible'}">
                        <i class="fas fa-${student.isEligible ? 'check-circle' : 'times-circle'}"></i>
                        ${student.isEligible ? 'Eligible' : 'Ineligible'}
                    </span>
                </div>
                <div class="student-actions">
                    <button onclick="editStudent('${student.id}')" class="edit-btn" title="Edit Student">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteStudent('${student.id}')" class="delete-btn" title="Delete Student">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="student-details">
                <div class="detail-row">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">${student.name || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${student.email}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">CGPA:</span>
                    <span class="detail-value">${student.cgpa}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">10th Marks:</span>
                    <span class="detail-value">${student.marks10th}%</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">12th Marks:</span>
                    <span class="detail-value">${student.marks12th}%</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Password:</span>
                    <span class="detail-value password-field">
                        <span class="password-text">${student.password}</span>
                        <button onclick="copyToClipboard('${student.password}')" class="copy-btn" title="Copy Password">
                            <i class="fas fa-copy"></i>
                        </button>
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Created:</span>
                    <span class="detail-value">${new Date(student.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Update student statistics
function updateStudentStatistics() {
    const totalStudents = AppState.students.length;
    const eligibleStudents = AppState.students.filter(s => s.isEligible).length;
    const ineligibleStudents = totalStudents - eligibleStudents;
    const placedStudents = AppState.students.filter(s => s.isPlaced).length;
    
    // Update the count in the management card title
    const totalCount = document.getElementById('total-students-count');
    if (totalCount) {
        totalCount.textContent = `(${totalStudents})`;
    }
    
    // Update the count in the student statistics page
    const totalCountStats = document.getElementById('total-students-count-stats');
    if (totalCountStats) {
        totalCountStats.textContent = totalStudents;
    }
    
    const eligibleCount = document.getElementById('eligible-students-count');
    const ineligibleCount = document.getElementById('ineligible-students-count');
    const placedCount = document.getElementById('placed-students-count');
    
    if (eligibleCount) eligibleCount.textContent = eligibleStudents;
    if (ineligibleCount) ineligibleCount.textContent = ineligibleStudents;
    if (placedCount) placedCount.textContent = placedStudents;
    
    // Also update the placed students count in the student statistics page
    const placedCountStats = document.getElementById('placed-students');
    if (placedCountStats) placedCountStats.textContent = placedStudents;
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString();
    } catch (error) {
        console.error('Error formatting date:', dateString, error);
        return 'Invalid Date';
    }
}

// Show placed students page
function showPlacedStudentsPage() {
    hideAllPages();
    document.getElementById('placed-students-page').classList.add('active');
    loadPlacedStudentsPage();
}

// Load placed students page data
function loadPlacedStudentsPage() {
    updatePlacedStudentsStats();
    loadPlacedStudentsList();
}

// Update placed students statistics
function updatePlacedStudentsStats() {
    const placedStudents = AppState.students.filter(s => s.isPlaced);
    const totalPlaced = placedStudents.length;
    
    // Calculate average salary
    const totalSalary = placedStudents.reduce((sum, student) => sum + (student.placedSalary || 0), 0);
    const avgSalary = totalPlaced > 0 ? (totalSalary / totalPlaced).toFixed(1) : 0;
    
    // Calculate recent placements (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentPlacements = placedStudents.filter(student => {
        const placedDate = new Date(student.placedDate);
        return placedDate >= thirtyDaysAgo;
    }).length;
    
    // Update UI
    const totalPlacedCount = document.getElementById('total-placed-count');
    const avgSalaryElement = document.getElementById('avg-salary');
    const recentPlacementsElement = document.getElementById('recent-placements');
    
    if (totalPlacedCount) totalPlacedCount.textContent = totalPlaced;
    if (avgSalaryElement) avgSalaryElement.textContent = avgSalary;
    if (recentPlacementsElement) recentPlacementsElement.textContent = recentPlacements;
}

// Load placed students list
function loadPlacedStudentsList() {
    const placedStudents = AppState.students.filter(s => s.isPlaced);
    const container = document.getElementById('placed-students-list');
    
    if (!container) return;
    
    if (placedStudents.length === 0) {
        container.innerHTML = `
            <div class="no-placed-students">
                <i class="fas fa-briefcase"></i>
                <h3>No Placed Students</h3>
                <p>No students have been placed yet. Upload offer letters to mark students as placed.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = placedStudents.map(student => `
        <div class="placed-student-card">
            <div class="placed-student-header">
                <div class="placed-student-info">
                    <h3>${student.name}</h3>
                    <p>${student.usn}</p>
                </div>
                <div class="placed-badge">
                    <i class="fas fa-briefcase"></i>
                    Placed
                </div>
            </div>
            
            <div class="placed-student-details">
                <div class="detail-item">
                    <div class="detail-label">Email</div>
                    <div class="detail-value">${student.email}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">CGPA</div>
                    <div class="detail-value">${student.cgpa}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Company Name</div>
                    <div class="detail-value">${student.companyName || 'N/A'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Type of Offer</div>
                    <div class="detail-value">${student.offerType || 'N/A'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Placed Salary</div>
                    <div class="detail-value salary-highlight">${student.placedSalary} LPA</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Placed Date</div>
                    <div class="detail-value">${formatDate(student.placedDate)}</div>
                </div>
            </div>
            
            <div class="placed-student-actions">
                <button class="btn view-offer-btn" onclick="viewOfferLetter('${student.id}')">
                    <i class="fas fa-eye"></i>
                    View Offer
                </button>
                <button class="btn download-letter-btn" onclick="downloadOfferLetter('${student.id}')">
                    <i class="fas fa-file-pdf"></i>
                    Download Letter
                </button>
            </div>
        </div>
    `).join('');
}

// Filter placed students
function filterPlacedStudents() {
    const searchTerm = document.getElementById('placed-student-search')?.value.toLowerCase() || '';
    const salaryFilter = document.getElementById('salary-filter')?.value || 'all';
    
    const placedStudents = AppState.students.filter(s => s.isPlaced);
    let filtered = placedStudents;
    
    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(student => 
            student.name.toLowerCase().includes(searchTerm) ||
            student.usn.toLowerCase().includes(searchTerm) ||
            student.email.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply salary filter
    if (salaryFilter !== 'all') {
        filtered = filtered.filter(student => {
            const salary = student.placedSalary || 0;
            switch (salaryFilter) {
                case 'below10':
                    return salary < 10;
                case 'below20':
                    return salary >= 10 && salary < 20;
                case 'above20':
                    return salary >= 20;
                default:
                    return true;
            }
        });
    }
    
    // Update the display
    const container = document.getElementById('placed-students-list');
    if (!container) return;
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="no-placed-students">
                <i class="fas fa-search"></i>
                <h3>No Students Found</h3>
                <p>No placed students match your search criteria.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(student => `
        <div class="placed-student-card">
            <div class="placed-student-header">
                <div class="placed-student-info">
                    <h3>${student.name}</h3>
                    <p>${student.usn}</p>
                </div>
                <div class="placed-badge">
                    <i class="fas fa-briefcase"></i>
                    Placed
                </div>
            </div>
            
            <div class="placed-student-details">
                <div class="detail-item">
                    <div class="detail-label">Email</div>
                    <div class="detail-value">${student.email}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">CGPA</div>
                    <div class="detail-value">${student.cgpa}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Company Name</div>
                    <div class="detail-value">${student.companyName || 'N/A'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Type of Offer</div>
                    <div class="detail-value">${student.offerType || 'N/A'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Placed Salary</div>
                    <div class="detail-value salary-highlight">${student.placedSalary} LPA</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Placed Date</div>
                    <div class="detail-value">${formatDate(student.placedDate)}</div>
                </div>
            </div>
            
            <div class="placed-student-actions">
                <button class="btn view-offer-btn" onclick="viewOfferLetter('${student.id}')">
                    <i class="fas fa-eye"></i>
                    View Offer
                </button>
                <button class="btn download-letter-btn" onclick="downloadOfferLetter('${student.id}')">
                    <i class="fas fa-file-pdf"></i>
                    Download Letter
                </button>
            </div>
        </div>
    `).join('');
}

// Export placed students data
function exportPlacedStudentsData() {
    const placedStudents = AppState.students.filter(s => s.isPlaced);
    
    if (placedStudents.length === 0) {
        showNotification('No placed students to export', 'warning');
        return;
    }
    
    // Create CSV content
    const headers = ['USN', 'Name', 'Email', 'CGPA', 'Company Name', 'Type of Offer', 'Placed Salary (LPA)', 'Placed Date', 'Salary Range'];
    const csvContent = [
        headers.join(','),
        ...placedStudents.map(student => [
            student.usn,
            `"${student.name}"`,
            student.email,
            student.cgpa,
            `"${student.companyName || 'N/A'}"`,
            `"${student.offerType || 'N/A'}"`,
            student.placedSalary || 0,
            formatDate(student.placedDate),
            student.salaryRange || 'N/A'
        ].join(','))
    ].join('\n');
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `placed_students_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification(`Exported ${placedStudents.length} placed students data`, 'success');
}

// Get filtered students based on search and filter criteria
function getFilteredStudents() {
    const searchTerm = document.getElementById('student-search')?.value.toLowerCase() || '';
    const eligibilityFilter = document.getElementById('eligibility-filter')?.value || 'all';
    
    let filtered = AppState.students;
    
    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(student => 
            student.usn.toLowerCase().includes(searchTerm) ||
            student.email.toLowerCase().includes(searchTerm) ||
            (student.name && student.name.toLowerCase().includes(searchTerm))
        );
    }
    
    // Apply eligibility filter
    if (eligibilityFilter === 'eligible') {
        filtered = filtered.filter(student => student.isEligible);
    } else if (eligibilityFilter === 'ineligible') {
        filtered = filtered.filter(student => !student.isEligible);
    }
    
    return filtered;
}

function filterStudents() {
    // Check if we're in the admin student management page
    const adminStudentList = document.getElementById('admin-student-list');
    if (adminStudentList) {
        // Reload the admin student list with current filters
        loadAdminStudentList();
        return;
    }
    
    // Original function for regular student list
    const searchTerm = document.getElementById('student-search')?.value.toLowerCase() || '';
    const studentCards = document.querySelectorAll('.student-card');
    
    studentCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function editStudent(studentId) {
    const student = AppState.students.find(s => s.id == studentId);
    if (!student) return;
    
    document.getElementById('edit-student-id').value = student.id;
    document.getElementById('edit-student-usn').value = student.usn;
    document.getElementById('edit-student-name').value = student.name || '';
    document.getElementById('edit-student-email').value = student.email;
    document.getElementById('edit-student-cgpa').value = student.cgpa;
    document.getElementById('edit-student-10th').value = student.marks10th;
    document.getElementById('edit-student-12th').value = student.marks12th;
    
    document.getElementById('edit-student-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeEditStudentModal() {
    document.getElementById('edit-student-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function handleEditStudentSubmit(event) {
    event.preventDefault();
    
    const studentId = document.getElementById('edit-student-id').value;
    const student = AppState.students.find(s => s.id == studentId);
    
    if (!student) return;
    
    // Update student data
    student.usn = document.getElementById('edit-student-usn').value;
    student.name = document.getElementById('edit-student-name').value;
    student.email = document.getElementById('edit-student-email').value;
    student.cgpa = parseFloat(document.getElementById('edit-student-cgpa').value);
    student.marks10th = parseFloat(document.getElementById('edit-student-10th').value);
    student.marks12th = parseFloat(document.getElementById('edit-student-12th').value);
    
    // Recalculate eligibility
    student.isEligible = checkStudentEligibility(student);
    
    saveDataToStorage();
    closeEditStudentModal();
    loadStudentList();
    showNotification('Student updated successfully', 'success');
}

function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        AppState.students = AppState.students.filter(s => s.id != studentId);
        saveDataToStorage();
        loadStudentList();
        showNotification('Student deleted successfully', 'success');
    }
}

// Navigation Functions
function showStudentDashboard() {
    // Check if student is logged in
    if (!AppState.currentStudent) {
        showNotification('Please login to access student portal', 'error');
        showStudentLogin();
        return;
    }
    
    hideAllPages();
    document.getElementById('student-portal').classList.add('active');
    setActiveNav('student-nav');
    loadStudentDashboard();
    closeMobileMenu();
}

function showAdminLogin() {
    if (AppState.currentUser) {
        showAdminDashboard();
    } else {
        hideAllPages();
        document.getElementById('admin-login').classList.add('active');
        setActiveNav('admin-nav');
    }
    closeMobileMenu();
}

function showHomepage() {
    hideAllPages();
    document.getElementById('homepage').classList.add('active');
    updateNavigationForStudent();
    
    // Initialize device detection and download options
    setTimeout(() => {
        updateDeviceInfo();
    }, 100);
}

function showStudentLogin() {
    hideAllPages();
    document.getElementById('student-login').classList.add('active');
    updateNavigationForStudent();
}

// Student Portal Section Navigation
function showStudentSection(section) {
    console.log('🔄 Switching to section:', section);
    
    // Handle shortlisted section specially
    if (section === 'shortlisted') {
        showShortlistedView();
        return;
    }
    
    // Hide all sections
    document.querySelectorAll('.student-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.portal-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(`student-${section}-section`).classList.add('active');
    document.getElementById(`nav-${section}`).classList.add('active');
    
    // Load content based on section
    if (section === 'notifications') {
        console.log('🔔 Loading notifications section...');
        createAndDisplayNotificationsDirectly();
    } else if (section === 'available-jobs') {
        loadEligibleJobs();
    } else if (section === 'my-portal') {
        loadStudentInfo();
    } else if (section === 'offer-letter') {
        loadStudentOfferLetterSection();
    }
}

function showAdminDashboard() {
    hideAllPages();
    document.getElementById('admin-dashboard').classList.add('active');
    setActiveNav('admin-nav');
    loadAdminDashboard();
}

function showStudentManagementPage() {
    hideAllPages();
    document.getElementById('student-management-page').classList.add('active');
    setActiveNav('admin-nav');
    loadStudentManagementPage();
}

function showShortlistedView() {
    // Check if student is logged in
    if (!AppState.currentStudent) {
        showNotification('Please login to view shortlisted data', 'error');
        showStudentLogin();
        return;
    }
    
    hideAllPages();
    document.getElementById('shortlisted-view').classList.add('active');
    setActiveNav('shortlisted-nav');
    closeMobileMenu();
    
    // Update global shortlisted data from job-specific data
    updateGlobalShortlistedData();
    
    // Check if data exists
    if (AppState.shortlistedData.length === 0) {
        document.getElementById('no-shortlisted-data').style.display = 'block';
        document.getElementById('shortlisted-data-section').style.display = 'none';
    } else {
        document.getElementById('no-shortlisted-data').style.display = 'none';
        document.getElementById('shortlisted-data-section').style.display = 'block';
        showCompanyView(); // Show company view by default
    }
}

function hideAllPages() {
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(page => page.classList.remove('active'));
}

function setActiveNav(activeId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    const activeElement = document.getElementById(activeId);
    if (activeElement) {
        activeElement.classList.add('active');
    } else {
        console.warn('Navigation element not found:', activeId);
    }
}

function updateNavigationForStudent() {
    // Hide/show navigation items based on login status
    const homepageNav = document.getElementById('homepage-nav');
    const studentLoginNav = document.getElementById('student-login-nav');
    const adminNav = document.getElementById('admin-nav');
    const studentNav = document.getElementById('student-nav');
    // Check if elements exist before accessing their style
    if (homepageNav && studentLoginNav && adminNav && studentNav) {
        if (AppState.currentStudent) {
            // Student is logged in
            homepageNav.style.display = 'none';
            studentLoginNav.style.display = 'none';
            adminNav.style.display = 'none';
            studentNav.style.display = 'block';
        } else if (AppState.currentUser) {
            // Admin is logged in
            homepageNav.style.display = 'none';
            studentLoginNav.style.display = 'none';
            adminNav.style.display = 'block';
            studentNav.style.display = 'none';
        } else {
            // No one is logged in
            homepageNav.style.display = 'block';
            studentLoginNav.style.display = 'block';
            adminNav.style.display = 'block';
            studentNav.style.display = 'none';
        }
    } else {
        console.warn('⚠️ Some navigation elements not found:', {
            homepageNav: !!homepageNav,
            studentLoginNav: !!studentLoginNav,
            adminNav: !!adminNav,
            studentNav: !!studentNav
        });
    }
}

// Student Dashboard Functions
function loadJobs() {
    // Check and update job statuses before displaying
    checkAndUpdateJobStatuses();
    
    const jobListings = document.getElementById('job-listings');
    jobListings.innerHTML = '';
    
    AppState.filteredJobs.forEach((job, index) => {
        const jobCard = createJobCard(job, index);
        jobListings.appendChild(jobCard);
    });
    
    // Animate job cards
    animateJobCards();
}

function createJobCard(job, index) {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.style.animationDelay = `${index * 0.1}s`;
    card.onclick = () => {
        console.log('Job card clicked for job:', job);
        showJobDetail(job.id);
    };
    
    const statusClass = job.status.toLowerCase().replace(' ', '-');
    const formattedDeadline = new Date(job.deadline).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    
    card.innerHTML = `
        <div class="job-header">
            <div>
                <div class="company-name">${job.company}</div>
                <div class="job-title">${job.title}</div>
            </div>
            <span class="status-badge ${statusClass}">${job.status}</span>
        </div>
        <div class="job-details">
            <div class="job-detail-item">
                <i class="fas fa-calendar-alt"></i>
                <span>Deadline: ${formattedDeadline}</span>
            </div>
            <div class="job-detail-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>${job.location}</span>
            </div>
            <div class="job-detail-item">
                <i class="fas fa-rupee-sign"></i>
                <span>${job.salary}</span>
            </div>
        </div>
        <div class="job-actions">
            <button class="view-details-btn">
                <span>View Details</span>
                <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    `;
    
    return card;
}

function animateJobCards() {
    const cards = document.querySelectorAll('.job-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function filterJobs() {
    const searchTerm = document.getElementById('job-search').value.toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;
    
    AppState.filteredJobs = AppState.jobs.filter(job => {
        const matchesSearch = job.company.toLowerCase().includes(searchTerm) || 
                             job.title.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || job.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });
    
    loadJobs();
}

// Job Detail Functions
function showJobDetail(jobId) {
    console.log('showJobDetail called with jobId:', jobId);
    const job = AppState.jobs.find(j => j.id === jobId);
    console.log('Found job:', job);
    if (!job) {
        console.log('Job not found with id:', jobId);
        return;
    }
    
    const modal = document.getElementById('job-detail-modal');
    const content = document.getElementById('job-detail-content');
    
    const formattedDeadline = new Date(job.deadline).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    
    const statusClass = job.status.toLowerCase().replace(' ', '-');
    
    content.innerHTML = `
        <div class="job-detail-header">
            <div class="job-detail-title">${job.title}</div>
            <div class="job-detail-company">${job.company}</div>
            <span class="status-badge ${statusClass}">${job.status}</span>
        </div>
        
        <div class="job-detail-section">
            <h3><i class="fas fa-info-circle"></i> Job Description</h3>
            <p>${job.description}</p>
        </div>
        
        <div class="job-detail-grid">
            <div class="detail-item">
                <h4><i class="fas fa-calendar-alt"></i> Application Deadline</h4>
                <p>${formattedDeadline}</p>
            </div>
            <div class="detail-item">
                <h4><i class="fas fa-map-marker-alt"></i> Location</h4>
                <p>${job.location}</p>
            </div>
            <div class="detail-item">
                <h4><i class="fas fa-rupee-sign"></i> Salary Range</h4>
                <p>${job.salary}</p>
            </div>
            <div class="detail-item">
                <h4><i class="fas fa-building"></i> Company</h4>
                <p>${job.company}</p>
            </div>
        </div>
        
        <div class="job-detail-grid">
            <div class="detail-item">
                <h4><i class="fas fa-graduation-cap"></i> Eligible Branches</h4>
                <p>${job.branches || 'Not specified'}</p>
            </div>
            <div class="detail-item">
                <h4><i class="fas fa-calendar-check"></i> Eligible Batches</h4>
                <p>${job.batches || 'Not specified'}</p>
            </div>
        </div>
        
        <div class="job-detail-section">
            <h3><i class="fas fa-check-circle"></i> Eligibility Criteria</h3>
            <p>${job.eligibility}</p>
        </div>
        
        <div class="job-detail-section">
            <h3><i class="fas fa-graduation-cap"></i> Academic Requirements</h3>
            <div class="eligibility-criteria-grid">
                <div class="criteria-item">
                    <h4><i class="fas fa-certificate"></i> 10th Standard</h4>
                    <p>Minimum: <span class="criteria-value">${job.academicRequirements?.min10thMarks || AppState.eligibilityCriteria.min10thMarks}%</span></p>
                </div>
                <div class="criteria-item">
                    <h4><i class="fas fa-medal"></i> 12th/Diploma</h4>
                    <p>Minimum: <span class="criteria-value">${job.academicRequirements?.min12thMarks || AppState.eligibilityCriteria.min12thMarks}%</span></p>
                </div>
                <div class="criteria-item">
                    <h4><i class="fas fa-star"></i> Engineering CGPA</h4>
                    <p>Minimum: <span class="criteria-value">${job.academicRequirements?.minCGPAMarks || AppState.eligibilityCriteria.minCGPAMarks}</span></p>
                </div>
            </div>
        </div>
        
        <div class="job-detail-section">
        
        ${job.selectionProcess ? `
            <div class="job-detail-section">
                <h3><i class="fas fa-tasks"></i> Selection Process</h3>
                <p>${job.selectionProcess}</p>
            </div>
        ` : ''}
        
        <div class="job-detail-grid">
            <div class="detail-item">
                <h4><i class="fas fa-clock"></i> Status</h4>
                <p><span class="status-badge ${statusClass}">${job.status}</span></p>
            </div>
            <div class="detail-item">
                <h4><i class="fas fa-calendar-alt"></i> Application Deadline</h4>
                <p>${formattedDeadline}</p>
            </div>
        </div>
        
        ${job.status === 'Open' ? `
            <div class="apply-section">
                <div class="apply-header">
                    <h3><i class="fas fa-paper-plane"></i> Ready to Apply?</h3>
                    <p>Click the button below to access the application form</p>
                </div>
                ${AppState.currentStudent && checkStudentEligibilityForJob(AppState.currentStudent, job) ? `
                    <a href="${job.formLink}" target="_blank" class="apply-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span>Apply Now</span>
                    </a>
                    <p class="apply-note">You will be redirected to the company's application form</p>
                ` : `
                    <div class="apply-btn disabled">
                        <i class="fas fa-lock"></i>
                        <span>Not Eligible</span>
                    </div>
                    ${AppState.currentStudent ? `
                        <div class="eligibility-reasons">
                            <h4><i class="fas fa-exclamation-triangle"></i> Eligibility Issues:</h4>
                            <ul>
                                ${getEligibilityFailureReasons(AppState.currentStudent, job).map(reason => `<li>${reason}</li>`).join('')}
                            </ul>
                        </div>
                    ` : `
                        <p class="apply-note">Please login to check your eligibility</p>
                    `}
                `}
            </div>
        ` : `
            <div class="apply-section">
                <div class="apply-header">
                    <h3><i class="fas fa-info-circle"></i> Application Status</h3>
                    <p>${job.status === 'Closed' ? 'Applications are no longer being accepted' : 'Applications are currently being reviewed'}</p>
                </div>
                <button class="apply-btn" disabled style="opacity: 0.6; cursor: not-allowed;">
                    <i class="fas fa-times-circle"></i>
                    <span>Applications ${job.status === 'Closed' ? 'Closed' : 'In Review'}</span>
                </button>
            </div>
        `}
    `;
    
    console.log('Showing modal:', modal);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    console.log('Modal should now be visible');
}

function closeJobDetail() {
    const modal = document.getElementById('job-detail-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Admin Authentication
function handleAdminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    // Check against default admin or stored admins
    let isValidAdmin = false;
    
    // Check default admin
    if (username === 'himu' && password === 'Himu*1bca') {
        isValidAdmin = true;
    } else {
        // Check stored admins
        const admin = AppState.admins.find(admin => admin.username === username && admin.password === password);
        if (admin) {
            isValidAdmin = true;
        }
    }
    
    if (isValidAdmin) {
        AppState.currentUser = { username: username, role: 'admin' };
        
        // Save login state to localStorage
        localStorage.setItem('currentUser', JSON.stringify(AppState.currentUser));
        localStorage.setItem('loginType', 'admin');
        
        showNotification('Login successful!', 'success');
        showAdminDashboard();
    } else {
        showNotification('Invalid credentials', 'error');
    }
}

function logout() {
    AppState.currentUser = null;
    
    // Clear login state from localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('loginType');
    
    showNotification('Logged out successfully', 'info');
    showHomepage();
}

// Admin Dashboard Functions
function loadAdminDashboard() {
    loadAdminJobList();
    loadAdminNotifications();
    loadAdminList();
    loadStudentList();
    updateManagementStats(); // Update the management card statistics
}


function loadAdminJobList() {
    // Check and update job statuses before displaying
    checkAndUpdateJobStatuses();
    
    const adminJobList = document.getElementById('admin-job-list');
    if (!adminJobList) {
        console.log('admin-job-list element not found, skipping reload');
        return;
    }
    
    adminJobList.innerHTML = '';
    
    AppState.jobs.forEach(job => {
        const jobCard = createAdminJobCard(job);
        adminJobList.appendChild(jobCard);
    });
}

function createAdminJobCard(job) {
    const card = document.createElement('div');
    card.className = 'admin-job-card';
    
    const formattedDeadline = new Date(job.deadline).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    const statusClass = job.status.toLowerCase().replace(' ', '-');
    const hasShortlisted = AppState.jobShortlisted[job.id] && AppState.jobShortlisted[job.id].length > 0;
    
    card.innerHTML = `
        <div class="admin-job-header">
            <div class="admin-job-info">
                <h4>${job.title}</h4>
                <p>${job.company} • ${job.location} • Deadline: ${formattedDeadline}</p>
                ${hasShortlisted ? `
                    <div class="shortlisted-indicator">
                        <i class="fas fa-users"></i>
                        <span>${AppState.jobShortlisted[job.id].length - 1} candidates shortlisted</span>
                    </div>
                ` : ''}
            </div>
            <div class="admin-job-actions">
                <select class="status-select" onchange="updateJobStatus(${job.id}, this.value)">
                    <option value="Open" ${job.status === 'Open' ? 'selected' : ''}>Open</option>
                    <option value="Interviewing" ${job.status === 'Interviewing' ? 'selected' : ''}>Interviewing</option>
                    <option value="Closed" ${job.status === 'Closed' ? 'selected' : ''}>Closed</option>
                </select>
                <button class="admin-btn edit-btn" onclick="editJob(${job.id})">
                    <i class="fas fa-edit"></i>
                    Edit
                </button>
                <button class="admin-btn shortlist-btn" onclick="showJobShortlistUpload(${job.id})" title="Upload Shortlisted Candidates">
                    <i class="fas fa-user-check"></i>
                    ${hasShortlisted ? 'Update' : 'Shortlist'}
                </button>
                ${hasShortlisted ? `
                    <button class="admin-btn view-shortlist-btn" onclick="viewJobShortlist(${job.id})" title="View Shortlisted Candidates">
                        <i class="fas fa-eye"></i>
                        View
                    </button>
                    <button class="admin-btn delete-shortlist-btn" onclick="deleteJobShortlisted(${job.id})" title="Delete Shortlisted Candidates">
                        <i class="fas fa-user-times"></i>
                        Delete Shortlisted
                    </button>
                ` : ''}
                <button class="admin-btn delete-btn" onclick="deleteJob(${job.id})">
                    <i class="fas fa-trash"></i>
                    Delete
                </button>
            </div>
        </div>
        <div class="admin-job-details">
            <span class="status-badge ${statusClass}">${job.status}</span>
            <span class="job-salary">${job.salary}</span>
        </div>
    `;
    
    return card;
}

// Job Management Functions
function showAddJobModal() {
    AppState.editingJobId = null;
    document.getElementById('job-form-title').textContent = 'Add New Job';
    document.getElementById('job-form').reset();
    document.getElementById('job-form-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Populate eligibility criteria inputs with current values
    document.getElementById('job-10th-marks').value = AppState.eligibilityCriteria.min10thMarks;
    document.getElementById('job-12th-marks').value = AppState.eligibilityCriteria.min12thMarks;
    document.getElementById('job-cgpa-marks').value = AppState.eligibilityCriteria.minCGPAMarks;
    
    // Initialize salary range checkboxes to default (only "not-placed" checked)
    populateSalaryRangeCheckboxes(['not-placed']);
}

function editJob(jobId) {
    const job = AppState.jobs.find(j => j.id === jobId);
    if (!job) return;
    
    AppState.editingJobId = jobId;
    document.getElementById('job-form-title').textContent = 'Edit Job';
    
    // Populate form with job data
    document.getElementById('job-company').value = job.company;
    document.getElementById('job-title').value = job.title;
    // Format deadline for datetime-local input (YYYY-MM-DDTHH:MM)
    const deadlineDate = new Date(job.deadline);
    const formattedDeadline = deadlineDate.toISOString().slice(0, 16);
    document.getElementById('job-deadline').value = formattedDeadline;
    document.getElementById('job-status').value = job.status;
    document.getElementById('job-description').value = job.description;
    document.getElementById('job-salary').value = job.salary;
    document.getElementById('job-location').value = job.location;
    document.getElementById('job-eligibility').value = job.eligibility;
    document.getElementById('job-batches').value = job.batches || '';
    document.getElementById('job-branches').value = job.branches || '';
    document.getElementById('job-selection-process').value = job.selectionProcess || '';
    document.getElementById('job-form-link').value = job.formLink;
    
    document.getElementById('job-form-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Populate eligibility criteria inputs with job-specific values or default values
    document.getElementById('job-10th-marks').value = job.academicRequirements?.min10thMarks || AppState.eligibilityCriteria.min10thMarks;
    document.getElementById('job-12th-marks').value = job.academicRequirements?.min12thMarks || AppState.eligibilityCriteria.min12thMarks;
    document.getElementById('job-cgpa-marks').value = job.academicRequirements?.minCGPAMarks || AppState.eligibilityCriteria.minCGPAMarks;
    
    // Populate salary range eligibility checkboxes
    populateSalaryRangeCheckboxes(job.eligibleSalaryRanges || []);
}

// Helper function to populate salary range checkboxes
function populateSalaryRangeCheckboxes(selectedRanges) {
    const checkboxes = [
        { id: 'job-eligible-below10', value: 'below10' },
        { id: 'job-eligible-below20', value: 'below20' },
        { id: 'job-eligible-above20', value: 'above20' },
        { id: 'job-eligible-not-placed', value: 'not-placed' }
    ];
    
    checkboxes.forEach(checkbox => {
        const element = document.getElementById(checkbox.id);
        if (element) {
            element.checked = selectedRanges.includes(checkbox.value);
        }
    });
}

// Helper function to get selected salary ranges
function getSelectedSalaryRanges() {
    const ranges = [];
    const checkboxes = [
        { id: 'job-eligible-below10', value: 'below10' },
        { id: 'job-eligible-below20', value: 'below20' },
        { id: 'job-eligible-above20', value: 'above20' },
        { id: 'job-eligible-not-placed', value: 'not-placed' }
    ];
    
    checkboxes.forEach(checkbox => {
        if (document.getElementById(checkbox.id).checked) {
            ranges.push(checkbox.value);
        }
    });
    
    return ranges;
}

function handleJobSubmit(event) {
    event.preventDefault();
    
    const jobData = {
        company: document.getElementById('job-company').value,
        title: document.getElementById('job-title').value,
        deadline: new Date(document.getElementById('job-deadline').value).toISOString(),
        status: document.getElementById('job-status').value,
        description: document.getElementById('job-description').value,
        salary: document.getElementById('job-salary').value,
        location: document.getElementById('job-location').value,
        eligibility: document.getElementById('job-eligibility').value,
        batches: document.getElementById('job-batches').value,
        branches: document.getElementById('job-branches').value,
        selectionProcess: document.getElementById('job-selection-process').value,
        formLink: document.getElementById('job-form-link').value,
        // Academic requirements for this specific job
        academicRequirements: {
            min10thMarks: parseFloat(document.getElementById('job-10th-marks').value) || AppState.eligibilityCriteria.min10thMarks,
            min12thMarks: parseFloat(document.getElementById('job-12th-marks').value) || AppState.eligibilityCriteria.min12thMarks,
            minCGPAMarks: parseFloat(document.getElementById('job-cgpa-marks').value) || AppState.eligibilityCriteria.minCGPAMarks
        },
        // Salary range eligibility for placed students
        eligibleSalaryRanges: getSelectedSalaryRanges()
    };
    
    if (AppState.editingJobId) {
        // Update existing job
        const jobIndex = AppState.jobs.findIndex(j => j.id === AppState.editingJobId);
        AppState.jobs[jobIndex] = { ...AppState.jobs[jobIndex], ...jobData };
        showNotification('Job updated successfully!', 'success');
    } else {
        // Add new job
        const newJob = {
            id: AppState.jobs.length > 0 ? Math.max(...AppState.jobs.map(j => j.id)) + 1 : 1,
            ...jobData,
            applicants: []
        };
        AppState.jobs.push(newJob);
        
        // Add notification for new job
        addNotification({
            type: 'success',
            title: `New Job Opening: ${jobData.title}`,
            message: `${jobData.company} is hiring for ${jobData.title} position. Application deadline: ${new Date(jobData.deadline).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })}`,
            action: {
                text: 'View Details',
                callback: () => showJobDetail(newJob.id)
            }
        });
        
        // Send push notification to all users immediately
        sendNewJobNotification(jobData.title, jobData.company);
        
        // Update UI immediately without refresh
        updateUIAfterJobAdd(newJob);
        
        showNotification('Job added successfully!', 'success');
    }
    
    // Update filtered jobs and reload
    AppState.filteredJobs = [...AppState.jobs];
    saveDataToStorage(); // Save to cloud
    closeJobForm();
    loadAdminJobList();
    loadJobs();
}

function updateJobStatus(jobId, newStatus) {
    const job = AppState.jobs.find(j => j.id === jobId);
    if (job) {
        job.status = newStatus;
        AppState.filteredJobs = [...AppState.jobs];
        
        // Animate status change
        const statusBadge = event.target.closest('.admin-job-card').querySelector('.status-badge');
        statusBadge.style.opacity = '0';
        
        setTimeout(() => {
            statusBadge.textContent = newStatus;
            statusBadge.className = `status-badge ${newStatus.toLowerCase().replace(' ', '-')}`;
            statusBadge.style.opacity = '1';
        }, 150);
        
        loadJobs();
        saveDataToStorage(); // Save to cloud
        showNotification(`Job status updated to ${newStatus}`, 'success');
    }
}

function deleteJob(jobId) {
    if (confirm('Are you sure you want to delete this job?')) {
        AppState.jobs = AppState.jobs.filter(j => j.id !== jobId);
        AppState.filteredJobs = [...AppState.jobs];
        // Also remove any shortlisted data for this job
        delete AppState.jobShortlisted[jobId];
        
        console.log('Jobs after deletion:', AppState.jobs.length);
        saveDataToStorage(); // Save to cloud
        console.log('Data saved to cloud after deletion');
        
        loadAdminJobList();
        loadJobs();
        showNotification('Job deleted successfully!', 'success');
    }
}

function closeJobForm() {
    document.getElementById('job-form-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
    AppState.editingJobId = null;
    
    // Reset form and clear all fields
    document.getElementById('job-form').reset();
    document.getElementById('job-form-title').textContent = 'Add New Job';
    
    // Reset salary range checkboxes to default (only "not-placed" checked)
    populateSalaryRangeCheckboxes(['not-placed']);
}

// File Upload Functions
function showFileUpload(jobId) {
    AppState.currentJobId = jobId;
    document.getElementById('file-upload-modal').classList.add('active');
    document.getElementById('data-viewer').style.display = 'none';
    document.getElementById('upload-progress').style.display = 'none';
    document.body.style.overflow = 'hidden';
}

function closeFileUpload() {
    document.getElementById('file-upload-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
    AppState.currentJobId = null;
}

function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    // Handle both regular drop-zone and student-drop-zone
    const dropZone = event.currentTarget;
    if (dropZone) {
        dropZone.classList.add('drag-over');
    }
}

function handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    // Handle both regular drop-zone and student-drop-zone
    const dropZone = event.currentTarget;
    if (dropZone) {
        dropZone.classList.remove('drag-over');
    }
}

function handleFileDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    // Handle both regular drop-zone and student-drop-zone
    const dropZone = event.currentTarget;
    if (dropZone) {
        dropZone.classList.remove('drag-over');
    }
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        // Check which drop zone this is and call appropriate function
        if (dropZone && dropZone.id === 'student-drop-zone') {
            processStudentFile(files[0]);
        } else {
            processFile(files[0]);
        }
    }
}

function handleFileSelect(event) {
    const files = event.target.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function processFile(file) {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.csv')) {
        showNotification('Please select an XLSX or CSV file', 'error');
        return;
    }
    
    // Show upload progress
    document.getElementById('upload-progress').style.display = 'block';
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    // Animate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            progressText.textContent = 'Processing...';
            setTimeout(() => {
                readFile(file);
            }, 500);
        }
        progressFill.style.width = progress + '%';
        progressText.textContent = `Uploading... ${Math.floor(progress)}%`;
    }, 100);
}

function readFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            let data;
            
            if (file.name.endsWith('.csv')) {
                data = parseCSV(e.target.result);
            } else {
                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            }
            
            displayData(data);
            showNotification('File processed successfully!', 'success');
            
        } catch (error) {
            showNotification('Error processing file: ' + error.message, 'error');
        }
    };
    
    if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
    } else {
        reader.readAsBinaryString(file);
    }
}

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const result = [];
    
    for (let line of lines) {
        if (line.trim()) {
            result.push(line.split(',').map(cell => cell.trim()));
        }
    }
    
    return result;
}

function displayData(data) {
    if (!data || data.length === 0) {
        showNotification('No data found in file', 'error');
        return;
    }
    
    const dataViewer = document.getElementById('data-viewer');
    const tableHeader = document.getElementById('table-header');
    const tableBody = document.getElementById('table-body');
    
    // Clear previous data
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    
    // Create header
    const headerRow = document.createElement('tr');
    data[0].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    tableHeader.appendChild(headerRow);
    
    // Create body rows
    for (let i = 1; i < data.length; i++) {
        const row = document.createElement('tr');
        row.style.opacity = '0';
        row.style.transform = 'translateY(10px)';
        
        data[i].forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell || '';
            row.appendChild(td);
        });
        
        tableBody.appendChild(row);
        
        // Animate row appearance
        setTimeout(() => {
            row.style.transition = 'all 0.3s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, i * 50);
    }
    
    // Store applicant data
    const job = AppState.jobs.find(j => j.id === AppState.currentJobId);
    if (job) {
        job.applicants = data;
    }
    
    // Show data viewer
    document.getElementById('upload-progress').style.display = 'none';
    dataViewer.style.display = 'block';
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Calculate position for stacking from top - new notifications go to the top
    const existingNotifications = document.querySelectorAll('.notification');
    
    // Move existing notifications down first with smooth transition
    existingNotifications.forEach((existing, index) => {
        const newTopOffset = 20 + ((index + 1) * 60); // Push existing ones down
        existing.style.transition = 'top 0.3s ease';
        existing.style.top = `${newTopOffset}px`;
    });
    
    // New notification goes to the top
    notification.style.top = '20px';
    notification.style.transition = 'transform 0.3s ease';
    
    document.body.appendChild(notification);
    
    // Show notification from top
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentElement) {
                document.body.removeChild(notification);
                // Reposition remaining notifications
                repositionBasicNotifications();
            }
        }, 300);
    }, 3000);
}

// Reposition basic notifications after one is removed
function repositionBasicNotifications() {
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach((notification, index) => {
        const topOffset = 20 + (index * 60);
        notification.style.transition = 'top 0.3s ease';
        notification.style.top = `${topOffset}px`;
    });
}

function animateElements() {
    // Animate elements on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    // Observe animated elements
    document.querySelectorAll('.animate-slide-up').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease';
        observer.observe(el);
    });
}

// Modal close on outside click
document.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(modal => {
        if (event.target === modal) {
            if (modal.id === 'job-detail-modal') {
                closeJobDetail();
            } else if (modal.id === 'job-form-modal') {
                closeJobForm();
            } else if (modal.id === 'file-upload-modal') {
                closeFileUpload();
            } else if (modal.id === 'add-admin-modal') {
                closeAddAdminModal();
            }
        }
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            if (activeModal.id === 'job-detail-modal') {
                closeJobDetail();
            } else if (activeModal.id === 'job-form-modal') {
                closeJobForm();
            } else if (activeModal.id === 'file-upload-modal') {
                closeFileUpload();
            } else if (activeModal.id === 'add-admin-modal') {
                closeAddAdminModal();
            }
        }
    }
});

// Shortlisted Candidates Functions
function handleShortlistedFileDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('shortlisted-drop-zone').classList.remove('drag-over');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        processShortlistedFile(files[0]);
    }
}

function handleShortlistedFileSelect(event) {
    const files = event.target.files;
    if (files.length > 0) {
        processShortlistedFile(files[0]);
    }
}

function processShortlistedFile(file) {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.csv')) {
        showNotification('Please select an XLSX or CSV file', 'error');
        return;
    }
    
    // Show upload progress
    document.getElementById('shortlisted-upload-progress').style.display = 'block';
    const progressFill = document.getElementById('shortlisted-progress-fill');
    const progressText = document.getElementById('shortlisted-progress-text');
    
    // Animate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            progressText.textContent = 'Processing...';
            setTimeout(() => {
                readShortlistedFile(file);
            }, 500);
        }
        progressFill.style.width = progress + '%';
        progressText.textContent = `Uploading... ${Math.floor(progress)}%`;
    }, 100);
}

function readShortlistedFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            let data;
            
            if (file.name.endsWith('.csv')) {
                data = parseCSV(e.target.result);
            } else {
                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            }
            
            displayShortlistedData(data);
            showNotification('Shortlisted candidates file processed successfully!', 'success');
            
        } catch (error) {
            showNotification('Error processing file: ' + error.message, 'error');
        }
    };
    
    if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
    } else {
        reader.readAsBinaryString(file);
    }
}

function displayShortlistedData(data) {
    if (!data || data.length === 0) {
        showNotification('No data found in file', 'error');
        return;
    }
    
    // Store the data
    AppState.shortlistedData = data;
    AppState.filteredShortlistedData = data;
    
    // Show notification banner for students
    AppState.showShortlistedBanner = true;
    
    // Add notification for students
    addNotification({
        type: 'success',
        title: 'New Shortlisted Candidates Available!',
        message: `${data.length - 1} candidates have been shortlisted. Check if you're selected!`,
        action: {
            text: 'View Shortlisted',
            callback: () => showShortlistedView()
        }
    });
    
    // Load company view by default
    loadCompanyView();
    
    // Hide upload progress and show data section
    document.getElementById('shortlisted-upload-progress').style.display = 'none';
    document.getElementById('shortlisted-data-section').style.display = 'block';
    document.getElementById('no-shortlisted-data').style.display = 'none';
}


function filterShortlistedCandidates() {
    const searchTerm = document.getElementById('shortlisted-search').value.toLowerCase().trim();
    
    console.log('Search term:', searchTerm);
    console.log('Original data length:', AppState.shortlistedData ? AppState.shortlistedData.length : 0);
    
    if (!AppState.shortlistedData || AppState.shortlistedData.length === 0) return;
    
    if (!searchTerm) {
        AppState.filteredShortlistedData = AppState.shortlistedData;
        console.log('No search term, showing all data');
    } else {
        const filteredRows = AppState.shortlistedData.slice(1).filter(row => {
            const matches = row.some(cell => {
                if (!cell) return false;
                const cellValue = cell.toString().toLowerCase().trim();
                
                console.log('Checking cell:', cellValue, 'against search term:', searchTerm);
                
                // Simple and reliable search: just check if the search term is contained in the cell value
                if (cellValue.includes(searchTerm)) {
                    console.log('Match found!', cellValue, 'contains', searchTerm);
                    return true;
                }
                
                return false;
            });
            
            if (matches) {
                console.log('Match found in row:', row);
            }
            return matches;
        });
        
        AppState.filteredShortlistedData = [
            AppState.shortlistedData[0], // Keep header
            ...filteredRows
        ];
        
        console.log('Filtered data length:', AppState.filteredShortlistedData.length);
        console.log('Filtered rows:', filteredRows.length);
    }
    
    // Update company view
    loadCompanyView();
}


function exportShortlistedData() {
    // Use the new download function
    downloadShortlistedData();
}

function clearShortlistedData() {
    if (confirm('Are you sure you want to clear all shortlisted data?')) {
        AppState.shortlistedData = [];
        AppState.filteredShortlistedData = [];
        
        document.getElementById('shortlisted-data-section').style.display = 'none';
        document.getElementById('shortlisted-upload-progress').style.display = 'none';
        document.getElementById('shortlisted-file-input').value = '';
        document.getElementById('shortlisted-search').value = '';
        
        // Update admin stats if on admin page
        if (AppState.currentUser) {
            updateShortlistedStats();
        }
        
        showNotification('Shortlisted data cleared successfully!', 'success');
    }
}

// Admin Shortlisted Functions
function updateShortlistedStats() {
    const totalShortlisted = AppState.shortlistedData.length > 0 ? AppState.shortlistedData.length - 1 : 0;
    const companies = new Set();
    
    if (AppState.shortlistedData.length > 1) {
        // Find company column index (assuming it exists)
        const headers = AppState.shortlistedData[0];
        const companyIndex = headers.findIndex(header => 
            header.toLowerCase().includes('company') || 
            header.toLowerCase().includes('organization')
        );
        
        if (companyIndex !== -1) {
            for (let i = 1; i < AppState.shortlistedData.length; i++) {
                if (AppState.shortlistedData[i][companyIndex]) {
                    companies.add(AppState.shortlistedData[i][companyIndex]);
                }
            }
        }
    }
    
    animateCounter('total-shortlisted', totalShortlisted);
    animateCounter('shortlisted-companies', companies.size);
    
    // Show recent shortlisted preview
    showRecentShortlistedPreview();
}

function showRecentShortlistedPreview() {
    const previewSection = document.getElementById('recent-shortlisted-preview');
    const recentList = document.getElementById('recent-shortlisted-list');
    
    if (AppState.shortlistedData.length <= 1) {
        previewSection.style.display = 'none';
        return;
    }
    
    recentList.innerHTML = '';
    
    // Show last 5 entries
    const headers = AppState.shortlistedData[0];
    const nameIndex = headers.findIndex(header => 
        header.toLowerCase().includes('name') || 
        header.toLowerCase().includes('student')
    );
    const companyIndex = headers.findIndex(header => 
        header.toLowerCase().includes('company') || 
        header.toLowerCase().includes('organization')
    );
    const positionIndex = headers.findIndex(header => 
        header.toLowerCase().includes('position') || 
        header.toLowerCase().includes('role') ||
        header.toLowerCase().includes('job')
    );
    
    const recentEntries = AppState.shortlistedData.slice(-6, -1).reverse(); // Last 5 entries
    
    recentEntries.forEach((entry, index) => {
        const item = document.createElement('div');
        item.className = 'recent-item';
        item.style.opacity = '0';
        item.style.transform = 'translateY(10px)';
        
        const name = nameIndex !== -1 ? entry[nameIndex] : 'N/A';
        const company = companyIndex !== -1 ? entry[companyIndex] : 'Unknown Company';
        const position = positionIndex !== -1 ? entry[positionIndex] : 'Position not specified';
        
        item.innerHTML = `
            <div class="recent-item-info">
                <h5>${name}</h5>
                <p>${position}</p>
            </div>
            <div class="recent-item-company">${company}</div>
        `;
        
        recentList.appendChild(item);
        
        // Animate appearance
        setTimeout(() => {
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    previewSection.style.display = 'block';
}

function showShortlistedUploadModal() {
    document.getElementById('admin-shortlisted-modal').classList.add('active');
    document.getElementById('admin-data-viewer').style.display = 'none';
    document.getElementById('admin-upload-progress').style.display = 'none';
    document.body.style.overflow = 'hidden';
}

function closeAdminShortlistedModal() {
    document.getElementById('admin-shortlisted-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Clear form
    document.getElementById('admin-file-input').value = '';
    document.getElementById('admin-data-viewer').style.display = 'none';
    document.getElementById('admin-upload-progress').style.display = 'none';
}

function handleAdminShortlistedDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('admin-drop-zone').classList.remove('drag-over');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        processAdminShortlistedFile(files[0]);
    }
}

function handleAdminShortlistedSelect(event) {
    const files = event.target.files;
    if (files.length > 0) {
        processAdminShortlistedFile(files[0]);
    }
}

function processAdminShortlistedFile(file) {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.csv')) {
        showNotification('Please select an XLSX or CSV file', 'error');
        return;
    }
    
    // Show upload progress
    document.getElementById('admin-upload-progress').style.display = 'block';
    const progressFill = document.getElementById('admin-progress-fill');
    const progressText = document.getElementById('admin-progress-text');
    
    // Animate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            progressText.textContent = 'Processing...';
            setTimeout(() => {
                readAdminShortlistedFile(file);
            }, 500);
        }
        progressFill.style.width = progress + '%';
        progressText.textContent = `Uploading... ${Math.floor(progress)}%`;
    }, 100);
}

function readAdminShortlistedFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            let data;
            
            if (file.name.endsWith('.csv')) {
                data = parseCSV(e.target.result);
            } else {
                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            }
            
            displayAdminShortlistedPreview(data);
            showNotification('File processed successfully! Review and save.', 'success');
            
        } catch (error) {
            showNotification('Error processing file: ' + error.message, 'error');
        }
    };
    
    if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
    } else {
        reader.readAsBinaryString(file);
    }
}

function displayAdminShortlistedPreview(data) {
    if (!data || data.length === 0) {
        showNotification('No data found in file', 'error');
        return;
    }
    
    // Store temporarily for saving
    window.tempShortlistedData = data;
    
    const dataViewer = document.getElementById('admin-data-viewer');
    const tableHeader = document.getElementById('admin-table-header');
    const tableBody = document.getElementById('admin-table-body');
    
    // Clear previous data
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    
    // Create header
    const headerRow = document.createElement('tr');
    data[0].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    tableHeader.appendChild(headerRow);
    
    // Create body rows (show first 10 for preview)
    const previewRows = Math.min(data.length - 1, 10);
    for (let i = 1; i <= previewRows; i++) {
        const row = document.createElement('tr');
        
        data[i].forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell || '';
            row.appendChild(td);
        });
        
        tableBody.appendChild(row);
    }
    
    if (data.length > 11) {
        const moreRow = document.createElement('tr');
        const moreCell = document.createElement('td');
        moreCell.colSpan = data[0].length;
        moreCell.textContent = `... and ${data.length - 11} more entries`;
        moreCell.style.textAlign = 'center';
        moreCell.style.fontStyle = 'italic';
        moreCell.style.color = '#4a5568';
        moreRow.appendChild(moreCell);
        tableBody.appendChild(moreRow);
    }
    
    // Hide upload progress and show data viewer
    document.getElementById('admin-upload-progress').style.display = 'none';
    dataViewer.style.display = 'block';
}

function saveShortlistedData() {
    if (!window.tempShortlistedData) {
        showNotification('No data to save', 'error');
        return;
    }
    
    // Save to main state
    AppState.shortlistedData = [...window.tempShortlistedData];
    AppState.filteredShortlistedData = [...window.tempShortlistedData];
    
    // Update public shortlisted view if it exists
    if (document.getElementById('shortlisted-data-section')) {
        displayShortlistedData(AppState.shortlistedData);
    }
    
    // Show notification banner for students
    AppState.showShortlistedBanner = true;
    
    // Add notification for students
    addNotification({
        type: 'success',
        title: 'New Shortlisted Candidates Available!',
        message: `${window.tempShortlistedData.length} candidates have been shortlisted. Check if you're selected!`,
        action: {
            text: 'View Shortlisted',
            callback: () => showShortlistedView()
        }
    });
    
    // Clear temp data
    window.tempShortlistedData = null;
    
    showNotification('Shortlisted data saved successfully!', 'success');
    closeAdminShortlistedModal();
}

function viewAllShortlisted() {
    if (AppState.shortlistedData.length === 0) {
        showNotification('No shortlisted data available. Please upload some data first.', 'info');
        return;
    }
    
    // Switch to shortlisted view
    showShortlistedView();
}

// Enhanced Student Experience Functions
function checkShortlistedBanner() {
    const banner = document.getElementById('shortlisted-notification');
    if (AppState.showShortlistedBanner && AppState.shortlistedData.length > 0) {
        banner.style.display = 'block';
    } else {
        banner.style.display = 'none';
    }
}

function viewShortlistedFromBanner() {
    showShortlistedView();
    dismissBanner();
}

function dismissBanner() {
    AppState.showShortlistedBanner = false;
    document.getElementById('shortlisted-notification').style.display = 'none';
}

function showCompanyView() {
    document.getElementById('company-view').style.display = 'block';
    loadCompanyView();
}


function loadCompanyView() {
    const companiesGrid = document.getElementById('companies-grid');
    if (!companiesGrid) {
        console.log('companies-grid element not found, skipping company view update');
        return;
    }
    
    // First check if we have job-specific shortlists
    const hasJobShortlists = Object.keys(AppState.jobShortlisted).some(jobId => 
        AppState.jobShortlisted[jobId] && AppState.jobShortlisted[jobId].length > 0
    );
    
    if (!hasJobShortlists && (!AppState.shortlistedData || AppState.shortlistedData.length <= 1)) {
        companiesGrid.innerHTML = `
            <div class="no-companies-message">
                <div class="no-data-icon">
                    <i class="fas fa-building"></i>
                </div>
                <h3>No Companies with Shortlisted Candidates</h3>
                <p>Companies will appear here once the admin uploads shortlisted data.</p>
            </div>
        `;
        return;
    }
    
    companiesGrid.innerHTML = '';
    
    // Create company map from job-specific data if available
    const companiesMap = new Map();
    
    if (hasJobShortlists) {
        // Use job-specific data to create company cards
        Object.keys(AppState.jobShortlisted).forEach(jobId => {
            const shortlistData = AppState.jobShortlisted[jobId];
            const job = AppState.jobs.find(j => j.id == jobId);
            
            if (shortlistData && shortlistData.length > 0 && job) {
                const companyName = job.company;
                const candidateCount = shortlistData.length - 1; // Minus header
                
                if (!companiesMap.has(companyName)) {
                    companiesMap.set(companyName, 0);
                }
                companiesMap.set(companyName, companiesMap.get(companyName) + candidateCount);
            }
        });
    } else if (AppState.shortlistedData.length > 1) {
        // Fallback to global shortlisted data - use filtered data if available
        const dataToUse = AppState.filteredShortlistedData && AppState.filteredShortlistedData.length > 0 ? 
                         AppState.filteredShortlistedData : AppState.shortlistedData;
        
        const headers = dataToUse[0];
        const companyIndex = headers.findIndex(header => 
            header.toLowerCase().includes('company') || 
            header.toLowerCase().includes('organization')
        );
        
        if (companyIndex !== -1) {
            for (let i = 1; i < dataToUse.length; i++) {
                const row = dataToUse[i];
                const company = row[companyIndex] || 'Unknown Company';
                
                if (!companiesMap.has(company)) {
                    companiesMap.set(company, 0);
                }
                companiesMap.set(company, companiesMap.get(company) + 1);
            }
        }
    }
    
    // Create company cards
    if (companiesMap.size > 0) {
        let cardIndex = 0;
        companiesMap.forEach((candidateCount, companyName) => {
            const card = createCompanyCard(companyName, candidateCount);
            companiesGrid.appendChild(card);
            
            // Animate card appearance
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, cardIndex * 100);
            cardIndex++;
        });
    } else {
        companiesGrid.innerHTML = `
            <div class="no-companies-message">
                <div class="no-data-icon">
                    <i class="fas fa-building"></i>
                </div>
                <h3>No Companies Found</h3>
                <p>Unable to identify companies from the shortlisted data.</p>
            </div>
        `;
    }
}

function createCompanyCard(companyName, candidateCount) {
    const card = document.createElement('div');
    card.className = 'company-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.onclick = () => openCompanyModal(companyName);
    
    // Determine company type for icon
    const companyLower = companyName.toLowerCase();
    let icon = 'fas fa-building';
    if (companyLower.includes('tech') || companyLower.includes('software')) {
        icon = 'fas fa-laptop-code';
    } else if (companyLower.includes('bank') || companyLower.includes('finance')) {
        icon = 'fas fa-university';
    } else if (companyLower.includes('consult')) {
        icon = 'fas fa-handshake';
    }
    
    card.innerHTML = `
        <div class="company-card-header">
            <div class="company-card-icon">
                <i class="${icon}"></i>
            </div>
            <div class="company-card-info">
                <h4>${companyName}</h4>
                <p>Click to view selected candidates</p>
            </div>
        </div>
        <div class="company-card-stats">
            <div class="candidate-count">
                <i class="fas fa-users"></i>
                <span>${candidateCount} candidate${candidateCount !== 1 ? 's' : ''}</span>
            </div>
            <div class="view-arrow">
                <i class="fas fa-arrow-right"></i>
            </div>
        </div>
    `;
    
    return card;
}

function openCompanyModal(companyName) {
    // Get candidates for this company from job-specific data
    const companyCandidates = [];
    let headers = [];
    
    // First try to get data from job-specific shortlists
    Object.keys(AppState.jobShortlisted).forEach(jobId => {
        const shortlistData = AppState.jobShortlisted[jobId];
        const job = AppState.jobs.find(j => j.id == jobId);
        
        if (shortlistData && shortlistData.length > 0 && job && job.company === companyName) {
            if (headers.length === 0) {
                headers = [...shortlistData[0]];
                companyCandidates.push(headers);
            }
            
            // Add all candidates from this job
            for (let i = 1; i < shortlistData.length; i++) {
                companyCandidates.push([...shortlistData[i]]);
            }
        }
    });
    
    // Fallback to global shortlisted data if no job-specific data
    if (companyCandidates.length === 0 && AppState.shortlistedData.length > 0) {
        const globalHeaders = AppState.shortlistedData[0];
        const companyIndex = globalHeaders.findIndex(header => 
            header.toLowerCase().includes('company') || 
            header.toLowerCase().includes('organization')
        );
        
        if (companyIndex !== -1) {
            companyCandidates.push(globalHeaders);
            
            for (let i = 1; i < AppState.shortlistedData.length; i++) {
                const row = AppState.shortlistedData[i];
                if (row[companyIndex] === companyName) {
                    companyCandidates.push(row);
                }
            }
        }
    }
    
    AppState.currentCompanyData = companyCandidates;
    
    // Update modal content
    const candidateCount = Math.max(0, companyCandidates.length - 1);
    document.getElementById('company-modal-name').textContent = companyName;
    document.getElementById('company-modal-count').textContent = 
        `${candidateCount} candidate${candidateCount !== 1 ? 's' : ''} shortlisted`;
    
    // Update company icon
    updateCompanyIcon(companyName);
    
    // Add company description
    updateCompanyDescription(companyName, candidateCount);
    
    // Populate company candidates table
    populateCompanyCandidatesTable(companyCandidates);
    
    // Clear search
    document.getElementById('company-candidate-search').value = '';
    
    // Show modal
    document.getElementById('company-shortlisted-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function updateCompanyIcon(companyName) {
    const iconElement = document.getElementById('company-modal-icon');
    const companyLower = companyName.toLowerCase();
    
    let icon = 'fas fa-building';
    if (companyLower.includes('tech') || companyLower.includes('software')) {
        icon = 'fas fa-laptop-code';
    } else if (companyLower.includes('bank') || companyLower.includes('finance')) {
        icon = 'fas fa-university';
    } else if (companyLower.includes('consult')) {
        icon = 'fas fa-handshake';
    } else if (companyLower.includes('health') || companyLower.includes('medical')) {
        icon = 'fas fa-heartbeat';
    } else if (companyLower.includes('education')) {
        icon = 'fas fa-graduation-cap';
    }
    
    iconElement.innerHTML = `<i class="${icon}"></i>`;
}

function updateCompanyDescription(companyName, candidateCount) {
    const descriptionElement = document.getElementById('company-modal-description');
    
    // Try to find the actual job's selection process first
    let actualSelectionProcess = '';
    const companyJobs = AppState.jobs.filter(job => job.company === companyName);
    
    if (companyJobs.length > 0) {
        // Use the selection process from the first job of this company
        actualSelectionProcess = companyJobs[0].selectionProcess || '';
    }
    
    let description = '';
    
    if (actualSelectionProcess && actualSelectionProcess.trim()) {
        // Use the actual job's selection process
        description = `
            <h5>About the Selection Process:</h5>
            <p>${actualSelectionProcess}</p>
        `;
    } else {
        // Fallback to generic descriptions based on company type
        const companyLower = companyName.toLowerCase();
        
        if (companyLower.includes('tech') || companyLower.includes('software')) {
            description = `
                <h5>About the Selection Process:</h5>
                <p>Technology company with focus on software development and innovation.</p>
                <ul>
                    <li>Technical interview rounds</li>
                    <li>Coding assessments</li>
                    <li>System design discussions</li>
                    <li>HR and cultural fit interview</li>
                </ul>
            `;
        } else if (companyLower.includes('bank') || companyLower.includes('finance')) {
            description = `
                <h5>About the Selection Process:</h5>
                <p>Financial services organization with emphasis on analytical and communication skills.</p>
                <ul>
                    <li>Aptitude and reasoning tests</li>
                    <li>Financial knowledge assessment</li>
                    <li>Group discussions</li>
                    <li>Personal interview</li>
                </ul>
            `;
        } else if (companyLower.includes('consult')) {
            description = `
                <h5>About the Selection Process:</h5>
                <p>Consulting firm focused on problem-solving and client interaction skills.</p>
                <ul>
                    <li>Case study analysis</li>
                    <li>Presentation skills assessment</li>
                    <li>Client simulation exercises</li>
                    <li>Partner interview</li>
                </ul>
            `;
        } else {
            description = `
                <h5>About the Selection Process:</h5>
                <p>Multi-stage selection process to identify the best candidates.</p>
                <ul>
                    <li>Written examination</li>
                    <li>Technical/domain assessment</li>
                    <li>Personal interview</li>
                    <li>Final HR discussion</li>
                </ul>
            `;
        }
    }
    
    descriptionElement.innerHTML = description;
}

function populateCompanyCandidatesTable(data) {
    const tableHeader = document.getElementById('company-candidates-header');
    const tableBody = document.getElementById('company-candidates-body');
    
    console.log('populateCompanyCandidatesTable called with data:', data);
    console.log('Data length:', data ? data.length : 0);
    
    // Clear previous data
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    
    if (!data || data.length === 0) {
        console.log('No data provided to populateCompanyCandidatesTable');
        return;
    }
    
    // Create header
    const headerRow = document.createElement('tr');
    data[0].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    tableHeader.appendChild(headerRow);
    
    // Create body rows
    for (let i = 1; i < data.length; i++) {
        const row = document.createElement('tr');
        row.style.opacity = '0';
        row.style.transform = 'translateY(10px)';
        
        console.log('Creating row for data:', data[i]);
        
        data[i].forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell || '';
            row.appendChild(td);
        });
        
        tableBody.appendChild(row);
        
        // Animate row appearance
        setTimeout(() => {
            row.style.transition = 'all 0.3s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, i * 100);
    }
}

function filterCompanyCandidates() {
    const searchTerm = document.getElementById('company-candidate-search').value.toLowerCase().trim();
    
    console.log('filterCompanyCandidates: Search term:', searchTerm);
    console.log('filterCompanyCandidates: Current company data:', AppState.currentCompanyData);
    
    if (!AppState.currentCompanyData || AppState.currentCompanyData.length === 0) {
        console.log('filterCompanyCandidates: No company data available');
        return;
    }
    
    let filteredData;
    if (!searchTerm) {
        filteredData = AppState.currentCompanyData;
        console.log('filterCompanyCandidates: No search term, showing all data');
    } else {
        const filteredRows = AppState.currentCompanyData.slice(1).filter(row => {
            const matches = row.some(cell => {
                if (!cell) return false;
                const cellValue = cell.toString().toLowerCase().trim();
                
                console.log('filterCompanyCandidates: Checking cell:', cellValue, 'against search term:', searchTerm);
                
                // Simple and reliable search: just check if the search term is contained in the cell value
                if (cellValue.includes(searchTerm)) {
                    console.log('filterCompanyCandidates: Match found!', cellValue, 'contains', searchTerm);
                    return true;
                }
                
                return false;
            });
            
            if (matches) {
                console.log('filterCompanyCandidates: Match found in row:', row);
            }
            return matches;
        });
        
        filteredData = [
            AppState.currentCompanyData[0], // Keep headers
            ...filteredRows
        ];
        
        console.log('filterCompanyCandidates: Filtered data length:', filteredData.length);
        console.log('filterCompanyCandidates: Filtered rows:', filteredRows.length);
    }
    
    // Update table with filtered data using the proper function
    console.log('filterCompanyCandidates: Calling populateCompanyCandidatesTable with filtered data');
    populateCompanyCandidatesTable(filteredData);
    
    // Show message if no results
    if (filteredData.length <= 1) {
        const noResultsRow = document.createElement('tr');
        const noResultsCell = document.createElement('td');
        noResultsCell.colSpan = AppState.currentCompanyData[0].length;
        noResultsCell.textContent = 'No candidates found matching your search.';
        noResultsCell.style.textAlign = 'center';
        noResultsCell.style.fontStyle = 'italic';
        noResultsCell.style.color = '#4a5568';
        noResultsCell.style.padding = '2rem';
        noResultsRow.appendChild(noResultsCell);
        tableBody.appendChild(noResultsRow);
    }
}

function closeCompanyShortlistedModal() {
    document.getElementById('company-shortlisted-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
    AppState.currentCompanyData = [];
}

// Notification System Functions
function loadNotifications() {
    const notificationsList = document.getElementById('notifications-list');
    
    // NO AUTOMATIC SAMPLE NOTIFICATIONS - Only show real notifications
    displayNotifications();
}

async function addNotification(notification) {
    // Check if notification with same title already exists (prevent duplicates)
    const existingNotification = AppState.notifications.find(n => 
        n.title === notification.title && 
        n.message === notification.message
    );
    
    if (existingNotification) {
        console.log('Notification already exists, skipping duplicate');
        return;
    }
    
    const newNotification = {
        id: Date.now(),
        type: notification.type || 'info',
        title: notification.title,
        message: notification.message,
        timestamp: Date.now(), // Use timestamp for Firebase compatibility
        time: new Date().toISOString(), // Keep time for display
        read: false,
        action: notification.action || null,
        realtime: true // Mark as real-time notification
    };
    
    console.log('Adding new notification:', newNotification.id, newNotification.title);
    
    AppState.notifications.unshift(newNotification);
    
    // Keep only newest 20 notifications (increased for better history)
    if (AppState.notifications.length > 20) {
        AppState.notifications = AppState.notifications.slice(0, 20);
    }
    
    try {
        // Save to cloud (this will trigger real-time updates)
        await saveDataToStorage();
        
        // Send push notification if supported
        await sendPushNotification(newNotification);
        
        // Also show the notification immediately for the current user
        handleRealtimeNotification(newNotification);
        
    } catch (error) {
        console.error('Error saving notification:', error);
    }
    
    displayNotifications();
}

// Handle real-time notifications with enhanced alerts
function handleRealtimeNotification(notification) {
    console.log('🔔 Real-time notification received:', notification);
    
    // Show enhanced toast notification
    showRealtimeNotification(notification);
    
    // Update notification badge/counter
    updateNotificationBadge();
    
    // Play notification sound if enabled
    playNotificationSound();
    
    // Show browser notification if permission granted
    showBrowserNotification(notification);
    
    // Update notification displays
    if (document.getElementById('notifications-list')) {
        displayNotifications();
    }
    if (document.getElementById('admin-notifications-list')) {
        loadAdminNotifications();
    }
    if (document.getElementById('student-notifications-list')) {
        loadStudentNotifications();
    }
}

// Enhanced real-time notification display
function showRealtimeNotification(notification) {
    const notificationElement = document.createElement('div');
    notificationElement.className = `realtime-notification ${notification.type}`;
    notificationElement.innerHTML = `
        <div class="realtime-notification-content">
            <div class="notification-header">
                <div class="notification-icon ${notification.type}">
                    <i class="fas fa-${getNotificationIcon(notification.type)}"></i>
                </div>
                <div class="notification-info">
                    <h4>${notification.title}</h4>
                    <p>${notification.message}</p>
                </div>
                <button class="notification-close" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="notification-time">
                <i class="fas fa-clock"></i>
                <span>Just now</span>
            </div>
            ${notification.action ? `
                <div class="notification-action">
                    <button onclick="executeNotificationAction(${notification.id})" class="action-btn">
                        <i class="fas fa-arrow-right"></i>
                        ${notification.action.text}
                    </button>
                </div>
            ` : ''}
        </div>
    `;
    
    // Calculate position for stacking from top - new notifications go to the top
    const existingNotifications = document.querySelectorAll('.realtime-notification');
    
    // Move existing notifications down first with smooth transition
    existingNotifications.forEach((existing, index) => {
        const newTopOffset = 20 + ((index + 1) * 10); // Push existing ones down
        existing.style.transition = 'top 0.3s ease';
        existing.style.top = `${newTopOffset}px`;
    });
    
    // New notification goes to the top
    notificationElement.style.top = '20px';
    notificationElement.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    // Add to page
    document.body.appendChild(notificationElement);
    
    // Animate in from top
    setTimeout(() => {
        notificationElement.classList.add('show');
    }, 100);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        notificationElement.classList.remove('show');
        setTimeout(() => {
            if (notificationElement.parentElement) {
                notificationElement.remove();
                // Reposition remaining notifications
                repositionNotifications();
            }
        }, 300);
    }, 8000);
}

// Reposition notifications after one is removed
function repositionNotifications() {
    const notifications = document.querySelectorAll('.realtime-notification');
    notifications.forEach((notification, index) => {
        const topOffset = 20 + (index * 10);
        notification.style.transition = 'top 0.3s ease';
        notification.style.top = `${topOffset}px`;
    });
}

// Update notification badge/counter
function updateNotificationBadge() {
    const unreadCount = AppState.notifications.filter(n => !n.read).length;
    
    // Update notification badge in navigation
    const badge = document.getElementById('nav-notification-badge');
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
    
    // Update page title with notification count
    if (unreadCount > 0) {
        document.title = `(${unreadCount}) DSI Placement Portal`;
    } else {
        document.title = 'DSI Placement Portal';
    }
}

// Toggle notification settings
function toggleNotificationSettings() {
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            showNotification('Notifications are already enabled!', 'success');
        } else if (Notification.permission === 'denied') {
            showNotification('Notifications are blocked. Please enable them in browser settings.', 'warning');
        } else {
            requestNotificationPermission();
        }
    } else {
        showNotification('Notifications are not supported in this browser.', 'warning');
    }
}

// Request notification permission
async function requestNotificationPermission() {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            showNotification('✅ Notifications enabled! You will receive real-time updates.', 'success');
            setupPushNotifications();
        } else {
            showNotification('❌ Notifications blocked. You can enable them later in browser settings.', 'warning');
        }
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        showNotification('Error enabling notifications. Please try again.', 'error');
    }
}

// Setup push notifications
async function setupPushNotifications() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
            const registration = await navigator.serviceWorker.ready;
            console.log('Service Worker ready for push notifications');
        } catch (error) {
            console.error('Error setting up push notifications:', error);
        }
    }
}

// Play notification sound
function playNotificationSound() {
    try {
        // Create audio context for notification sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
        console.log('Could not play notification sound:', error);
    }
}

// Show browser notification
async function showBrowserNotification(notification) {
    if ('Notification' in window && Notification.permission === 'granted') {
        try {
            const browserNotification = new Notification(notification.title, {
                body: notification.message,
                icon: './DSi.png',
                badge: './DSi.png',
                tag: 'dsi-notification',
                requireInteraction: true,
                silent: false,
                vibrate: [200, 100, 200],
                data: {
                    notificationId: notification.id,
                    url: window.location.href
                }
            });
            
            // Handle notification click
            browserNotification.onclick = function() {
                window.focus();
                browserNotification.close();
                
                // Execute action if available
                if (notification.action) {
                    executeNotificationAction(notification.id);
                }
            };
            
            // Auto-close after 10 seconds
            setTimeout(() => {
                browserNotification.close();
            }, 10000);
            
        } catch (error) {
            console.log('Could not show browser notification:', error);
        }
    }
}

// Send push notification via service worker
async function sendPushNotification(notification) {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
            const registration = await navigator.serviceWorker.ready;
            
            if (registration.active) {
                registration.active.postMessage({
                    type: 'PUSH_NOTIFICATION',
                    notification: {
                        title: notification.title,
                        body: notification.message,
                        icon: './DSi.png',
                        badge: './DSi.png',
                        tag: 'dsi-realtime',
                        data: {
                            notificationId: notification.id,
                            type: notification.type
                        }
                    }
                });
            }
        } catch (error) {
            console.log('Could not send push notification:', error);
        }
    }
}

function displayNotifications() {
    const notificationsList = document.getElementById('notifications-list');
    notificationsList.innerHTML = '';
    
    if (AppState.notifications.length === 0) {
        notificationsList.innerHTML = `
            <div class="notification-item">
                <div class="notification-icon info">
                    <i class="fas fa-info-circle"></i>
                </div>
                <div class="notification-content">
                    <h4>No notifications yet</h4>
                    <p>You'll see important updates and announcements here.</p>
                </div>
            </div>
        `;
        return;
    }
    
    // Display notifications (newest first - already in correct order due to unshift)
    AppState.notifications.forEach((notification, index) => {
        const item = document.createElement('div');
        item.className = `notification-item ${!notification.read ? 'unread' : ''}`;
        item.style.opacity = '0';
        item.style.transform = 'translateY(10px)';
        
        const timeAgo = getTimeAgo(notification.timestamp || notification.time);
        
        item.innerHTML = `
            <div class="notification-icon ${notification.type}">
                <i class="fas fa-${getNotificationIcon(notification.type)}"></i>
            </div>
            <div class="notification-content">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
                <div class="notification-time">${timeAgo}</div>
                ${notification.action ? `
                    <div class="notification-action">
                        <button class="notification-btn" onclick="executeNotificationAction('${notification.id}')">
                            ${notification.action.text}
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
        
        // Mark as read when clicked
        item.onclick = () => markNotificationRead(notification.id);
        
        notificationsList.appendChild(item);
        
        // Animate appearance
        setTimeout(() => {
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'warning': return 'exclamation-triangle';
        case 'info': return 'info-circle';
        default: return 'bell';
    }
}

function getTimeAgo(timestamp) {
    if (!timestamp) return 'Just now';
    
    const now = new Date();
    let time;
    
    // Handle different timestamp formats
    if (typeof timestamp === 'string') {
        time = new Date(timestamp);
    } else if (typeof timestamp === 'number') {
        time = new Date(timestamp);
    } else {
        time = new Date();
    }
    
    // Check if the date is valid
    if (isNaN(time.getTime())) {
        return 'Just now';
    }
    
    const diffInMs = now - time;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins} minute${diffInMins !== 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
}

async function markNotificationRead(notificationId) {
    const notification = AppState.notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
        
        try {
            // Save to both localStorage and Firebase
            saveDataToStorage();
            
            if (typeof database !== 'undefined') {
                await saveDataToFirebase({
                    jobs: AppState.jobs,
                    shortlistedData: AppState.shortlistedData,
                    jobShortlisted: AppState.jobShortlisted,
                    notifications: AppState.notifications,
                    admins: AppState.admins
                });
            }
        } catch (error) {
            console.error('Error saving notification read status:', error);
        }
        
        displayNotifications();
    }
}

async function markAllNotificationsRead() {
    AppState.notifications.forEach(notification => {
        notification.read = true;
    });
    
    try {
        // Save to both localStorage and Firebase
        saveDataToStorage();
        
        if (typeof database !== 'undefined') {
            await saveDataToFirebase({
                jobs: AppState.jobs,
                shortlistedData: AppState.shortlistedData,
                jobShortlisted: AppState.jobShortlisted,
                notifications: AppState.notifications,
                admins: AppState.admins
            });
        }
    } catch (error) {
        console.error('Error saving notification read status:', error);
    }
    
    displayNotifications();
    showNotification('All notifications marked as read', 'success');
}

function executeNotificationAction(notificationId) {
    // Prevent event bubbling
    if (event) {
        event.stopPropagation();
    }
    
    // Convert notificationId to number for comparison
    const id = parseInt(notificationId);
    
    const notification = AppState.notifications.find(n => n.id === id);
    
    if (notification && notification.action && notification.action.callback) {
        try {
            notification.action.callback();
            markNotificationRead(id);
        } catch (error) {
            console.error('Error executing notification action:', error);
            showNotification('Error executing action. Please try again.', 'error');
        }
    } else {
        // Try to restore callback if it's missing
        if (notification && notification.action && notification.action.text) {
            // Restore callback based on action text
            if (notification.action.text.toLowerCase().includes('shortlisted') || 
                notification.title.toLowerCase().includes('shortlisted') ||
                notification.message.toLowerCase().includes('shortlisted')) {
                showShortlistedView();
                markNotificationRead(id);
            } else if (notification.action.text.toLowerCase().includes('view details') || 
                      notification.action.text.toLowerCase().includes('details')) {
                // Try to find job by notification content
                const job = AppState.jobs.find(j => 
                    notification.title.includes(j.company) || 
                    notification.message.includes(j.company) ||
                    notification.title.includes(j.title) ||
                    notification.message.includes(j.title)
                );
                if (job) {
                    showJobDetail(job.id);
                    markNotificationRead(id);
                } else {
                    showNotification('Job details not found', 'error');
                }
            } else {
                showNotification('Action executed', 'info');
                markNotificationRead(id);
            }
        } else {
            showNotification('Action not available for this notification.', 'error');
        }
    }
}

// Job-Specific Shortlist Functions
function showJobShortlistUpload(jobId) {
    const job = AppState.jobs.find(j => j.id === jobId);
    if (!job) {
        showNotification('Job not found. Please try again.', 'error');
        return;
    }
    
    AppState.currentJobId = jobId;
    
    // Store job ID in modal data attribute for persistence
    const modal = document.getElementById('job-shortlist-modal');
    modal.setAttribute('data-job-id', jobId);
    
    // Update modal content
    document.getElementById('job-shortlist-title').textContent = 
        AppState.jobShortlisted[jobId] ? 'Update Shortlisted Candidates' : 'Upload Shortlisted Candidates';
    document.getElementById('job-shortlist-subtitle').textContent = `${job.company} • ${job.title}`;
    
    // Reset modal state
    document.getElementById('job-shortlist-data-viewer').style.display = 'none';
    document.getElementById('job-shortlist-upload-progress').style.display = 'none';
    document.getElementById('job-shortlist-file-input').value = '';
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeJobShortlistModal() {
    document.getElementById('job-shortlist-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
    AppState.currentJobId = null;
    
    // Reset form but keep data-job-id attribute for persistence
    document.getElementById('job-shortlist-file-input').value = '';
    document.getElementById('job-shortlist-data-viewer').style.display = 'none';
    document.getElementById('job-shortlist-upload-progress').style.display = 'none';
}

function handleJobShortlistDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('job-shortlist-drop-zone').classList.remove('drag-over');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        processJobShortlistFile(files[0]);
    }
}

function handleJobShortlistFileSelect(event) {
    const files = event.target.files;
    if (files.length > 0) {
        processJobShortlistFile(files[0]);
    }
}

function processJobShortlistFile(file) {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.csv')) {
        showNotification('Please select an XLSX or CSV file', 'error');
        return;
    }
    
    // Show upload progress
    document.getElementById('job-shortlist-upload-progress').style.display = 'block';
    const progressFill = document.getElementById('job-shortlist-progress-fill');
    const progressText = document.getElementById('job-shortlist-progress-text');
    
    // Animate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            progressText.textContent = 'Processing...';
            setTimeout(() => {
                readJobShortlistFile(file);
            }, 500);
        }
        progressFill.style.width = progress + '%';
        progressText.textContent = `Uploading... ${Math.floor(progress)}%`;
    }, 100);
}

function readJobShortlistFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            let data;
            
            if (file.name.endsWith('.csv')) {
                data = parseCSV(e.target.result);
            } else {
                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            }
            
            displayJobShortlistPreview(data);
            showNotification('File processed successfully! Review and save.', 'success');
            
        } catch (error) {
            showNotification('Error processing file: ' + error.message, 'error');
        }
    };
    
    if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
    } else {
        reader.readAsBinaryString(file);
    }
}

function displayJobShortlistPreview(data) {
    if (!data || data.length === 0) {
        showNotification('No data found in file', 'error');
        return;
    }
    
    // Store temporarily for saving
    window.tempJobShortlistData = data;
    
    const dataViewer = document.getElementById('job-shortlist-data-viewer');
    const tableHeader = document.getElementById('job-shortlist-table-header');
    const tableBody = document.getElementById('job-shortlist-table-body');
    
    // Clear previous data
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    
    // Create header
    const headerRow = document.createElement('tr');
    data[0].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    tableHeader.appendChild(headerRow);
    
    // Create body rows (show first 10 for preview)
    const previewRows = Math.min(data.length - 1, 10);
    for (let i = 1; i <= previewRows; i++) {
        const row = document.createElement('tr');
        
        data[i].forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell || '';
            row.appendChild(td);
        });
        
        tableBody.appendChild(row);
    }
    
    if (data.length > 11) {
        const moreRow = document.createElement('tr');
        const moreCell = document.createElement('td');
        moreCell.colSpan = data[0].length;
        moreCell.textContent = `... and ${data.length - 11} more entries`;
        moreCell.style.textAlign = 'center';
        moreCell.style.fontStyle = 'italic';
        moreCell.style.color = '#4a5568';
        moreRow.appendChild(moreCell);
        tableBody.appendChild(moreRow);
    }
    
    // Hide upload progress and show data viewer
    document.getElementById('job-shortlist-upload-progress').style.display = 'none';
    dataViewer.style.display = 'block';
}

function saveJobShortlistData() {
    try {
        // Validate data exists
        if (!window.tempJobShortlistData) {
            showNotification('Please upload a file first', 'error');
            return;
        }
        
        // Get job ID from modal data attribute or AppState
        let jobId = AppState.currentJobId;
        
        // If currentJobId is null, try to get it from modal data attribute
        if (!jobId) {
            const modal = document.getElementById('job-shortlist-modal');
            const modalJobId = modal.getAttribute('data-job-id');
            if (modalJobId) {
                jobId = parseInt(modalJobId);
            }
        }
        
        if (!jobId) {
            showNotification('Please select a job first', 'error');
            return;
        }
        
        // Find job
        jobId = parseInt(jobId);
        const job = AppState.jobs.find(j => j.id === jobId);
        
        if (!job) {
            showNotification('Job not found. Please try again.', 'error');
            return;
        }
        
        // Save data
        if (!AppState.jobShortlisted) {
            AppState.jobShortlisted = {};
        }
        
        AppState.jobShortlisted[jobId] = window.tempJobShortlistData.slice();
        
        // Update global data
        updateGlobalShortlistedData();
        
        // Add notification for students
        addNotification({
            type: 'success',
            title: `${job.company} Shortlist Updated!`,
            message: `${window.tempJobShortlistData.length - 1} candidates shortlisted for ${job.title} position.`,
            action: {
                text: 'View Shortlist',
                callback: () => showShortlistedView()
            }
        });
        
        // Clear temp data
        window.tempJobShortlistData = null;
        
        // Save to localStorage
        saveDataToStorage();
        
        // Reload admin interface (only if on admin page)
        if (document.getElementById('admin-job-list')) {
            loadAdminJobList();
        }
        
        // Show success
        showNotification(`Successfully saved ${AppState.jobShortlisted[jobId].length - 1} shortlisted candidates!`, 'success');
        
        // Update UI immediately
        loadShortlistedCandidatesView();
        loadAdminJobList();
        
        // Close modal
        closeJobShortlistModal();
        
    } catch (error) {
        console.error('Save error:', error);
        showNotification('Error saving data: ' + error.message, 'error');
    }
}

function updateGlobalShortlistedData() {
    // Combine all job shortlists into global shortlisted data
    const allShortlisted = [];
    let headers = [];
    
    // Check if we have any job-specific shortlisted data
    const hasJobShortlists = Object.keys(AppState.jobShortlisted).some(jobId => 
        AppState.jobShortlisted[jobId] && AppState.jobShortlisted[jobId].length > 0
    );
    
    if (hasJobShortlists) {
        Object.keys(AppState.jobShortlisted).forEach(jobId => {
            const shortlistData = AppState.jobShortlisted[jobId];
            if (shortlistData && shortlistData.length > 0) {
                if (headers.length === 0) {
                    // Add company column to headers if not exists
                    headers = [...shortlistData[0]];
                    if (!headers.some(h => h.toLowerCase().includes('company'))) {
                        headers.unshift('Company');
                    }
                    allShortlisted.push(headers);
                }
                
                const job = AppState.jobs.find(j => j.id == jobId);
                const companyName = job ? job.company : 'Unknown Company';
                
                // Add data rows with company name
                for (let i = 1; i < shortlistData.length; i++) {
                    const row = [...shortlistData[i]];
                    if (!headers.some(h => h.toLowerCase().includes('company'))) {
                        row.unshift(companyName);
                    }
                    allShortlisted.push(row);
                }
            }
        });
        
        AppState.shortlistedData = allShortlisted;
        AppState.filteredShortlistedData = allShortlisted;
        AppState.showShortlistedBanner = true;
    }
    
    // Update shortlisted view if needed
    if (allShortlisted.length > 0) {
        // Update company view if it's visible
        const companyView = document.getElementById('company-view');
        if (companyView && companyView.style.display !== 'none') {
            loadCompanyView();
        }
        // Note: populateTableView function doesn't exist, so we skip this
        // populateTableView(allShortlisted);
    }
}

function viewJobShortlist(jobId) {
    const job = AppState.jobs.find(j => j.id === jobId);
    const shortlistData = AppState.jobShortlisted[jobId];
    
    if (!job || !shortlistData) {
        showNotification('No shortlist data found for this job', 'error');
        return;
    }
    
    AppState.currentJobId = jobId;
    
    // Update modal content
    document.getElementById('job-shortlist-view-title').textContent = 'Shortlisted Candidates';
    document.getElementById('job-shortlist-view-subtitle').textContent = `${job.company} • ${job.title}`;
    document.getElementById('job-shortlist-view-count').textContent = 
        `${shortlistData.length - 1} candidate${shortlistData.length !== 2 ? 's' : ''} shortlisted`;
    
    // Populate table
    populateJobShortlistViewTable(shortlistData);
    
    // Clear search
    document.getElementById('job-shortlist-search').value = '';
    
    // Show modal
    document.getElementById('job-shortlist-view-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function populateJobShortlistViewTable(data) {
    const tableHeader = document.getElementById('job-shortlist-view-header-table');
    const tableBody = document.getElementById('job-shortlist-view-body');
    
    // Clear previous data
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    
    // Create header
    const headerRow = document.createElement('tr');
    data[0].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    tableHeader.appendChild(headerRow);
    
    // Create body rows
    for (let i = 1; i < data.length; i++) {
        const row = document.createElement('tr');
        
        data[i].forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell || '';
            row.appendChild(td);
        });
        
        tableBody.appendChild(row);
        
        // Animate row appearance
        setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, i * 50);
    }
}

function filterJobShortlistCandidates() {
    const searchTerm = document.getElementById('job-shortlist-search').value.toLowerCase().trim();
    const originalData = AppState.jobShortlisted[AppState.currentJobId];
    
    if (!originalData) return;
    
    let filteredData;
    if (!searchTerm) {
        filteredData = originalData;
    } else {
        filteredData = [
            originalData[0], // Keep headers
            ...originalData.slice(1).filter(row => {
                return row.some(cell => {
                    if (!cell) return false;
                    const cellValue = cell.toString().toLowerCase().trim();
                    // Check for exact match, contains match, or partial word match
                    return cellValue === searchTerm || 
                           cellValue.includes(searchTerm) ||
                           cellValue.split(/\s+/).some(word => word.includes(searchTerm));
                });
            })
        ];
    }
    
    populateJobShortlistViewTable(filteredData);
}

function exportJobShortlistData() {
    const shortlistData = AppState.jobShortlisted[AppState.currentJobId];
    const job = AppState.jobs.find(j => j.id === AppState.currentJobId);
    
    if (!shortlistData || !job) {
        showNotification('No data to export', 'error');
        return;
    }
    
    // Create CSV content
    const csvContent = shortlistData.map(row => {
        return row.map(cell => {
            const cellStr = String(cell || '');
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                return '"' + cellStr.replace(/"/g, '""') + '"';
            }
            return cellStr;
        }).join(',');
    }).join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${job.company}_${job.title}_shortlisted.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Shortlist data exported successfully!', 'success');
}

function deleteJobShortlistData() {
    if (!AppState.currentJobId) return;
    
    const job = AppState.jobs.find(j => j.id === AppState.currentJobId);
    if (!job) return;
    
    if (confirm(`Are you sure you want to delete the shortlist for ${job.company} - ${job.title}?`)) {
        delete AppState.jobShortlisted[AppState.currentJobId];
        
        // Update global shortlisted data
        updateGlobalShortlistedData();
        
        // Reload admin job list
        loadAdminJobList();
        
        showNotification('Shortlist deleted successfully!', 'success');
        closeJobShortlistViewModal();
    }
}

function closeJobShortlistViewModal() {
    document.getElementById('job-shortlist-view-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
    AppState.currentJobId = null;
}

// Admin Notifications Functions
function loadAdminNotifications() {
    const adminNotificationsList = document.getElementById('admin-notifications-list');
    
    if (AppState.notifications.length === 0) {
        adminNotificationsList.innerHTML = `
            <div class="admin-notification-item">
                <div class="admin-notification-icon info">
                    <i class="fas fa-info-circle"></i>
                </div>
                <div class="admin-notification-content">
                    <h5>No notifications posted yet</h5>
                    <p>Use the "Post New Notification" button to add announcements for students.</p>
                </div>
            </div>
        `;
        return;
    }
    
    // Show recent 5 notifications (newest first - already in correct order due to unshift)
    const recentNotifications = AppState.notifications.slice(0, 5);
    adminNotificationsList.innerHTML = '';
    
    recentNotifications.forEach(notification => {
        const item = document.createElement('div');
        item.className = 'admin-notification-item';
        
        const timeAgo = getTimeAgo(notification.time);
        
        item.innerHTML = `
            <div class="admin-notification-icon ${notification.type}">
                <i class="fas fa-${getNotificationIcon(notification.type)}"></i>
            </div>
            <div class="admin-notification-content">
                <h5>${notification.title}</h5>
                <p>${notification.message}</p>
                <div class="admin-notification-time">${timeAgo}</div>
            </div>
        `;
        
        adminNotificationsList.appendChild(item);
    });
}

function showAddNotificationModal() {
    document.getElementById('add-notification-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add event listener for action checkbox
    document.getElementById('notification-action-enabled').onchange = function() {
        const actionSection = document.getElementById('notification-action-section');
        actionSection.style.display = this.checked ? 'block' : 'none';
    };
}

function showEditNotificationModal() {
    // Add event listener for action checkbox
    document.getElementById('edit-notification-action-enabled').onchange = function() {
        const actionSection = document.getElementById('edit-notification-action-section');
        actionSection.style.display = this.checked ? 'block' : 'none';
    };
}

function closeAddNotificationModal() {
    document.getElementById('add-notification-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
    document.getElementById('notification-form').reset();
    document.getElementById('notification-action-section').style.display = 'none';
}

function handleNotificationSubmit(event) {
    event.preventDefault();
    
    const type = document.getElementById('notification-type').value;
    const title = document.getElementById('notification-title').value;
    const message = document.getElementById('notification-message').value;
    const actionEnabled = document.getElementById('notification-action-enabled').checked;
    const actionText = document.getElementById('notification-action-text').value;
    const actionLink = document.getElementById('notification-action-link').value;
    
    const notificationData = {
        type: type,
        title: title,
        message: message
    };
    
    if (actionEnabled && actionText) {
        notificationData.action = {
            text: actionText,
            link: actionLink || null,
            callback: actionLink ? 
                () => window.open(actionLink, '_blank') : 
                () => showNotification('Action clicked!', 'info')
        };
    }
    
    addNotification(notificationData);
    showNotification('Notification posted successfully!', 'success');
    
    closeAddNotificationModal();
    loadAdminNotifications();
}

// All Notifications Management Functions
function showAllNotificationsModal() {
    document.getElementById('all-notifications-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
    loadAllNotifications();
}

function closeAllNotificationsModal() {
    document.getElementById('all-notifications-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function loadAllNotifications() {
    const allNotificationsList = document.getElementById('all-notifications-list');
    
    if (AppState.notifications.length === 0) {
        allNotificationsList.innerHTML = `
            <div class="admin-notification-item-full">
                <div class="admin-notification-content-full">
                    <h5>No notifications posted yet</h5>
                    <p>Use the "Post New Notification" button to add announcements for students.</p>
                </div>
            </div>
        `;
        return;
    }
    
    allNotificationsList.innerHTML = '';
    
    // Display notifications (newest first - already in correct order due to unshift)
    AppState.notifications.forEach(notification => {
        const item = document.createElement('div');
        item.className = 'admin-notification-item-full';
        
        const timeAgo = getTimeAgo(notification.time);
        const typeBadge = getNotificationTypeBadge(notification.type);
        
        item.innerHTML = `
            <div class="admin-notification-icon ${notification.type}">
                <i class="fas fa-${getNotificationIcon(notification.type)}"></i>
            </div>
            <div class="admin-notification-content-full">
                <div class="notification-type-badge ${notification.type}">${typeBadge}</div>
                <h5>${notification.title}</h5>
                <p>${notification.message}</p>
                <div class="admin-notification-time-full">${timeAgo}</div>
            </div>
            <div class="admin-notification-actions">
                <button class="notification-action-btn edit-notification-btn" onclick="editNotification('${notification.id}')" title="Edit Notification">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="notification-action-btn delete-notification-btn" onclick="deleteNotification('${notification.id}')" title="Delete Notification">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        allNotificationsList.appendChild(item);
    });
}

function getNotificationTypeBadge(type) {
    switch(type) {
        case 'info': return 'Information';
        case 'success': return 'Success';
        case 'warning': return 'Warning';
        default: return 'Info';
    }
}


function closeEditNotificationModal() {
    document.getElementById('edit-notification-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function handleEditNotificationSubmit(event) {
    event.preventDefault();
    
    const notificationId = parseInt(document.getElementById('edit-notification-id').value);
    const type = document.getElementById('edit-notification-type').value;
    const title = document.getElementById('edit-notification-title').value;
    const message = document.getElementById('edit-notification-message').value;
    const actionEnabled = document.getElementById('edit-notification-action-enabled').checked;
    const actionText = document.getElementById('edit-notification-action-text').value;
    const actionLink = document.getElementById('edit-notification-action-link').value;
    
    // Find and update the notification
    const notificationIndex = AppState.notifications.findIndex(n => n.id === notificationId);
    if (notificationIndex === -1) {
        showNotification('Notification not found', 'error');
        return;
    }
    
    const updatedNotification = {
        ...AppState.notifications[notificationIndex],
        type: type,
        title: title,
        message: message
    };
    
    if (actionEnabled && actionText) {
        updatedNotification.action = {
            text: actionText,
            link: actionLink || null,
            callback: actionLink ? 
                () => window.open(actionLink, '_blank') : 
                () => showNotification('Action clicked!', 'info')
        };
    } else {
        updatedNotification.action = null;
    }
    
    AppState.notifications[notificationIndex] = updatedNotification;
    
    // Save to storage
    saveDataToStorage();
    
    showNotification('Notification updated successfully!', 'success');
    
    closeEditNotificationModal();
    loadAdminNotifications();
    loadAllNotifications();
    displayNotifications(); // Update student view
}



// Check and update job statuses based on deadlines
function checkAndUpdateJobStatuses() {
    const currentTime = new Date();
    let updatedJobs = false;
    
    AppState.jobs.forEach(job => {
        const deadline = new Date(job.deadline);
        
        // If deadline has passed and job is still "Open", change to "Interviewing"
        if (deadline < currentTime && job.status === 'Open') {
            job.status = 'Interviewing';
            updatedJobs = true;
            console.log(`Job "${job.title}" at ${job.company} automatically moved to Interviewing status (deadline passed)`);
        }
    });
    
    // Save changes if any jobs were updated
    if (updatedJobs) {
        saveDataToStorage();
        showNotification('Some jobs have been automatically moved to Interviewing status (deadlines passed)', 'info');
        
        // Update admin dashboard if it's currently displayed
        if (document.getElementById('admin-dashboard').style.display !== 'none') {
            loadAdminJobList();
        }
        
        // Update student dashboard if it's currently displayed
        if (document.getElementById('student-dashboard').style.display !== 'none') {
            displayJobs();
        }
    }
}

// Delete shortlisted candidates for a specific job
function deleteJobShortlisted(jobId) {
    const job = AppState.jobs.find(j => j.id === jobId);
    if (!job) {
        showNotification('Job not found', 'error');
        return;
    }
    
    const shortlistedCount = AppState.jobShortlisted[jobId] ? AppState.jobShortlisted[jobId].length - 1 : 0;
    
    if (shortlistedCount === 0) {
        showNotification('No shortlisted candidates to delete for this job', 'info');
        return;
    }
    
    const confirmMessage = `Are you sure you want to delete all shortlisted candidates for "${job.title}" at ${job.company}?\n\nThis will remove ${shortlistedCount} shortlisted candidates.\n\nThis action cannot be undone!`;
    
    if (!confirm(confirmMessage)) {
        return;
    }
    
    // Remove shortlisted candidates for this job from the main shortlisted data
    if (AppState.jobShortlisted[jobId]) {
        const jobShortlistedIds = AppState.jobShortlisted[jobId].slice(1); // Skip header row
        
        // Remove candidates from main shortlisted data
        AppState.shortlistedData = AppState.shortlistedData.filter(candidate => 
            !jobShortlistedIds.includes(candidate.id)
        );
        
        // Clear the job shortlisted data
        delete AppState.jobShortlisted[jobId];
    }
    
    // Save to storage
    saveDataToStorage();
    
    showNotification(`Successfully deleted ${shortlistedCount} shortlisted candidates for ${job.company}`, 'success');
    
    // Update admin dashboard
    loadAdminJobList();
    
    // Update student view if they're viewing shortlisted data
    if (document.getElementById('shortlisted-view').style.display !== 'none') {
        displayShortlistedData();
    }
}

// Company Modal Functions
function viewFullCompanyList() {
    const companyName = document.getElementById('company-modal-name').textContent;
    
    // Get all shortlisted data for this company
    const allCompanyData = [];
    let headers = [];
    
    Object.keys(AppState.jobShortlisted).forEach(jobId => {
        const shortlistData = AppState.jobShortlisted[jobId];
        const job = AppState.jobs.find(j => j.id == jobId);
        
        if (shortlistData && shortlistData.length > 0 && job && job.company === companyName) {
            if (headers.length === 0) {
                headers = [...shortlistData[0]];
                allCompanyData.push(headers);
            }
            
            // Add all candidates from this job
            for (let i = 1; i < shortlistData.length; i++) {
                allCompanyData.push([...shortlistData[i]]);
            }
        }
    });
    
    AppState.currentCompanyFullData = allCompanyData;
    
    // Update full list modal
    document.getElementById('full-list-company-name').textContent = companyName;
    populateFullCompanyListTable(allCompanyData);
    
    // Close company modal and show full list modal
    document.getElementById('company-shortlisted-modal').classList.remove('active');
    document.getElementById('full-company-list-modal').classList.add('active');
}

function populateFullCompanyListTable(data) {
    const tableHeader = document.getElementById('full-company-list-header');
    const tableBody = document.getElementById('full-company-list-body');
    
    // Clear previous data
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    
    if (!data || data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="100%" style="text-align: center; padding: 2rem; color: #4a5568;">
                    No data available
                </td>
            </tr>
        `;
        return;
    }
    
    // Create header
    const headerRow = document.createElement('tr');
    data[0].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    tableHeader.appendChild(headerRow);
    
    // Create body rows
    for (let i = 1; i < data.length; i++) {
        const row = document.createElement('tr');
        
        data[i].forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell || '';
            row.appendChild(td);
        });
        
        tableBody.appendChild(row);
    }
}

function filterFullCompanyList() {
    const searchTerm = document.getElementById('full-list-search').value.toLowerCase().trim();
    const originalData = AppState.currentCompanyFullData;
    
    if (!originalData) return;
    
    let filteredData;
    if (!searchTerm) {
        filteredData = originalData;
    } else {
        filteredData = [
            originalData[0], // Keep headers
            ...originalData.slice(1).filter(row => {
                return row.some(cell => {
                    if (!cell) return false;
                    const cellValue = cell.toString().toLowerCase().trim();
                    // Check for exact match, contains match, or partial word match
                    return cellValue === searchTerm || 
                           cellValue.includes(searchTerm) ||
                           cellValue.split(/\s+/).some(word => word.includes(searchTerm));
                });
            })
        ];
    }
    
    populateFullCompanyListTable(filteredData);
}

function exportFullCompanyList() {
    const companyName = document.getElementById('full-list-company-name').textContent;
    const data = AppState.currentCompanyFullData;
    
    if (!data || data.length === 0) {
        showNotification('No data to export', 'error');
        return;
    }
    
    // Create CSV content
    const csvContent = data.map(row => {
        return row.map(cell => {
            const cellStr = String(cell || '');
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                return '"' + cellStr.replace(/"/g, '""') + '"';
            }
            return cellStr;
        }).join(',');
    }).join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${companyName}_all_shortlisted.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Full company list exported successfully!', 'success');
}

function closeFullCompanyListModal() {
    document.getElementById('full-company-list-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
    AppState.currentCompanyFullData = null;
}

// Admin Management Functions
function loadAdminList() {
    const adminList = document.getElementById('admin-list');
    if (!adminList) {
        console.log('admin-list element not found, skipping admin list load');
        return;
    }
    
    adminList.innerHTML = '';
    
    // Add default admin
    const defaultAdmin = {
        id: 'default',
        username: 'himu',
        email: 'admin@dsi.com',
        isDefault: true,
        createdDate: new Date().toISOString()
    };
    
    const allAdmins = [defaultAdmin, ...AppState.admins];
    
    allAdmins.forEach(admin => {
        const adminCard = createAdminCard(admin);
        adminList.appendChild(adminCard);
    });
}

function createAdminCard(admin) {
    const card = document.createElement('div');
    card.className = 'admin-card';
    
    const createdDate = new Date(admin.createdDate).toLocaleDateString('en-IN');
    
    card.innerHTML = `
        <div class="admin-card-header">
            <div class="admin-card-info">
                <h4>${admin.username}</h4>
                <p>${admin.email || 'No email provided'}</p>
                <span class="admin-role">${admin.isDefault ? 'Default Admin' : 'Admin'}</span>
            </div>
            <div class="admin-card-actions">
                ${!admin.isDefault ? `
                    <button class="admin-btn delete-btn" onclick="deleteAdmin('${admin.id}')" title="Delete Admin">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                ` : `
                    <span class="default-admin-badge">Default</span>
                `}
            </div>
        </div>
        <div class="admin-card-details">
            <span class="admin-created">Created: ${createdDate}</span>
        </div>
    `;
    
    return card;
}

function showAddAdminModal() {
    document.getElementById('add-admin-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('admin-form').reset();
}

function closeAddAdminModal() {
    document.getElementById('add-admin-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
    document.getElementById('admin-form').reset();
}

function handleAdminSubmit(event) {
    event.preventDefault();
    
    const username = document.getElementById('new-admin-username').value;
    const password = document.getElementById('new-admin-password').value;
    const email = document.getElementById('new-admin-email').value;
    
    // Check if username already exists
    const existingAdmin = AppState.admins.find(admin => admin.username === username);
    if (existingAdmin || username === 'himu') {
        showNotification('Username already exists. Please choose a different username.', 'error');
        return;
    }
    
    // Create new admin
    const newAdmin = {
        id: Date.now().toString(),
        username: username,
        password: password,
        email: email,
        createdDate: new Date().toISOString()
    };
    
    AppState.admins.push(newAdmin);
    saveDataToStorage();
    loadAdminList();
    
    showNotification(`Admin "${username}" added successfully!`, 'success');
    closeAddAdminModal();
}

function deleteAdmin(adminId) {
    const admin = AppState.admins.find(admin => admin.id === adminId);
    if (!admin) return;
    
    if (confirm(`Are you sure you want to delete admin "${admin.username}"?`)) {
        AppState.admins = AppState.admins.filter(admin => admin.id !== adminId);
        saveDataToStorage();
        loadAdminList();
        showNotification(`Admin "${admin.username}" deleted successfully!`, 'success');
    }
}

// ==================== PWA FUNCTIONALITY ====================

// PWA State
const PWAState = {
    isInstalled: false,
    isOnline: navigator.onLine,
    deferredPrompt: null,
    registration: null
};

// Initialize PWA
async function initializePWA() {
    console.log('Initializing PWA...');
    
    // Register service worker
    await registerServiceWorker();
    
    // Set up install prompt
    setupInstallPrompt();
    
    // Set up online/offline detection
    setupOnlineDetection();
    
    // Check if we're on iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
        // For iOS, show notification setup button
        showIOSNotificationSetup();
    } else {
        // For other platforms, request permission automatically
        requestNotificationPermission();
    }
    
    // Set up immediate notification testing
    setupImmediateNotifications();
}

// Register Service Worker
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        // Only register service worker if running on HTTPS or localhost
        if (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
            try {
                const registration = await navigator.serviceWorker.register('./sw.js');
                console.log('Service Worker registered successfully:', registration);
                PWAState.registration = registration;
                
                // Listen for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            showUpdateNotification();
                        }
                    });
                });
                
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        } else {
            console.log('Service Worker not registered - requires HTTPS or localhost (currently running on file://)');
        }
    }
}

// Set up install prompt
function setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('Install prompt triggered');
        e.preventDefault();
        PWAState.deferredPrompt = e;
        
        // Check if user has previously dismissed the banner
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        const dismissedTime = localStorage.getItem('pwa-install-dismissed-time');
        const now = Date.now();
        
        // Show banner if not dismissed or dismissed more than 7 days ago
        if (!dismissed || (dismissedTime && (now - parseInt(dismissedTime)) > 7 * 24 * 60 * 60 * 1000)) {
            showInstallBanner();
        }
    });
    
    // Check if app is already installed
    window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        PWAState.isInstalled = true;
        hideInstallBanner();
        showNotification('App installed successfully! You can now access it from your home screen.', 'success');
        
        // Track installation
        if (typeof gtag !== 'undefined') {
            gtag('event', 'pwa_install', {
                event_category: 'PWA',
                event_label: 'App Installed'
            });
        }
    });
    
    // Check if running in standalone mode (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
        PWAState.isInstalled = true;
        console.log('App is running in standalone mode');
    }
}

// Show install banner
function showInstallBanner() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner && !PWAState.isInstalled) {
        banner.classList.add('show');
        
        // Track banner shown
        if (typeof gtag !== 'undefined') {
            gtag('event', 'pwa_banner_shown', {
                event_category: 'PWA',
                event_label: 'Install Banner Displayed'
            });
        }
    }
}

// Hide install banner
function hideInstallBanner() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
        banner.classList.remove('show');
    }
}

// Dismiss install banner
function dismissInstallBanner() {
    hideInstallBanner();
    
    // Remember dismissal for 7 days
    localStorage.setItem('pwa-install-dismissed', 'true');
    localStorage.setItem('pwa-install-dismissed-time', Date.now().toString());
    
    // Track dismissal
    if (typeof gtag !== 'undefined') {
        gtag('event', 'pwa_banner_dismissed', {
            event_category: 'PWA',
            event_label: 'Install Banner Dismissed'
        });
    }
}

// Install PWA
async function installPWA() {
    const device = detectDevice();
    
    if (device.isIOS) {
        // For iOS, show install instructions
        showIOSInstallModal();
    } else if (PWAState.deferredPrompt) {
        // For other platforms, use the native install prompt
        try {
            PWAState.deferredPrompt.prompt();
            const { outcome } = await PWAState.deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            
            if (outcome === 'accepted') {
                showNotification('Installing app...', 'info');
                
                // Track successful installation attempt
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'pwa_install_attempt', {
                        event_category: 'PWA',
                        event_label: 'Install Prompt Accepted'
                    });
                }
            } else {
                // Track declined installation
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'pwa_install_declined', {
                        event_category: 'PWA',
                        event_label: 'Install Prompt Declined'
                    });
                }
            }
            
            PWAState.deferredPrompt = null;
            hideInstallBanner();
        } catch (error) {
            console.error('Install prompt failed:', error);
            showNotification('Installation failed. Please try again.', 'error');
        }
    } else {
        // Fallback for browsers that don't support beforeinstallprompt
        showNotification('This app can be installed. Look for the "Add to Home Screen" option in your browser menu.', 'info');
    }
}

// Legacy function for backward compatibility
async function installApp() {
    return installPWA();
}

// Show iOS install modal
function showIOSInstallModal() {
    const modal = document.getElementById('ios-install-modal');
    if (modal) {
        modal.classList.add('show');
        
        // Track iOS install instructions shown
        if (typeof gtag !== 'undefined') {
            gtag('event', 'ios_install_instructions_shown', {
                event_category: 'PWA',
                event_label: 'iOS Install Instructions'
            });
        }
    }
}

// Close iOS install modal
function closeIOSInstallModal() {
    const modal = document.getElementById('ios-install-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Set up online/offline detection
function setupOnlineDetection() {
    window.addEventListener('online', () => {
        PWAState.isOnline = true;
        updatePWAStatus('online');
        showNotification('You are back online!', 'success');
        
        // Trigger background sync when back online
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            navigator.serviceWorker.ready.then(registration => {
                return registration.sync.register('background-sync');
            }).catch(error => {
                console.log('Background sync registration failed:', error);
            });
        }
    });
    
    window.addEventListener('offline', () => {
        PWAState.isOnline = false;
        updatePWAStatus('offline');
        showNotification('You are offline. Some features may be limited.', 'warning');
    });
    
    // Initial status update
    updatePWAStatus(PWAState.isOnline ? 'online' : 'offline');
}

// Update PWA status indicator
function updatePWAStatus(status) {
    const statusElement = document.getElementById('pwa-status');
    if (!statusElement) return;
    
    const icon = statusElement.querySelector('i');
    const text = statusElement.querySelector('span');
    
    statusElement.className = 'pwa-status';
    
    switch (status) {
        case 'online':
            statusElement.classList.add('online');
            icon.className = 'fas fa-wifi';
            text.textContent = 'Online';
            break;
        case 'offline':
            statusElement.classList.add('offline');
            icon.className = 'fas fa-wifi-slash';
            text.textContent = 'Offline';
            break;
        case 'syncing':
            statusElement.classList.add('syncing');
            icon.className = 'fas fa-sync-alt fa-spin';
            text.textContent = 'Syncing...';
            break;
    }
    
    // Show status indicator
    statusElement.style.display = 'flex';
    
    // Auto-hide after 3 seconds for online status
    if (status === 'online') {
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 3000);
    }
}

// Request notification permission
async function requestNotificationPermission() {
    if ('Notification' in window) {
        try {
            // For iOS, we need to request permission immediately
            if (Notification.permission === 'default') {
                const permission = await Notification.requestPermission();
                console.log('Notification permission:', permission);
                
                if (permission === 'granted') {
                    showNotification('✅ Notifications enabled! You will receive job updates.', 'success');
                    // Set up push notifications after permission is granted
                    await setupPushNotifications();
                } else if (permission === 'denied') {
                    showNotification('❌ Notifications blocked. Please enable them in Settings > Safari > Notifications.', 'warning');
                }
            } else if (Notification.permission === 'granted') {
                console.log('Notifications already enabled');
                await setupPushNotifications();
            } else {
                showNotification('🔔 Notifications are blocked. Enable them in Settings > Safari > Notifications.', 'warning');
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
        }
    } else {
        showNotification('❌ This browser does not support notifications.', 'error');
    }
}

// Set up push notifications
async function setupPushNotifications() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
            const registration = await navigator.serviceWorker.ready;
            
            // Check if already subscribed
            let subscription = await registration.pushManager.getSubscription();
            
            if (!subscription) {
                // Create a new subscription with proper VAPID key
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array('BEl62iUYgUivxIkv69yViEuiBIa40HIcFyVjZvKUKMeaF5Q5F9LGHo9YvuoON0qmxR1y8HyT3uJZikOqStn6yI8')
                });
            }
            
            console.log('Push subscription:', subscription);
            
            // No localStorage - subscription managed by service worker
            
            // Send subscription to server (you'll need to implement this endpoint)
            await sendSubscriptionToServer(subscription);
            
        } catch (error) {
            console.error('Error setting up push notifications:', error);
        }
    }
}

// Send subscription to server
async function sendSubscriptionToServer(subscription) {
    try {
        // This would typically send to your backend server
        // For now, we'll store it locally and use it for local notifications
        console.log('Subscription ready for server:', subscription);
        
        // Set up real-time notification listener
        setupRealtimeNotifications();
        
        // You can implement this to send to your Firebase or other backend
        // await fetch('/api/subscribe', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(subscription)
        // });
        
    } catch (error) {
        console.error('Error sending subscription to server:', error);
    }
}

// Set up real-time notifications
function setupRealtimeNotifications() {
    // Listen for messages from service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', event => {
            if (event.data && event.data.type === 'NOTIFICATION') {
                handleRealtimeNotification(event.data);
            }
        });
    }
    
    // Set up periodic notification checks
    setInterval(checkForNewNotifications, 30000); // Check every 30 seconds
    
    // Set up visibility change listener for immediate notifications
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            checkForNewNotifications();
        }
    });
}

// Handle real-time notifications (legacy function - now handled by main handleRealtimeNotification)
function handleRealtimeNotificationLegacy(data) {
    console.log('Legacy real-time notification received:', data);
    
    if (data.action === 'NEW_JOB') {
        sendJobNotification(data.jobTitle, data.companyName);
    } else if (data.action === 'DEADLINE_REMINDER') {
        sendDeadlineReminder(data.jobTitle, data.deadline);
    } else if (data.action === 'TEST_NOTIFICATION') {
        sendTestNotification();
    }
}

// Check for new notifications
async function checkForNewNotifications() {
    try {
        // Check if there are new jobs or updates
        const lastCheck = 0; // No localStorage - always check for new notifications
        const currentTime = Date.now();
        
        // Simulate checking for new content (replace with your actual API call)
        const hasNewContent = await checkForNewContent(lastCheck);
        
        if (hasNewContent) {
            // Send notification about new content
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.ready;
                registration.showNotification('🆕 DSI Placement Portal', {
                    body: 'New job opportunities are available! Check them out now.',
                    icon: './DSi.png',
                    badge: './DSi.png',
                    tag: 'new-jobs',
                    requireInteraction: true,
                    silent: false,
                    vibrate: [200, 100, 200],
                    data: {
                        url: './',
                        timestamp: Date.now(),
                        type: 'new-jobs'
                    }
                });
            }
        }
        
        // No localStorage - notification check time not persisted
        
    } catch (error) {
        console.error('Error checking for notifications:', error);
    }
}

// Check for new content (simulate API call)
async function checkForNewContent(lastCheck) {
    // This is a simulation - replace with your actual API call
    // For now, we'll randomly return true to demonstrate notifications
    const random = Math.random();
    return random > 0.8; // 20% chance of new content
}

// Create default notifications if none exist
function createDefaultNotifications() {
    // Only create default notifications if no notifications exist
    if (AppState.notifications.length === 0) {
        const defaultNotifications = [
            {
                id: Date.now() + 1,
                title: 'Welcome to DSI Placement Portal',
                message: 'Check this section regularly for important updates about placements and shortlisted candidates.',
                type: 'info',
                timestamp: new Date().toISOString(),
                read: false
            },
            {
                id: Date.now() + 2,
                title: 'Test Notification - Firebase Working!',
                message: `This test notification was created at ${new Date().toLocaleTimeString()}. If you can see this, Firebase is working correctly!`,
                type: 'success',
                timestamp: new Date().toISOString(),
                read: false
            }
        ];
        
        AppState.notifications = defaultNotifications;
        
        // Save to Firebase
        saveDataToStorage().then(() => {
            console.log('✅ Default notifications created and saved');
        }).catch(error => {
            console.error('❌ Error saving default notifications:', error);
        });
    }
}

// Ensure notifications exist when student logs in
function ensureNotificationsExist() {
    console.log('🔔 Ensuring notifications exist...');
    console.log('Current notifications count:', AppState.notifications.length);
    
    if (AppState.notifications.length === 0) {
        console.log('⚠️ No notifications found, creating default ones...');
        createDefaultNotifications();
    } else {
        console.log('✅ Notifications already exist:', AppState.notifications.length);
    }
}

// Restore login state from localStorage
function restoreLoginState() {
    console.log('🔄 Checking for saved login state...');
    
    const loginType = localStorage.getItem('loginType');
    const currentStudent = localStorage.getItem('currentStudent');
    const currentUser = localStorage.getItem('currentUser');
    
    if (loginType === 'student' && currentStudent) {
        try {
            const studentData = JSON.parse(currentStudent);
            console.log('✅ Restoring student login state:', studentData.usn);
            
            // Find the student in current data to ensure it's still valid
            const student = AppState.students.find(s => s.usn === studentData.usn);
            if (student) {
                AppState.currentStudent = student;
                // Ensure DOM is ready before updating navigation
                setTimeout(() => {
                    updateNavigationForStudent();
                    showStudentPortal();
                }, 100);
                showNotification('Welcome back!', 'success');
                return;
            } else {
                console.log('⚠️ Student not found in current data, clearing saved state');
                localStorage.removeItem('currentStudent');
                localStorage.removeItem('loginType');
            }
        } catch (error) {
            console.error('❌ Error parsing saved student data:', error);
            localStorage.removeItem('currentStudent');
            localStorage.removeItem('loginType');
        }
    }
    
    if (loginType === 'admin' && currentUser) {
        try {
            const userData = JSON.parse(currentUser);
            console.log('✅ Restoring admin login state:', userData.username);
            
            AppState.currentUser = userData;
            // Ensure DOM is ready before updating navigation
            setTimeout(() => {
                updateNavigationForStudent();
                showAdminDashboard();
            }, 100);
            showNotification('Welcome back!', 'success');
            return;
        } catch (error) {
            console.error('❌ Error parsing saved user data:', error);
            localStorage.removeItem('currentUser');
            localStorage.removeItem('loginType');
        }
    }
    
    console.log('ℹ️ No valid login state found');
}

// SIMPLE DIRECT APPROACH - Create and display notifications immediately
function createAndDisplayNotificationsDirectly() {
    console.log('🚀 SIMPLE DIRECT APPROACH - Creating and displaying notifications...');
    
    if (!AppState.currentStudent) {
        console.log('❌ No student logged in');
        return;
    }
    
    // Get the notifications list element
    const notificationsList = document.getElementById('student-notifications-list');
    if (!notificationsList) {
        console.error('❌ Notifications list element not found!');
        return;
    }
    
    console.log('✅ Notifications list element found');
    
    // Create default notifications if none exist
    if (AppState.notifications.length === 0) {
        console.log('⚠️ Creating default notifications...');
        AppState.notifications = [
            {
                id: Date.now() + 1,
                title: 'Welcome to DSI Placement Portal',
                message: 'Check this section regularly for important updates about placements and shortlisted candidates.',
                type: 'info',
                timestamp: new Date().toISOString(),
                read: false
            },
            {
                id: Date.now() + 2,
                title: 'Test Notification - Firebase Working!',
                message: `This test notification was created at ${new Date().toLocaleTimeString()}. If you can see this, Firebase is working correctly!`,
                type: 'success',
                timestamp: new Date().toISOString(),
                read: false
            }
        ];
    }
    
    console.log('✅ Notifications ready:', AppState.notifications.length);
    
    // Clear the list
    notificationsList.innerHTML = '';
    
    // Create and append notifications directly
    AppState.notifications.forEach((notification, index) => {
        console.log(`Creating notification ${index + 1}:`, notification.title);
        
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification-item ${notification.read ? 'read' : 'unread'}`;
        
        const timeAgo = getTimeAgo(new Date(notification.timestamp));
        
        notificationElement.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${getNotificationIcon(notification.type)}"></i>
            </div>
            <div class="notification-content">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
                <span class="notification-time">${timeAgo}</span>
            </div>
        `;
        
        notificationsList.appendChild(notificationElement);
        console.log(`✅ Notification ${index + 1} appended to DOM`);
    });
    
    console.log('✅ ALL NOTIFICATIONS DISPLAYED SUCCESSFULLY!');
}

// Set up immediate notifications for testing
function setupImmediateNotifications() {
    // Check if notifications are enabled and send a welcome notification
    if (Notification.permission === 'granted') {
        // Send welcome notification immediately
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification('🎉 Welcome to DSI Placement Portal!', {
                    body: 'You will now receive notifications about new job opportunities and updates.',
                    icon: './DSi.png',
                    badge: './DSi.png',
                    tag: 'welcome-notification',
                    requireInteraction: true,
                    silent: false,
                    vibrate: [200, 100, 200],
                    data: {
                        url: './',
                        timestamp: Date.now(),
                        type: 'welcome'
                    },
                    actions: [
                        {
                            action: 'view',
                            title: 'View Jobs',
                            icon: './DSi.png'
                        },
                        {
                            action: 'dismiss',
                            title: 'Dismiss'
                        }
                    ]
                });
            });
        }
    }
    
    // Periodic notifications removed - only send when needed
}

// Periodic notification function removed - notifications only sent when needed

// Update UI immediately after job addition
function updateUIAfterJobAdd(newJob) {
    // Update job cards immediately
    loadJobs();
    
    // Update admin job list immediately
    loadAdminJobList();
    
    // Update shortlisted candidates view if needed
    loadShortlistedCandidatesView();
    
    // Trigger any real-time listeners
    if (typeof updateRealtimeListeners === 'function') {
        updateRealtimeListeners();
    }
}

// Convert VAPID key
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// Show update notification
function showUpdateNotification() {
    const updateBanner = document.createElement('div');
    updateBanner.className = 'update-banner';
    updateBanner.innerHTML = `
        <div class="update-banner-content">
            <div class="update-banner-icon">
                <i class="fas fa-sync-alt"></i>
            </div>
            <div class="update-banner-text">
                <h4>Update Available</h4>
                <p>A new version of the app is ready</p>
            </div>
            <div class="update-banner-actions">
                <button onclick="updateApp()" class="update-btn">
                    <i class="fas fa-download"></i>
                    Update
                </button>
                <button onclick="hideUpdateBanner()" class="update-dismiss">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(updateBanner);
}

// Update app
function updateApp() {
    if (PWAState.registration && PWAState.registration.waiting) {
        PWAState.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
    }
}

// Hide update banner
function hideUpdateBanner() {
    const banner = document.querySelector('.update-banner');
    if (banner) {
        banner.remove();
    }
}

// Send push notification (for testing)
function sendTestNotification() {
    // Check if notifications are supported and permitted
    if (!('Notification' in window)) {
        showNotification('❌ This browser does not support notifications.', 'error');
        return;
    }
    
    if (Notification.permission !== 'granted') {
        showNotification('❌ Notifications are not enabled. Please enable them first.', 'warning');
        return;
    }
    
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification('🎉 DSI Placement Portal', {
                body: 'New job opportunity available! Check out the latest openings.',
                icon: './DSi.png',
                badge: './DSi.png',
                tag: 'job-notification',
                requireInteraction: true,
                silent: false,
                vibrate: [200, 100, 200],
                data: {
                    url: './',
                    timestamp: Date.now()
                },
                actions: [
                    {
                        action: 'view',
                        title: 'View Jobs',
                        icon: './DSi.png'
                    },
                    {
                        action: 'dismiss',
                        title: 'Dismiss'
                    }
                ]
            });
            
            showNotification('✅ Test notification sent! Check your notification center.', 'success');
        }).catch(error => {
            console.error('Error sending notification:', error);
            showNotification('❌ Error sending notification. Please try again.', 'error');
        });
    } else {
        showNotification('❌ Service worker not available. Please refresh the page.', 'error');
    }
}

// Send job notification
// Send new job notification to all users
function sendNewJobNotification(jobTitle, companyName) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification('🎯 New Job Opportunity!', {
                body: `${companyName} is hiring for ${jobTitle} position. Apply now!`,
                icon: './DSi.png',
                badge: './DSi.png',
                tag: 'new-job-notification',
                requireInteraction: true,
                silent: false,
                vibrate: [200, 100, 200],
                data: {
                    url: './',
                    timestamp: Date.now(),
                    type: 'new-job',
                    jobTitle: jobTitle,
                    companyName: companyName
                },
                actions: [
                    {
                        action: 'view',
                        title: 'View Job',
                        icon: './DSi.png'
                    },
                    {
                        action: 'dismiss',
                        title: 'Dismiss'
                    }
                ]
            });
        });
    }
}

function sendJobNotification(jobTitle, companyName) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification('🚀 New Job Posted!', {
                body: `${jobTitle} at ${companyName} - Apply now!`,
                icon: './DSi.png',
                badge: './DSi.png',
                tag: 'new-job',
                requireInteraction: true,
                silent: false,
                vibrate: [200, 100, 200],
                data: {
                    url: './',
                    jobTitle: jobTitle,
                    company: companyName,
                    timestamp: Date.now()
                },
                actions: [
                    {
                        action: 'apply',
                        title: 'Apply Now',
                        icon: './DSi.png'
                    },
                    {
                        action: 'view',
                        title: 'View Details',
                        icon: './DSi.png'
                    }
                ]
            });
        });
    }
}

// Send deadline reminder
function sendDeadlineReminder(jobTitle, deadline) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification('⏰ Application Deadline Soon!', {
                body: `${jobTitle} - Deadline: ${deadline}`,
                icon: './DSi.png',
                badge: './DSi.png',
                tag: 'deadline-reminder',
                requireInteraction: true,
                silent: false,
                vibrate: [300, 100, 300],
                data: {
                    url: './',
                    jobTitle: jobTitle,
                    deadline: deadline,
                    timestamp: Date.now()
                },
                actions: [
                    {
                        action: 'apply',
                        title: 'Apply Now',
                        icon: './DSi.png'
                    }
                ]
            });
        });
    }
}

// Show iOS notification setup
function showIOSNotificationSetup() {
    const permission = Notification.permission;
    
    if (permission === 'default') {
        // Show notification setup banner for iOS
        const iosBanner = document.createElement('div');
        iosBanner.id = 'ios-notification-banner';
        iosBanner.className = 'ios-notification-banner';
        iosBanner.innerHTML = `
            <div class="ios-banner-content">
                <div class="ios-banner-icon">
                    <i class="fas fa-bell"></i>
                </div>
                <div class="ios-banner-text">
                    <h4>Enable Notifications</h4>
                    <p>Get instant job updates and alerts</p>
                </div>
                <div class="ios-banner-actions">
                    <button onclick="enableIOSNotifications()" class="ios-enable-btn">
                        <i class="fas fa-bell"></i>
                        Enable
                    </button>
                    <button onclick="hideIOSBanner()" class="ios-dismiss">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(iosBanner);
        
        // Auto-hide after 15 seconds
        setTimeout(() => {
            if (document.getElementById('ios-notification-banner')) {
                hideIOSBanner();
            }
        }, 15000);
    } else if (permission === 'granted') {
        showNotification('✅ Notifications enabled! You will receive job updates.', 'success');
        setupPushNotifications();
    } else {
        showNotification('❌ Notifications blocked. Enable them in Settings > Safari > Notifications.', 'warning');
    }
}

// Enable iOS notifications
async function enableIOSNotifications() {
    try {
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
            showNotification('✅ Notifications enabled! You will receive job updates.', 'success');
            await setupPushNotifications();
            hideIOSBanner();
        } else if (permission === 'denied') {
            showNotification('❌ Notifications blocked. Please enable them in Settings > Safari > Notifications.', 'warning');
            hideIOSBanner();
        }
    } catch (error) {
        console.error('Error enabling notifications:', error);
        showNotification('❌ Error enabling notifications. Please try again.', 'error');
    }
}

// Hide iOS banner
function hideIOSBanner() {
    const banner = document.getElementById('ios-notification-banner');
    if (banner) {
        banner.remove();
    }
}

// Check notification permission and show status
function checkNotificationStatus() {
    if ('Notification' in window) {
        const permission = Notification.permission;
        console.log('Notification permission:', permission);
        
        if (permission === 'granted') {
            showNotification('✅ Notifications enabled! You will receive job updates.', 'success');
        } else if (permission === 'denied') {
            showNotification('❌ Notifications blocked. Please enable them in browser settings.', 'warning');
        } else {
            showNotification('🔔 Click to enable notifications for job updates.', 'info');
        }
        
        return permission;
    }
    return 'not-supported';
}

// ==================== OFFLINE SUPPORT ====================

// Offline data storage
const OfflineStorage = {
    // Store data offline
    async storeOffline(key, data) {
        try {
            if ('serviceWorker' in navigator) {
                const cache = await caches.open('dsi-dynamic-v1.1.0');
                const response = new Response(JSON.stringify(data));
                await cache.put(new Request(`/offline-${key}`), response);
                console.log(`Stored offline data: ${key}`);
            }
        } catch (error) {
            console.error('Failed to store offline data:', error);
        }
    },
    
    // Retrieve offline data
    async getOffline(key) {
        try {
            if ('serviceWorker' in navigator) {
                const cache = await caches.open('dsi-dynamic-v1.1.0');
                const response = await cache.match(new Request(`/offline-${key}`));
                if (response) {
                    const data = await response.json();
                    console.log(`Retrieved offline data: ${key}`);
                    return data;
                }
            }
        } catch (error) {
            console.error('Failed to retrieve offline data:', error);
        }
        return null;
    },
    
    // Store pending actions for sync when online
    async storePendingAction(action, data) {
        try {
            const pendingActions = await this.getOffline('pending-actions') || [];
            pendingActions.push({
                id: Date.now(),
                action: action,
                data: data,
                timestamp: Date.now()
            });
            await this.storeOffline('pending-actions', pendingActions);
            console.log(`Stored pending action: ${action}`);
        } catch (error) {
            console.error('Failed to store pending action:', error);
        }
    },
    
    // Get pending actions
    async getPendingActions() {
        return await this.getOffline('pending-actions') || [];
    },
    
    // Clear pending actions
    async clearPendingActions() {
        try {
            if ('serviceWorker' in navigator) {
                const cache = await caches.open('dsi-dynamic-v1.1.0');
                await cache.delete(new Request('/offline-pending-actions'));
                console.log('Cleared pending actions');
            }
        } catch (error) {
            console.error('Failed to clear pending actions:', error);
        }
    }
};

// Enhanced offline detection
function setupOfflineDetection() {
    // Override the existing setupOfflineDetection if it exists
    window.addEventListener('online', async () => {
        console.log('Back online - syncing pending actions');
        updatePWAStatus('syncing');
        
        try {
            // Sync pending actions
            const pendingActions = await OfflineStorage.getPendingActions();
            if (pendingActions.length > 0) {
                console.log(`Syncing ${pendingActions.length} pending actions`);
                
                for (const action of pendingActions) {
                    try {
                        await syncPendingAction(action);
                    } catch (error) {
                        console.error(`Failed to sync action ${action.id}:`, error);
                    }
                }
                
                // Clear pending actions after successful sync
                await OfflineStorage.clearPendingActions();
                showNotification('Offline actions synced successfully!', 'success');
            }
        } catch (error) {
            console.error('Failed to sync pending actions:', error);
            showNotification('Some offline actions could not be synced', 'warning');
        }
        
        updatePWAStatus('online');
    });
    
    window.addEventListener('offline', () => {
        console.log('Gone offline');
        updatePWAStatus('offline');
        showNotification('You are offline. Your actions will be saved and synced when you\'re back online.', 'info');
    });
}

// Sync pending action with server
async function syncPendingAction(action) {
    switch (action.action) {
        case 'job-application':
            // Sync job application
            if (window.db && window.db.ref) {
                const applicationsRef = window.db.ref('applications');
                await applicationsRef.push(action.data);
            }
            break;
        case 'profile-update':
            // Sync profile update
            if (window.db && window.db.ref) {
                const profileRef = window.db.ref(`students/${action.data.uid}`);
                await profileRef.update(action.data);
            }
            break;
        case 'notification-preference':
            // Sync notification preference
            if (window.db && window.db.ref) {
                const prefsRef = window.db.ref(`notification-preferences/${action.data.uid}`);
                await prefsRef.set(action.data.preferences);
            }
            break;
        default:
            console.log(`Unknown action type: ${action.action}`);
    }
}

// Offline-aware job application
async function submitJobApplicationOffline(jobData, studentData) {
    const applicationData = {
        jobId: jobData.id,
        jobTitle: jobData.title,
        companyName: jobData.company,
        studentId: studentData.uid,
        studentName: studentData.name,
        studentEmail: studentData.email,
        appliedAt: new Date().toISOString(),
        status: 'pending'
    };
    
    if (PWAState.isOnline) {
        // Submit directly if online
        try {
            if (window.db && window.db.ref) {
                const applicationsRef = window.db.ref('applications');
                await applicationsRef.push(applicationData);
                showNotification('Application submitted successfully!', 'success');
                return true;
            }
        } catch (error) {
            console.error('Failed to submit application online:', error);
            // Fall back to offline storage
        }
    }
    
    // Store offline if not online or if online submission failed
    await OfflineStorage.storePendingAction('job-application', applicationData);
    showNotification('Application saved offline. It will be submitted when you\'re back online.', 'info');
    return false;
}

// Offline-aware profile update
async function updateProfileOffline(profileData) {
    if (PWAState.isOnline) {
        try {
            if (window.db && window.db.ref) {
                const profileRef = window.db.ref(`students/${profileData.uid}`);
                await profileRef.update(profileData);
                showNotification('Profile updated successfully!', 'success');
                return true;
            }
        } catch (error) {
            console.error('Failed to update profile online:', error);
            // Fall back to offline storage
        }
    }
    
    // Store offline if not online or if online update failed
    await OfflineStorage.storePendingAction('profile-update', profileData);
    showNotification('Profile changes saved offline. They will be synced when you\'re back online.', 'info');
    return false;
}

// Check offline capabilities
function checkOfflineCapabilities() {
    const capabilities = {
        serviceWorker: 'serviceWorker' in navigator,
        cache: 'caches' in window,
        backgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
        notifications: 'Notification' in window,
        pushManager: 'serviceWorker' in navigator && 'PushManager' in window
    };
    
    console.log('PWA Capabilities:', capabilities);
    return capabilities;
}

// ==================== PUSH NOTIFICATIONS ====================

// Enhanced push notification system
const PushNotificationManager = {
    // Subscribe to push notifications
    async subscribe() {
        try {
            if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
                throw new Error('Push notifications not supported');
            }
            
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(this.getVapidPublicKey())
            });
            
            console.log('Push subscription successful:', subscription);
            
            // Send subscription to server
            await this.sendSubscriptionToServer(subscription);
            
            return subscription;
        } catch (error) {
            console.error('Push subscription failed:', error);
            throw error;
        }
    },
    
    // Unsubscribe from push notifications
    async unsubscribe() {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            
            if (subscription) {
                await subscription.unsubscribe();
                console.log('Push unsubscription successful');
                
                // Notify server
                await this.removeSubscriptionFromServer(subscription);
            }
        } catch (error) {
            console.error('Push unsubscription failed:', error);
            throw error;
        }
    },
    
    // Check subscription status
    async getSubscriptionStatus() {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            return {
                subscribed: !!subscription,
                subscription: subscription
            };
        } catch (error) {
            console.error('Failed to get subscription status:', error);
            return { subscribed: false, subscription: null };
        }
    },
    
    // Send subscription to server
    async sendSubscriptionToServer(subscription) {
        try {
            // In a real app, you would send this to your backend server
            // For now, we'll store it locally
            localStorage.setItem('push-subscription', JSON.stringify(subscription));
            console.log('Subscription stored locally');
            
            // You would typically send to your server like this:
            // await fetch('/api/push-subscribe', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(subscription)
            // });
        } catch (error) {
            console.error('Failed to send subscription to server:', error);
        }
    },
    
    // Remove subscription from server
    async removeSubscriptionFromServer(subscription) {
        try {
            localStorage.removeItem('push-subscription');
            console.log('Subscription removed locally');
            
            // You would typically send to your server like this:
            // await fetch('/api/push-unsubscribe', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(subscription)
            // });
        } catch (error) {
            console.error('Failed to remove subscription from server:', error);
        }
    },
    
    // Get VAPID public key (you would get this from your server)
    getVapidPublicKey() {
        // This is a placeholder - in a real app, you would get this from your server
        return 'BEl62iUYgUivxIkv69yViEuiBIa40HI8U7nW3QzZWQX6fJ37SJifowUvQCNgIu0Yp6n8hjHwhJfXw6fU1cZ0p2E';
    },
    
    // Convert VAPID key
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
};

// Enhanced notification functions
async function setupPushNotifications() {
    try {
        // Check if notifications are supported
        if (!('Notification' in window)) {
            console.log('Notifications not supported');
            return false;
        }
        
        // Check permission
        if (Notification.permission === 'denied') {
            console.log('Notifications denied by user');
            return false;
        }
        
        // Request permission if not granted
        if (Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                console.log('Notification permission denied');
                return false;
            }
        }
        
        // Subscribe to push notifications
        try {
            await PushNotificationManager.subscribe();
            console.log('Push notifications enabled');
            return true;
        } catch (error) {
            console.log('Push subscription failed, using local notifications only');
            return false;
        }
    } catch (error) {
        console.error('Failed to setup push notifications:', error);
        return false;
    }
}

// Send enhanced job notification
async function sendEnhancedJobNotification(jobData) {
    try {
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.ready;
            
            const notificationOptions = {
                title: '🚀 New Job Opportunity!',
                body: `${jobData.title} at ${jobData.company}`,
                icon: './DSi.png',
                badge: './DSi.png',
                tag: `job-${jobData.id}`,
                requireInteraction: true,
                silent: false,
                vibrate: [200, 100, 200, 100, 200],
                data: {
                    url: './#student-dashboard',
                    jobId: jobData.id,
                    jobTitle: jobData.title,
                    company: jobData.company,
                    timestamp: Date.now(),
                    type: 'new-job'
                },
                actions: [
                    {
                        action: 'apply',
                        title: 'Apply Now',
                        icon: './DSi.png'
                    },
                    {
                        action: 'view',
                        title: 'View Details',
                        icon: './DSi.png'
                    },
                    {
                        action: 'dismiss',
                        title: 'Dismiss'
                    }
                ]
            };
            
            await registration.showNotification(notificationOptions.title, notificationOptions);
            console.log('Enhanced job notification sent');
        }
    } catch (error) {
        console.error('Failed to send enhanced job notification:', error);
    }
}

// Send deadline reminder notification
async function sendDeadlineReminderNotification(jobData) {
    try {
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.ready;
            
            const notificationOptions = {
                title: '⏰ Application Deadline Soon!',
                body: `${jobData.title} - Deadline: ${jobData.deadline}`,
                icon: './DSi.png',
                badge: './DSi.png',
                tag: `deadline-${jobData.id}`,
                requireInteraction: true,
                silent: false,
                vibrate: [300, 100, 300, 100, 300],
                data: {
                    url: './#student-dashboard',
                    jobId: jobData.id,
                    jobTitle: jobData.title,
                    deadline: jobData.deadline,
                    timestamp: Date.now(),
                    type: 'deadline-reminder'
                },
                actions: [
                    {
                        action: 'apply',
                        title: 'Apply Now',
                        icon: './DSi.png'
                    },
                    {
                        action: 'view',
                        title: 'View Job',
                        icon: './DSi.png'
                    }
                ]
            };
            
            await registration.showNotification(notificationOptions.title, notificationOptions);
            console.log('Deadline reminder notification sent');
        }
    } catch (error) {
        console.error('Failed to send deadline reminder notification:', error);
    }
}

// Send application status notification
async function sendApplicationStatusNotification(applicationData) {
    try {
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.ready;
            
            let title, body, icon;
            switch (applicationData.status) {
                case 'shortlisted':
                    title = '🎉 Application Shortlisted!';
                    body = `Your application for ${applicationData.jobTitle} has been shortlisted!`;
                    icon = './DSi.png';
                    break;
                case 'rejected':
                    title = 'Application Update';
                    body = `Your application for ${applicationData.jobTitle} was not selected this time.`;
                    icon = './DSi.png';
                    break;
                case 'interview':
                    title = '📅 Interview Scheduled!';
                    body = `Interview scheduled for ${applicationData.jobTitle}`;
                    icon = './DSi.png';
                    break;
                default:
                    title = 'Application Update';
                    body = `Update on your application for ${applicationData.jobTitle}`;
                    icon = './DSi.png';
            }
            
            const notificationOptions = {
                title: title,
                body: body,
                icon: icon,
                badge: './DSi.png',
                tag: `status-${applicationData.id}`,
                requireInteraction: true,
                silent: false,
                vibrate: [200, 100, 200],
                data: {
                    url: './#applications',
                    applicationId: applicationData.id,
                    jobTitle: applicationData.jobTitle,
                    status: applicationData.status,
                    timestamp: Date.now(),
                    type: 'application-status'
                },
                actions: [
                    {
                        action: 'view',
                        title: 'View Details',
                        icon: './DSi.png'
                    }
                ]
            };
            
            await registration.showNotification(notificationOptions.title, notificationOptions);
            console.log('Application status notification sent');
        }
    } catch (error) {
        console.error('Failed to send application status notification:', error);
    }
}

// Schedule notification
function scheduleNotification(title, body, delay) {
    setTimeout(async () => {
        try {
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.ready;
                await registration.showNotification(title, {
                    body: body,
                    icon: './DSi.png',
                    badge: './DSi.png',
                    tag: `scheduled-${Date.now()}`,
                    requireInteraction: false,
                    silent: false,
                    vibrate: [200, 100, 200]
                });
            }
        } catch (error) {
            console.error('Failed to send scheduled notification:', error);
        }
    }, delay);
}

// Test notification function
async function testNotification() {
    try {
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.ready;
            await registration.showNotification('🔔 Test Notification', {
                body: 'This is a test notification from DSI Placement Portal',
                icon: './DSi.png',
                badge: './DSi.png',
                tag: 'test-notification',
                requireInteraction: true,
                silent: false,
                vibrate: [200, 100, 200],
                data: {
                    url: './',
                    timestamp: Date.now(),
                    type: 'test'
                }
            });
            console.log('Test notification sent');
        }
    } catch (error) {
        console.error('Failed to send test notification:', error);
    }
}

// Test function for debugging notification management
function testNotificationManagement() {
    console.log('=== Testing Notification Management ===');
    console.log('Total notifications:', AppState.notifications.length);
    console.log('Notifications:', AppState.notifications);
    
    if (AppState.notifications.length === 0) {
        console.log('Creating test notification...');
        addNotification({
            type: 'info',
            title: 'Test Notification',
            message: 'This is a test notification for debugging.'
        });
    }
    
    const firstNotification = AppState.notifications[0];
    if (firstNotification) {
        console.log('Testing edit with notification ID:', firstNotification.id);
        console.log('Notification details:', firstNotification);
        
        // Test edit function
        console.log('Calling editNotification...');
        editNotification(firstNotification.id);
        
        // Test delete function (commented out to avoid accidental deletion)
        // console.log('Calling deleteNotification...');
        // deleteNotification(firstNotification.id);
    }
    
    console.log('=== Test Complete ===');
}

// Simple test function to test edit/delete with specific notification
function testEditDelete(notificationId) {
    console.log('=== Testing Edit/Delete for Notification ID:', notificationId, '===');
    
    // Test edit
    console.log('Testing edit function...');
    editNotification(notificationId);
    
    // Wait a bit then test delete
    setTimeout(() => {
        console.log('Testing delete function...');
        deleteNotification(notificationId);
    }, 2000);
}

// Function to show all notification IDs for testing
function showNotificationIds() {
    console.log('=== All Notification IDs ===');
    AppState.notifications.forEach((notification, index) => {
        console.log(`Index ${index}: ID = ${notification.id} (${typeof notification.id}), Title = "${notification.title}"`);
    });
    console.log('=== End of List ===');
}

// Direct test function to test edit with the first notification
function testEditFirst() {
    if (AppState.notifications.length === 0) {
        console.log('No notifications to test');
        return;
    }
    
    const firstNotification = AppState.notifications[0];
    console.log('Testing edit with first notification:', firstNotification);
    console.log('Notification ID:', firstNotification.id, 'Type:', typeof firstNotification.id);
    
    // Try to find the notification directly
    const found = AppState.notifications.find(n => n.id === firstNotification.id);
    console.log('Found notification:', found);
    
    if (found) {
        console.log('Opening edit modal...');
        editNotification(firstNotification.id);
    } else {
        console.log('Could not find notification with ID:', firstNotification.id);
    }
}

// Direct test function to test delete with the first notification
function testDeleteFirst() {
    if (AppState.notifications.length === 0) {
        console.log('No notifications to test');
        return;
    }
    
    const firstNotification = AppState.notifications[0];
    console.log('Testing delete with first notification:', firstNotification);
    console.log('Notification ID:', firstNotification.id, 'Type:', typeof firstNotification.id);
    
    // Try to find the notification directly
    const found = AppState.notifications.find(n => n.id === firstNotification.id);
    console.log('Found notification:', found);
    
    if (found) {
        console.log('Deleting notification...');
        deleteNotification(firstNotification.id);
    } else {
        console.log('Could not find notification with ID:', firstNotification.id);
    }
}

// Function to check AppState and notification data integrity
function checkNotificationData() {
    console.log('=== Checking Notification Data Integrity ===');
    console.log('AppState exists:', !!AppState);
    console.log('AppState.notifications exists:', !!AppState.notifications);
    console.log('AppState.notifications is array:', Array.isArray(AppState.notifications));
    console.log('AppState.notifications length:', AppState.notifications.length);
    
    if (AppState.notifications && AppState.notifications.length > 0) {
        console.log('First notification:', AppState.notifications[0]);
        console.log('All notifications:');
        AppState.notifications.forEach((n, i) => {
            console.log(`  ${i}: ID=${n.id} (${typeof n.id}), Title="${n.title}", Has ID: ${!!n.id}`);
        });
    }
    
    console.log('=== End of Data Check ===');
}

// Function to clear all notifications and create fresh ones
function resetNotifications() {
    console.log('=== Resetting Notifications ===');
    
    // Clear existing notifications
    AppState.notifications = [];
    saveDataToStorage();
    
    // Create fresh test notifications
    addNotification({
        type: 'info',
        title: 'Test Notification 1',
        message: 'This is a fresh test notification for debugging.'
    });
    
    addNotification({
        type: 'success',
        title: 'Test Notification 2',
        message: 'This is another fresh test notification.'
    });
    
    console.log('Created fresh notifications:', AppState.notifications.length);
    console.log('New notifications:', AppState.notifications);
    
    // Reload the management page
    loadAdminNotificationsManagement();
    
    console.log('=== Reset Complete ===');
}

// Comprehensive debugging function to check everything
function debugNotificationSystem() {
    console.log('=== COMPREHENSIVE NOTIFICATION SYSTEM DEBUG ===');
    
    // Check AppState
    console.log('1. AppState Check:');
    console.log('   - AppState exists:', !!AppState);
    console.log('   - AppState type:', typeof AppState);
    
    if (AppState) {
        console.log('   - AppState.notifications exists:', !!AppState.notifications);
        console.log('   - AppState.notifications type:', typeof AppState.notifications);
        console.log('   - AppState.notifications is array:', Array.isArray(AppState.notifications));
        console.log('   - AppState.notifications length:', AppState.notifications ? AppState.notifications.length : 'N/A');
        
        if (AppState.notifications && AppState.notifications.length > 0) {
            console.log('   - First notification:', AppState.notifications[0]);
            console.log('   - All notification IDs:', AppState.notifications.map(n => ({ id: n.id, type: typeof n.id, title: n.title })));
        }
    }
    
    // Check DOM elements
    console.log('2. DOM Elements Check:');
    const notificationsList = document.getElementById('notifications-management-list');
    console.log('   - notifications-management-list exists:', !!notificationsList);
    console.log('   - notifications-management-list element:', notificationsList);
    
    const editModal = document.getElementById('edit-notification-modal');
    console.log('   - edit-notification-modal exists:', !!editModal);
    
    const editIdField = document.getElementById('edit-notification-id');
    console.log('   - edit-notification-id exists:', !!editIdField);
    
    // Check functions
    console.log('3. Functions Check:');
    console.log('   - editNotification function exists:', typeof editNotification === 'function');
    console.log('   - deleteNotification function exists:', typeof deleteNotification === 'function');
    console.log('   - showNotification function exists:', typeof showNotification === 'function');
    console.log('   - loadAdminNotificationsManagement function exists:', typeof loadAdminNotificationsManagement === 'function');
    
    // Check localStorage
    console.log('4. LocalStorage Check:');
    try {
        const storedData = localStorage.getItem('dsi-placement-portal-data');
        console.log('   - localStorage data exists:', !!storedData);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            console.log('   - Parsed data has notifications:', !!parsedData.notifications);
            console.log('   - Parsed notifications length:', parsedData.notifications ? parsedData.notifications.length : 'N/A');
        }
    } catch (error) {
        console.log('   - Error reading localStorage:', error);
    }
    
    console.log('=== END DEBUG ===');
}

// Function to force reload all data from localStorage
function reloadFromStorage() {
    console.log('=== RELOADING FROM STORAGE ===');
    try {
        const storedData = localStorage.getItem('dsi-placement-portal-data');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            console.log('Loaded data from storage:', parsedData);
            
            // Update AppState
            if (parsedData.notifications) {
                AppState.notifications = parsedData.notifications;
                console.log('Reloaded notifications:', AppState.notifications.length);
            }
            
            // Reload the management page
            loadAdminNotificationsManagement();
            console.log('Reloaded management page');
        } else {
            console.log('No data found in localStorage');
        }
    } catch (error) {
        console.error('Error reloading from storage:', error);
    }
    console.log('=== RELOAD COMPLETE ===');
}
