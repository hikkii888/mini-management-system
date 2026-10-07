// API Configuration
const API_BASE_URL = 'http://127.0.0.1:5000/api';

// State Management
let currentPage = 'home';
let isLoggedIn = false;
let authToken = null;
let records = [];
let editingRecord = null;
let showDeleteConfirm = null;

// Initialize App
function init() {
    const token = localStorage.getItem('authToken');
    if (token) {
        authToken = token;
        isLoggedIn = true;
    }
    render();
}

// Navigation
function navigate(page) {
    currentPage = page;
    render();
}

// Render Function
function render() {
    const app = document.getElementById('app');
    app.innerHTML = `
        ${renderNavbar()}
        <main class="container mx-auto px-4 py-8">
            ${renderPage()}
        </main>
    `;
    attachEventListeners();
}

// Navbar Component
function renderNavbar() {
    return `
        <nav class="bg-white shadow-md">
            <div class="container mx-auto px-4">
                <div class="flex justify-between items-center py-4">
                    <h1 class="text-2xl font-bold text-blue-600 cursor-pointer" onclick="navigate('home')">
                        Mini Management System
                    </h1>
                    <div class="flex space-x-4">
                        <button onclick="navigate('home')" class="px-4 py-2 rounded hover:bg-gray-100 ${currentPage === 'home' ? 'bg-blue-100 text-blue-600' : ''}">Home</button>
                        ${isLoggedIn ? `
                            <button onclick="navigate('dashboard')" class="px-4 py-2 rounded hover:bg-gray-100 ${currentPage === 'dashboard' ? 'bg-blue-100 text-blue-600' : ''}">Dashboard</button>
                            <button onclick="navigate('records')" class="px-4 py-2 rounded hover:bg-gray-100 ${currentPage === 'records' ? 'bg-blue-100 text-blue-600' : ''}">Records</button>
                            <button onclick="logout()" class="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600">Logout</button>
                        ` : `
                            <button onclick="navigate('login')" class="px-4 py-2 rounded hover:bg-gray-100 ${currentPage === 'login' ? 'bg-blue-100 text-blue-600' : ''}">Login</button>
                            <button onclick="navigate('register')" class="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">Register</button>
                        `}
                    </div>
                </div>
            </div>
        </nav>
    `;
}

// Page Routing
function renderPage() {
    switch (currentPage) {
        case 'home':
            return renderHome();
        case 'login':
            return renderLogin();
        case 'register':
            return renderRegister();
        case 'dashboard':
            return isLoggedIn ? renderDashboard() : renderLogin();
        case 'records':
            return isLoggedIn ? renderRecords() : renderLogin();
        default:
            return renderHome();
    }
}

// Home Page
function renderHome() {
    return `
        <div class="text-center py-16">
            <h2 class="text-4xl font-bold text-gray-800 mb-4">Welcome to Mini Management System</h2>
            <p class="text-xl text-gray-600 mb-8">A simple and clean interface to manage your records</p>
            <div class="space-x-4">
                ${isLoggedIn ? `
                    <button onclick="navigate('dashboard')" class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg">Go to Dashboard</button>
                    <button onclick="navigate('records')" class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-lg">Manage Records</button>
                ` : `
                    <button onclick="navigate('login')" class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg">Login</button>
                    <button onclick="navigate('register')" class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-lg">Register</button>
                `}
            </div>
        </div>
    `;
}

// Login Page
function renderLogin() {
    return `
        <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            <h2 class="text-2xl font-bold text-center mb-6">Login</h2>
            <form id="loginForm" class="space-y-4">
                <div>
                    <label class="block text-gray-700 mb-2">Email</label>
                    <input type="email" id="loginEmail" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your email">
                </div>
                <div>
                    <label class="block text-gray-700 mb-2">Password</label>
                    <input type="password" id="loginPassword" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your password">
                </div>
                <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">Login</button>
            </form>
            <p class="text-center mt-4 text-gray-600">
                Don't have an account? <button onclick="navigate('register')" class="text-blue-500 hover:underline">Register</button>
            </p>
        </div>
    `;
}

