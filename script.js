// ===========================================
// STUDENT COUNCIL ELECTION SYSTEM
// ===========================================

// Storage Keys
const CANDIDATES_KEY = 'election_candidates';
const VOTERS_KEY = 'election_voters';
const VOTES_HISTORY_KEY = 'election_votes_history';
const ADMIN_LOGIN_KEY = 'admin_logged_in';

// Admin Credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'election2024';

// Initialize all storage
function initializeStorage() {
    console.log("Initializing storage...");
    
    // Initialize candidates with 0 votes
    if (!localStorage.getItem(CANDIDATES_KEY)) {
        const initialCandidates = [
            { id: 1, name: "Logo Shri", department: "Computer Science & Engineering", votes: 0 },
            { id: 2, name: "Esai Risha", department: "Electrical & Electronics Engineering", votes: 0 },
            { id: 3, name: "Geo Safil", department: "Mechanical Engineering", votes: 0 },
            { id: 4, name: "Antin Shefilda", department: "Civil Engineering", votes: 0 }
        ];
        localStorage.setItem(CANDIDATES_KEY, JSON.stringify(initialCandidates));
        console.log("Candidates initialized");
    }
    
    // Initialize voters list (empty array)
    if (!localStorage.getItem(VOTERS_KEY)) {
        localStorage.setItem(VOTERS_KEY, JSON.stringify([]));
        console.log("Voters list initialized");
    }
    
    // Initialize votes history (empty array)
    if (!localStorage.getItem(VOTES_HISTORY_KEY)) {
        localStorage.setItem(VOTES_HISTORY_KEY, JSON.stringify([]));
        console.log("Votes history initialized");
    }
}

