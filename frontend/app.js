const API_BASE_URL = 'http://127.0.0.1:5000/api';

const state = {
    currentPage: 'home',
    isLoggedIn: false,
    authToken: localStorage.getItem('authToken') || null,
    records: [],
    showRecordForm: false,
    searchTerm: ''
};

function init() {
    if (state.authToken) {
        state.isLoggedIn = true;
    }
    render();
}

function navigate(page) {
    state.currentPage = page;
    render();

    if (page === 'records' && state.isLoggedIn) {
        fetchRecords();
    }
}

function render() {
    const app = document.getElementById('app');
    app.innerHTML = `
        ${renderNavbar()}
        <main class="app-shell">
            ${renderPage()}
        </main>
    `;
    attachEventListeners();
}

function renderNavbar() {
    return `
        <header class="topbar">
            <nav class="navbar">
                <div class="brand" onclick="navigate('home')">Mini Management System</div>
                <div class="nav-links">
                    <button class="nav-btn ${state.currentPage === 'home' ? 'active' : ''}" onclick="navigate('home')">Home</button>
                    ${state.isLoggedIn ? `
                        <button class="nav-btn ${state.currentPage === 'dashboard' ? 'active' : ''}" onclick="navigate('dashboard')">Dashboard</button>
                        <button class="nav-btn ${state.currentPage === 'records' ? 'active' : ''}" onclick="navigate('records')">Records</button>
                        <button class="danger-btn" onclick="logout()">Logout</button>
                    ` : `
                        <button class="nav-btn ${state.currentPage === 'login' ? 'active' : ''}" onclick="navigate('login')">Login</button>
                        <button class="primary-btn" onclick="navigate('register')">Register</button>
                    `}
                </div>
            </nav>
        </header>
    `;
}

function renderPage() {
    switch (state.currentPage) {
        case 'home':
            return renderHome();
        case 'login':
            return renderLogin();
        case 'register':
            return renderRegister();
        case 'dashboard':
            return state.isLoggedIn ? renderDashboard() : renderLogin();
        case 'records':
            return state.isLoggedIn ? renderRecords() : renderLogin();
        default:
            return renderHome();
    }
}

function renderHome() {
    return `
        <section class="page-section">
            <div class="hero">
                <h1>Manage your records with clarity.</h1>
                <p>A simple and clean interface to organize daily records, review activity, and move between login, dashboard, and records with ease.</p>
                <div class="hero-actions">
                    ${state.isLoggedIn ? `
                        <button class="primary-btn" onclick="navigate('dashboard')">Go to Dashboard</button>
                        <button class="secondary-btn" onclick="navigate('records')">Manage Records</button>
                    ` : `
                        <button class="primary-btn" onclick="navigate('login')">Login</button>
                        <button class="secondary-btn" onclick="navigate('register')">Register</button>
                    `}
                </div>
            </div>
        </section>
    `;
}

function renderLogin() {
    return `
        <section class="page-section">
            <div class="form-card">
                <h2 class="form-title">Login</h2>
                <form id="loginForm">
                    <div class="form-group">
                        <label for="loginEmail">Email</label>
                        <input id="loginEmail" type="email" class="form-input" placeholder="Enter your email" required>
                    </div>
                    <div class="form-group">
                        <label for="loginPassword">Password</label>
                        <input id="loginPassword" type="password" class="form-input" placeholder="Enter your password" required>
                    </div>
                    <button type="submit" class="primary-btn" style="width: 100%;">Login</button>
                </form>
                <p class="form-footer">
                    Don’t have an account?
                    <button class="link-button" type="button" onclick="navigate('register')">Register</button>
                </p>
            </div>
        </section>
    `;
}

function renderRegister() {
    return `
        <section class="page-section">
            <div class="form-card">
                <h2 class="form-title">Register</h2>
                <form id="registerForm">
                    <div class="form-group">
                        <label for="registerName">Full Name</label>
                        <input id="registerName" type="text" class="form-input" placeholder="Enter your full name" required>
                    </div>
                    <div class="form-group">
                        <label for="registerEmail">Email</label>
                        <input id="registerEmail" type="email" class="form-input" placeholder="Enter your email" required>
                    </div>
                    <div class="form-group">
                        <label for="registerPassword">Password</label>
                        <input id="registerPassword" type="password" class="form-input" placeholder="Create a password" required>
                    </div>
                    <button type="submit" class="secondary-btn" style="width: 100%;">Create Account</button>
                </form>
                <p class="form-footer">
                    Already have an account?
                    <button class="link-button" type="button" onclick="navigate('login')">Login</button>
                </p>
            </div>
        </section>
    `;
}