// Register Page
function renderRegister() {
    return `
        <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            <h2 class="text-2xl font-bold text-center mb-6">Register</h2>
            <form id="registerForm" class="space-y-4">
                <div>
                    <label class="block text-gray-700 mb-2">Name</label>
                    <input type="text" id="registerName" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your name">
                </div>
                <div>
                    <label class="block text-gray-700 mb-2">Email</label>
                    <input type="email" id="registerEmail" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your email">
                </div>
                <div>
                    <label class="block text-gray-700 mb-2">Password</label>
                    <input type="password" id="registerPassword" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your password">
                </div>
                <button type="submit" class="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">Register</button>
            </form>
            <p class="text-center mt-4 text-gray-600">
                Already have an account? <button onclick="navigate('login')" class="text-blue-500 hover:underline">Login</button>
            </p>
        </div>
    `;
}

// Dashboard Page
function renderDashboard() {
    return `
        <div class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-800">Dashboard</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-xl font-semibold text-gray-700 mb-2">Total Records</h3>
                    <p class="text-4xl font-bold text-blue-600">0</p>
                </div>
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-xl font-semibold text-gray-700 mb-2">Recent Activity</h3>
                    <p class="text-gray-600">View your recent record updates</p>
                </div>
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-xl font-semibold text-gray-700 mb-2">Quick Actions</h3>
                    <button onclick="navigate('records')" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Manage Records</button>
                </div>
            </div>
        </div>
    `;
}

// Records Page
function renderRecords() {
    return `
        <div class="space-y-6">
            <div class="flex justify-between items-center">
                <h2 class="text-3xl font-bold text-gray-800">Records</h2>
                <button onclick="showAddForm()" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Add Record</button>
            </div>
            <div class="bg-white rounded-lg shadow-md p-4">
                <p class="text-gray-600">Records management coming soon...</p>
            </div>
            ${currentPage === 'addRecord' ? renderAddModal() : ''}
        </div>
    `;
}

// Add Record Modal
function renderAddModal() {
    return `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
                <h3 class="text-2xl font-bold mb-4">Add New Record</h3>
                <form id="addRecordForm" class="space-y-4">
                    <div>
                        <label class="block text-gray-700 mb-2">Title</label>
                        <input type="text" id="addTitle" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Description</label>
                        <textarea id="addDescription" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3"></textarea>
                    </div>
                    <div class="flex space-x-4">
                        <button type="submit" class="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">Add</button>
                        <button type="button" onclick="closeAddForm()" class="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

// Form Handlers
function attachEventListeners() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    const addRecordForm = document.getElementById('addRecordForm');
    if (addRecordForm) {
        addRecordForm.addEventListener('submit', handleAddRecord);
    }
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            isLoggedIn = true;
            navigate('dashboard');
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        alert('Error connecting to server');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful! Please login.');
            navigate('login');
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        alert('Error connecting to server');
    }
}

function logout() {
    authToken = null;
    isLoggedIn = false;
    localStorage.removeItem('authToken');
    navigate('home');
}

// Record Management Functions
function showAddForm() {
    currentPage = 'addRecord';
    render();
}

function closeAddForm() {
    currentPage = 'records';
    render();
}

async function handleAddRecord(e) {
    e.preventDefault();

    const title = document.getElementById('addTitle').value.trim();
    const description = document.getElementById('addDescription').value.trim();

    try {
        const response = await fetch(`${API_BASE_URL}/records`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ title, description })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || 'Failed to add record');
            return;
        }

        alert('Record added successfully!');
        document.getElementById('addRecordForm').reset();
        closeAddForm();
    } catch (error) {
        alert('Error connecting to server. Please try again.');
    }
}
// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