// ===========================================
// VOTING PAGE FUNCTIONS - FIXED
// ===========================================
function setupVotingPage() {
    console.log("Setting up voting page...");
    
    // Get DOM elements
    const voteForm = document.getElementById('voteForm');
    const totalVotesElement = document.getElementById('totalVotes');
    const notification = document.getElementById('notification');
    
    // Update total votes display
    updateTotalVotesDisplay();
    
    // Setup form submission
    if (voteForm) {
        voteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitVote();
        });
        console.log("Vote form listener added");
    }
    
    // Admin link warning
    const adminLink = document.getElementById('admin-link');
    if (adminLink) {
        adminLink.addEventListener('click', function(e) {
            if (!confirm("⚠️ ADMIN AREA - RESTRICTED ACCESS\n\nDemo Credentials:\nUsername: admin\nPassword: election2024\n\nContinue to login page?")) {
                e.preventDefault();
            }
        });
    }
    
    function updateTotalVotesDisplay() {
        if (totalVotesElement) {
            const voters = JSON.parse(localStorage.getItem(VOTERS_KEY)) || [];
            totalVotesElement.textContent = voters.length;
        }
    }
    
    function submitVote() {
        // Get form values
        const name = document.getElementById('name').value.trim();
        const regNumber = document.getElementById('regNumber').value.trim();
        const department = document.getElementById('department').value;
        const candidateElement = document.querySelector('input[name="candidate"]:checked');
        
        // Clear previous errors
        clearErrors();
        
        // Validate
        let isValid = true;
        
        if (!name || name.length < 3) {
            showError('name-error', 'Enter valid name (min 3 characters)');
            isValid = false;
        }
        
        if (!regNumber || regNumber.length < 4) {
            showError('reg-error', 'Enter valid register number');
            isValid = false;
        } else if (hasVoted(regNumber)) {
            showError('reg-error', 'This register number already voted');
            isValid = false;
        }
        
        if (!department) {
            showError('dept-error', 'Select your department');
            isValid = false;
        }
        
        if (!candidateElement) {
            showError('candidate-error', 'Select a candidate');
            isValid = false;
        }
        
        if (!isValid) {
            console.log("Validation failed");
            return;
        }
        
        const candidate = candidateElement.value;
        
        // Save vote
        saveVote(name, regNumber, department, candidate);
        
        // Show success message
        showNotification('✅ Vote Submitted Successfully!');
        
        // Reset form
        voteForm.reset();
        
        // Update display
        updateTotalVotesDisplay();
    }
    
    function hasVoted(regNumber) {
        const voters = JSON.parse(localStorage.getItem(VOTERS_KEY)) || [];
        return voters.includes(regNumber);
    }
    
    function saveVote(name, regNumber, department, candidateName) {
        console.log("Saving vote for:", candidateName);
        
        try {
            // 1. Add to voters list
            const voters = JSON.parse(localStorage.getItem(VOTERS_KEY)) || [];
            voters.push(regNumber);
            localStorage.setItem(VOTERS_KEY, JSON.stringify(voters));
            
            // 2. Update candidate votes
            const votes = JSON.parse(localStorage.getItem(CANDIDATES_KEY));
            const updatedVotes = votes.map(candidate => {
                if (candidate.name === candidateName) {
                    console.log("Found candidate, updating votes:", candidate.name, candidate.votes + 1);
                    return { ...candidate, votes: candidate.votes + 1 };
                }
                return candidate;
            });
            localStorage.setItem(CANDIDATES_KEY, JSON.stringify(updatedVotes));
            
            // 3. Save vote details
            const voteDetails = {
                name,
                regNumber,
                department,
                candidate: candidateName,
                timestamp: new Date().toLocaleString()
            };
            
            const votesList = JSON.parse(localStorage.getItem(VOTES_HISTORY_KEY)) || [];
            votesList.unshift(voteDetails);
            localStorage.setItem(VOTES_HISTORY_KEY, JSON.stringify(votesList));
            
            console.log("Vote saved successfully:", voteDetails);
            
        } catch (error) {
            console.error("Error saving vote:", error);
            showNotification('❌ Error saving vote', 'error');
        }
    }
    
    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
        });
    }
    
    function showError(id, message) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
        }
    }
    
    function showNotification(message, type = 'success') {
        if (!notification) return;
        
        notification.textContent = message;
        notification.style.backgroundColor = type === 'success' ? '#2ecc71' : '#e74c3c';
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }
    
    // Add test vote function
    window.addTestVote = function() {
        const testNames = ["John Doe", "Jane Smith", "Bob Wilson", "Alice Brown", "Charlie Lee"];
        const testRegNumbers = ["CS1001", "EE2001", "ME3001", "CE4001", "IT5001"];
        const testDepartments = ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Information Technology"];
        const testCandidates = ["Logo Shri", "Esai Risha", "Geo Safil", "Antin Shefilda"];
        
        const randomIndex = Math.floor(Math.random() * testNames.length);
        const name = testNames[randomIndex];
        const regNumber = testRegNumbers[randomIndex] + Date.now().toString().slice(-3);
        const department = testDepartments[randomIndex];
        const candidate = testCandidates[Math.floor(Math.random() * testCandidates.length)];
        
        // Save the test vote
        saveVote(name, regNumber, department, candidate);
        
        // Update display
        updateTotalVotesDisplay();
        
        // Show notification
        showNotification(`✅ Test vote added for ${name} (${regNumber})`, 'success');
        
        console.log("Test vote added:", { name, regNumber, department, candidate });
    };
}