function renderDashboard() {
    return `
        <section class="page-section">
            <div class="section-header">
                <h2>Dashboard</h2>
                <button class="primary-btn" onclick="navigate('records')">View Records</button>
            </div>

            <div class="summary-grid">
                <article class="summary-card">
                    <h3>Total Records</h3>
                    <p class="summary-value summary-highlight">${state.records.length || 0}</p>
                    <span class="summary-note">Live count</span>
                </article>
                <article class="summary-card">
                    <h3>Pending Review</h3>
                    <p class="summary-value">24</p>
                    <span class="summary-note">Needs attention</span>
                </article>
                <article class="summary-card">
                    <h3>Active Users</h3>
                    <p class="summary-value summary-highlight">43</p>
                    <span class="summary-note">Online now</span>
                </article>
            </div>

            <div class="dashboard-grid">
                <article class="panel">
                    <h3>Recent Activity</h3>
                    <ul class="activity-list">
                        <li class="activity-item"><span>New record created</span><span class="badge">Today</span></li>
                        <li class="activity-item"><span>Profile updated</span><span class="badge">Yesterday</span></li>
                        <li class="activity-item"><span>Daily sync completed</span><span class="badge">This week</span></li>
                    </ul>
                </article>

                <article class="panel">
                    <h3>Quick Actions</h3>
                    <ul class="quick-list">
                        <li class="quick-item"><span>Add new record</span><button class="ghost-btn" type="button" onclick="openRecordForm()">Open</button></li>
                        <li class="quick-item"><span>Review pending items</span><button class="ghost-btn" type="button">Check</button></li>
                        <li class="quick-item"><span>Export report</span><button class="ghost-btn" type="button">Export</button></li>
                    </ul>
                </article>
            </div>
        </section>
    `;
}

function renderRecords() {
    const rows = getFilteredRecords().map((record) => `
        <tr>
            <td>${record.title || 'Untitled Record'}</td>
            <td>${record.description || 'No description'}</td>
            <td>
                <div class="record-actions">
                    <button class="inline-btn edit" type="button">Edit</button>
                    <button class="inline-btn delete" type="button">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');

    return `
        <section class="page-section">
            <div class="section-header">
                <h2>Records</h2>
                <button class="primary-btn" type="button" onclick="openRecordForm()">Add Record</button>
            </div>

            <div class="table-card">
                <div class="toolbar">
                    <div class="search-box">
                        <input id="recordSearch" class="search-input" type="search" value="${state.searchTerm}" placeholder="Search records..." aria-label="Search records">
                    </div>
                    <button class="secondary-btn" type="button">Filter</button>
                </div>

                <table class="records-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows || '<tr><td colspan="3" class="empty-state">No records found.</td></tr>'}
                    </tbody>
                </table>
            </div>

            ${state.showRecordForm ? renderRecordForm() : ''}
        </section>
    `;
}

function renderRecordForm() {
    return `
        <div class="modal-backdrop" onclick="closeRecordForm()">
            <div class="modal-box" onclick="event.stopPropagation()">
                <h3>Add New Record</h3>
                <form id="recordForm">
                    <div class="form-group">
                        <label for="recordTitle">Title</label>
                        <input id="recordTitle" type="text" class="form-input" placeholder="Enter title" required>
                    </div>
                    <div class="form-group">
                        <label for="recordDescription">Description</label>
                        <textarea id="recordDescription" class="form-textarea" rows="4" placeholder="Enter description" required></textarea>
                    </div>
                    <div class="modal-actions">
                        <button type="submit" class="primary-btn">Save</button>
                        <button type="button" class="ghost-btn" onclick="closeRecordForm()">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function attachEventListeners() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    const registerForm = document.getElementById('registerForm');
    if (registerForm) registerForm.addEventListener('submit', handleRegister);

    const recordForm = document.getElementById('recordForm');
    if (recordForm) recordForm.addEventListener('submit', handleRecordSubmit);

    const recordSearch = document.getElementById('recordSearch');
    if (recordSearch) {
        recordSearch.addEventListener('input', (event) => {
            state.searchTerm = event.target.value.trim().toLowerCase();
            render();
        });
    }
}

function getFilteredRecords() {
    if (!state.searchTerm) {
        return state.records;
    }

    return state.records.filter((record) => {
        const title = (record.title || '').toLowerCase();
        const description = (record.description || '').toLowerCase();
        return title.includes(state.searchTerm) || description.includes(state.searchTerm);
    });
}

function openRecordForm() {
    state.showRecordForm = true;
    render();
}

function closeRecordForm() {
    state.showRecordForm = false;
    render();
}

async function fetchRecords() {
    if (!state.isLoggedIn || !state.authToken) return;

    try {
        const response = await fetch(`${API_BASE_URL}/records`, {
            headers: {
                'Authorization': `Bearer ${state.authToken}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch records');
        }

        state.records = Array.isArray(data) ? data : [];
        render();
    } catch (error) {
        alert(error.message || 'Unable to load records from the server.');
    }
}

async function handleLogin(event) {
    event.preventDefault();
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
            state.authToken = data.token;
            localStorage.setItem('authToken', state.authToken);
            state.isLoggedIn = true;
            state.currentPage = 'dashboard';
            await fetchRecords();
            render();
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        alert('Unable to connect to the server.');
    }
}

async function handleRegister(event) {
    event.preventDefault();
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
            alert('Registration successful! Please log in.');
            state.currentPage = 'login';
            render();
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        alert('Unable to connect to the server.');
    }
}

async function handleRecordSubmit(event) {
    event.preventDefault();

    const title = document.getElementById('recordTitle').value.trim();
    const description = document.getElementById('recordDescription').value.trim();

    if (!title || !description) {
        alert('Please fill in both title and description.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/records`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.authToken}`
            },
            body: JSON.stringify({ title, description })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Record creation failed');
        }

        state.records.unshift({
            title,
            description,
            _id: data.record?._id || Date.now().toString()
        });

        closeRecordForm();
        render();
    } catch (error) {
        alert(error.message || 'Unable to save the record.');
    }
}

function logout() {
    state.authToken = null;
    state.isLoggedIn = false;
    state.records = [];
    state.currentPage = 'home';
    localStorage.removeItem('authToken');
    render();
}

document.addEventListener('DOMContentLoaded', init);
