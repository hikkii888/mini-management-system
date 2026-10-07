// API Configuration
const API_BASE_URL = 'http://127.0.0.1:5000/api';

// State Management
let currentPage = 'home';
let isLoggedIn = false;
let authToken = null;
let userRole = 'user';
let records = [];
let editingRecord = null;
let recordSearch = '';
let pageError = '';

// Initialize App
function init() {
    const token = localStorage.getItem('authToken');
    if (token) {
        authToken = token;
        isLoggedIn = true;
        userRole = getTokenRole(token);
    }
    render();
    if (isLoggedIn) {
        loadRecords();
    }
}

// Navigation
function navigate(page) {
    currentPage = page;
    pageError = '';
    render();
    if (isLoggedIn && (page === 'records' || page === 'dashboard')) {
        loadRecords();
    }
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
                            <span class="self-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">${escapeHtml(userRole)}</span>
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
        case 'addRecord':
            return isLoggedIn ? renderRecords() : renderLogin();
        default:
            return renderHome();
    }
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}

function getTokenRole(token) {
    try {
        const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const decoded = JSON.parse(atob(payload));
        return decoded.role === 'admin' ? 'admin' : 'user';
    } catch (error) {
        return 'user';
    }
}

function renderPageError() {
    return pageError
        ? `<div role="alert" class="mb-4 rounded-lg bg-red-100 px-4 py-3 text-red-700">${escapeHtml(pageError)}</div>`
        : '';
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
                    <p class="text-4xl font-bold text-blue-600">${records.length}</p>
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
            ${renderPageError()}
        </div>
    `;
}

// Records Page
function renderRecords() {
    return `
        <div class="space-y-6">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-3xl font-bold text-gray-800">Records</h2>
                    <p class="mt-1 text-sm text-gray-600">${userRole === 'admin' ? 'Admin: viewing all records' : 'Your records'}</p>
                </div>
                <button onclick="showAddForm()" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Add Record</button>
            </div>
            ${renderPageError()}
            <form id="recordSearchForm" class="flex gap-2">
                <input type="search" id="recordSearch" value="${escapeHtml(recordSearch)}" maxlength="100" placeholder="Search records" class="flex-1 rounded-lg border px-4 py-2">
                <button type="submit" class="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">Search</button>
                ${recordSearch ? '<button type="button" onclick="clearRecordSearch()" class="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300">Clear</button>' : ''}
            </form>
            <div class="space-y-4">
                ${records.length ? records.map(renderRecord).join('') : `
                    <div class="rounded-lg bg-white p-6 text-center text-gray-600 shadow-md">
                        No records found. Add a record to get started.
                    </div>
                `}
            </div>
            ${currentPage === 'addRecord' ? renderRecordModal() : ''}
        </div>
    `;
}

function renderRecord(record) {
    const owner = typeof record.user === 'object' && record.user
        ? (record.user.name || record.user.email || record.user._id)
        : record.user;

    return `
        <article class="rounded-lg bg-white p-6 shadow-md">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div class="min-w-0 flex-1">
                    <h3 class="break-words text-xl font-semibold text-gray-800">${escapeHtml(record.title)}</h3>
                    <p class="mt-2 whitespace-pre-wrap break-words text-gray-600">${escapeHtml(record.description)}</p>
                    ${userRole === 'admin' ? `<p class="mt-3 text-xs text-gray-500">Owner: ${escapeHtml(owner)}</p>` : ''}
                    ${record.createdAt ? `<p class="mt-2 text-xs text-gray-500">Updated ${escapeHtml(new Date(record.updatedAt || record.createdAt).toLocaleString())}</p>` : ''}
                </div>
                <div class="flex shrink-0 gap-2">
                    <button type="button" data-record-action="edit" data-record-id="${escapeHtml(record._id)}" class="rounded bg-blue-500 px-3 py-2 text-white hover:bg-blue-600">Edit</button>
                    <button type="button" data-record-action="delete" data-record-id="${escapeHtml(record._id)}" class="rounded bg-red-500 px-3 py-2 text-white hover:bg-red-600">Delete</button>
                </div>
            </div>
        </article>
    `;
}

// Add and edit record modal
function renderRecordModal() {
    const record = editingRecord || {};
    const isEditing = Boolean(editingRecord);
    return `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4" role="dialog" aria-modal="true" aria-labelledby="recordModalTitle">
                <h3 id="recordModalTitle" class="text-2xl font-bold mb-4">${isEditing ? 'Edit Record' : 'Add New Record'}</h3>
                <form id="recordForm" class="space-y-4">
                    <div>
                        <label class="block text-gray-700 mb-2">Title</label>
                        <input type="text" id="recordTitle" value="${escapeHtml(record.title)}" maxlength="255" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Description</label>
                        <textarea id="recordDescription" maxlength="2000" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3">${escapeHtml(record.description)}</textarea>
                    </div>
                    <div class="flex space-x-4">
                        <button type="submit" class="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">${isEditing ? 'Save changes' : 'Add'}</button>
                        <button type="button" onclick="closeRecordForm()" class="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
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

    const recordForm = document.getElementById('recordForm');
    if (recordForm) {
        recordForm.addEventListener('submit', handleSaveRecord);
    }

    const recordSearchForm = document.getElementById('recordSearchForm');
    if (recordSearchForm) {
        recordSearchForm.addEventListener('submit', handleRecordSearch);
    }

    document.querySelectorAll('[data-record-action]').forEach((button) => {
        button.addEventListener('click', () => {
            if (button.dataset.recordAction === 'edit') {
                showEditForm(button.dataset.recordId);
            } else if (button.dataset.recordAction === 'delete') {
                deleteRecord(button.dataset.recordId);
            }
        });
    });
}