// ===========================================
// ADMIN PAGE FUNCTIONS - FIXED
// ===========================================
function setupAdminPage() {
    console.log("Setting up admin page...");
    
    const adminLoginForm = document.getElementById('adminLoginForm');
    const loginSection = document.getElementById('login-section');
    const resultsSection = document.getElementById('results-section');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Check if already logged in
    if (localStorage.getItem(ADMIN_LOGIN_KEY) === 'true') {
        showResults();
    }
    
    // Auto-fill credentials for demo
    document.getElementById('adminUsername').value = ADMIN_USERNAME;
    document.getElementById('adminPassword').value = ADMIN_PASSWORD;
    
    // Login form submission
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('adminUsername').value.trim();
            const password = document.getElementById('adminPassword').value;
            
            if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                localStorage.setItem(ADMIN_LOGIN_KEY, 'true');
                showResults();
            } else {
                alert('Invalid credentials. Use:\nUsername: admin\nPassword: election2024');
            }
        });
    }
    
    function showResults() {
        loginSection.style.display = 'none';
        resultsSection.style.display = 'block';
        loadAdminResults();
        
        // Setup logout
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                localStorage.removeItem(ADMIN_LOGIN_KEY);
                window.location.reload();
            });
        }
    }
    
    function loadAdminResults() {
        updateSummary();
        displayCandidateResults();
        displayRecentVotes();
        renderChart();
    }
    
    function updateSummary() {
        const voters = JSON.parse(localStorage.getItem(VOTERS_KEY)) || [];
        const votesList = JSON.parse(localStorage.getItem(VOTES_HISTORY_KEY)) || [];
        
        // Total votes
        document.getElementById('total-votes-admin').textContent = voters.length;
        
        // Last vote time
        const lastVoteTime = document.getElementById('last-vote-time');
        if (votesList.length > 0) {
            lastVoteTime.textContent = votesList[0].timestamp;
        } else {
            lastVoteTime.textContent = "No votes yet";
        }
        
        // Department count
        const departments = new Set();
        votesList.forEach(vote => {
            departments.add(vote.department);
        });
        document.getElementById('dept-count').textContent = departments.size;
    }
    
    function displayCandidateResults() {
        const container = document.getElementById('candidate-results-container');
        if (!container) return;
        
        const votes = JSON.parse(localStorage.getItem(CANDIDATES_KEY)) || [];
        const totalVotes = JSON.parse(localStorage.getItem(VOTERS_KEY)).length || 0;
        
        // Clear container
        container.innerHTML = '';
        
        // Sort by votes
        votes.sort((a, b) => b.votes - a.votes);
        
        // Create result cards
        votes.forEach(candidate => {
            const percentage = totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : 0;
            
            const card = document.createElement('div');
            card.className = 'candidate-result-card';
            card.innerHTML = `
                <div class="candidate-result-info">
                    <h4>${candidate.name}</h4>
                    <p>${candidate.department}</p>
                    <p>${percentage}% of total votes</p>
                </div>
                <div class="candidate-result-votes">
                    <div class="vote-count-number">${candidate.votes}</div>
                    <div class="vote-count-label">Votes</div>
                </div>
            `;
            
            container.appendChild(card);
        });
    }
    
    function displayRecentVotes() {
        const tbody = document.getElementById('recent-votes-body');
        if (!tbody) return;
        
        const votesList = JSON.parse(localStorage.getItem(VOTES_HISTORY_KEY)) || [];
        
        // Clear table
        tbody.innerHTML = '';
        
        // Show only last 10 votes
        const recentVotes = votesList.slice(0, 10);
        
        if (recentVotes.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 2rem; color: #666;">
                        No votes have been cast yet.
                    </td>
                </tr>
            `;
            return;
        }
        
        // Add votes to table
        recentVotes.forEach(vote => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${vote.name}</td>
                <td>${vote.regNumber}</td>
                <td>${vote.department}</td>
                <td>${vote.candidate}</td>
                <td>${vote.timestamp}</td>
            `;
            tbody.appendChild(row);
        });
    }
    
    function renderChart() {
        const chartElement = document.getElementById('deptChart');
        if (!chartElement) return;
        
        const votesList = JSON.parse(localStorage.getItem(VOTES_HISTORY_KEY)) || [];
        
        // Count votes by department
        const deptCounts = {};
        votesList.forEach(vote => {
            deptCounts[vote.department] = (deptCounts[vote.department] || 0) + 1;
        });
        
        // Prepare data
        const departments = Object.keys(deptCounts);
        const voteCounts = Object.values(deptCounts);
        
        // If no data
        if (departments.length === 0) {
            chartElement.style.display = 'none';
            const container = chartElement.parentElement;
            container.innerHTML = `
                <div style="height: 100%; display: flex; align-items: center; justify-content: center; background: #f5f5f5; border-radius: 8px;">
                    <p style="color: #666; font-size: 16px;">No department data available yet</p>
                </div>
            `;
            return;
        }
        
        // Create chart
        const ctx = chartElement.getContext('2d');
        
        // Colors
        const colors = [
            'rgba(26, 41, 128, 0.7)',
            'rgba(38, 208, 206, 0.7)',
            'rgba(52, 152, 219, 0.7)',
            'rgba(155, 89, 182, 0.7)',
            'rgba(46, 204, 113, 0.7)',
            'rgba(241, 196, 15, 0.7)',
        ];
        
        // Destroy existing chart
        if (window.deptChartInstance) {
            window.deptChartInstance.destroy();
        }
        
        // Create new chart
        window.deptChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: departments,
                datasets: [{
                    label: 'Votes by Department',
                    data: voteCounts,
                    backgroundColor: colors.slice(0, departments.length),
                    borderColor: colors.map(color => color.replace('0.7', '1')),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 },
                        title: {
                            display: true,
                            text: 'Number of Votes'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Department'
                        }
                    }
                }
            }
        });
    }
    
    // Add test vote function for admin
    window.addTestVote = function() {
        const testNames = ["Test User", "Demo Student", "Sample Voter"];
        const testRegNumbers = ["TEST001", "TEST002", "TEST003"];
        const testDepartments = ["Computer Science", "Electrical Engineering", "Mechanical Engineering"];
        const testCandidates = ["Logo Shri", "Esai Risha", "Geo Safil", "Antin Shefilda"];
        
        const randomIndex = Math.floor(Math.random() * testNames.length);
        const name = testNames[randomIndex];
        const regNumber = testRegNumbers[randomIndex] + Date.now().toString().slice(-4);
        const department = testDepartments[randomIndex];
        const candidate = testCandidates[Math.floor(Math.random() * testCandidates.length)];
        
        // Save test vote
        const voters = JSON.parse(localStorage.getItem(VOTERS_KEY)) || [];
        voters.push(regNumber);
        localStorage.setItem(VOTERS_KEY, JSON.stringify(voters));
        
        // Update candidate votes
        const votes = JSON.parse(localStorage.getItem(CANDIDATES_KEY));
        const updatedVotes = votes.map(c => {
            if (c.name === candidate) {
                return { ...c, votes: c.votes + 1 };
            }
            return c;
        });
        localStorage.setItem(CANDIDATES_KEY, JSON.stringify(updatedVotes));
        
        // Save to history
        const voteDetails = {
            name,
            regNumber,
            department,
            candidate,
            timestamp: new Date().toLocaleString()
        };
        
        const votesList = JSON.parse(localStorage.getItem(VOTES_HISTORY_KEY)) || [];
        votesList.unshift(voteDetails);
        localStorage.setItem(VOTES_HISTORY_KEY, JSON.stringify(votesList));
        
        // Reload results
        loadAdminResults();
        
        alert(`✅ Test vote added!\n\nName: ${name}\nRegister: ${regNumber}\nDepartment: ${department}\nCandidate: ${candidate}`);
    };
}

// ===========================================
// MAIN INITIALIZATION
// ===========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log("Document loaded. Initializing...");
    
    // Initialize storage
    initializeStorage();
    
    // Check which page we're on
    if (document.getElementById('voteForm')) {
        // Voting page
        setupVotingPage();
    } else if (document.getElementById('adminLoginForm')) {
        // Admin page
        setupAdminPage();
    }
    
    console.log("System initialized!");
});

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

// Reset all data
window.resetElectionData = function() {
    if (confirm('⚠️ Reset ALL election data?')) {
        localStorage.removeItem(CANDIDATES_KEY);
        localStorage.removeItem(VOTERS_KEY);
        localStorage.removeItem(VOTES_HISTORY_KEY);
        localStorage.removeItem(ADMIN_LOGIN_KEY);
        initializeStorage();
        alert('✅ Data reset. Page will reload.');
        location.reload();
    }
};

// View all data
window.showAllData = function() {
    console.log("=== ELECTION DATA ===");
    console.log("Candidates:", JSON.parse(localStorage.getItem(CANDIDATES_KEY)));
    console.log("Voters:", JSON.parse(localStorage.getItem(VOTERS_KEY)));
    console.log("Votes History:", JSON.parse(localStorage.getItem(VOTES_HISTORY_KEY)));
    console.log("Admin Status:", localStorage.getItem(ADMIN_LOGIN_KEY));
};