// Authentication Functions
async function apiRequest(path, options = {}) {
    const headers = { ...(options.headers || {}) };
    if (options.body !== undefined) {
        headers['Content-Type'] = 'application/json';
    }
    if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
    }

    let response;
    try {
        response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
    } catch (error) {
        throw new Error('Unable to connect to the server. Please try again.');
    }

    let data;
    try {
        data = await response.json();
    } catch (error) {
        throw new Error('The server returned an invalid response.');
    }

    if (!response.ok) {
        if (response.status === 401 && authToken) {
            clearSession();
        }
        const details = Array.isArray(data.errors) ? `: ${data.errors.join(', ')}` : '';
        throw new Error(`${data.message || `Request failed (${response.status})`}${details}`);
    }

    return data;
}

function clearSession() {
    authToken = null;
    userRole = 'user';
    isLoggedIn = false;
    records = [];
    localStorage.removeItem('authToken');
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        authToken = data.token;
        userRole = data.user?.role || getTokenRole(data.token);
        localStorage.setItem('authToken', authToken);
        isLoggedIn = true;
        records = [];
        navigate('dashboard');
    } catch (error) {
        alert(error.message);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });

        alert('Registration successful! Please login.');
        navigate('login');
    } catch (error) {
        alert(error.message);
    }
}

function logout() {
    clearSession();
    editingRecord = null;
    recordSearch = '';
    navigate('home');
}

// Record Management Functions
function showAddForm() {
    editingRecord = null;
    currentPage = 'addRecord';
    render();
}

function showEditForm(recordId) {
    editingRecord = records.find((record) => record._id === recordId);
    if (!editingRecord) {
        pageError = 'That record is no longer available. Refresh the list and try again.';
        render();
        return;
    }
    currentPage = 'addRecord';
    render();
}

function closeRecordForm() {
    editingRecord = null;
    currentPage = 'records';
    render();
}

function handleRecordSearch(e) {
    e.preventDefault();
    recordSearch = document.getElementById('recordSearch').value.trim();
    loadRecords();
}

function clearRecordSearch() {
    recordSearch = '';
    render();
    loadRecords();
}

async function loadRecords() {
    if (!isLoggedIn) return;

    const query = recordSearch ? `?search=${encodeURIComponent(recordSearch)}` : '';
    try {
        records = await apiRequest(`/records${query}`);
        pageError = '';
    } catch (error) {
        pageError = error.message;
    }

    if (!isLoggedIn) {
        currentPage = 'login';
        render();
    } else if (currentPage === 'records' || currentPage === 'dashboard') {
        render();
    }
}

async function handleSaveRecord(e) {
    e.preventDefault();

    const title = document.getElementById('recordTitle').value.trim();
    const description = document.getElementById('recordDescription').value.trim();
    const isEditing = Boolean(editingRecord);
    const path = isEditing
        ? `/records/${encodeURIComponent(editingRecord._id)}`
        : '/records';

    try {
        await apiRequest(path, {
            method: isEditing ? 'PUT' : 'POST',
            body: JSON.stringify({ title, description })
        });
        editingRecord = null;
        currentPage = 'records';
        await loadRecords();
    } catch (error) {
        pageError = error.message;
        render();
    }
}

async function deleteRecord(recordId) {
    const record = records.find((item) => item._id === recordId);
    if (!record || !window.confirm(`Delete "${record.title}"? This cannot be undone.`)) return;

    try {
        await apiRequest(`/records/${encodeURIComponent(recordId)}`, { method: 'DELETE' });
        records = records.filter((item) => item._id !== recordId);
        pageError = '';
        render();
    } catch (error) {
        pageError = error.message;
        render();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
