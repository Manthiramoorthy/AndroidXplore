// JavaScript functionality can be added here if needed in the future.
console.log('Welcome to the AndroidXplore Hackathon 2025!');

// Add animation classes to elements on page load
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => section.classList.add('animate-fade-in'));
});

// Countdown Timer
function updateTimer() {
    const endDate = new Date('2025-06-19T23:59:59').getTime();
    const now = new Date().getTime();
    const distance = endDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const timerHTML = `
        <div class="timer-block" data-value="${days}">
            <span>${String(days).padStart(2, '0')}</span>
            <small>Days</small>
        </div>
        <div class="timer-block" data-value="${hours}">
            <span>${String(hours).padStart(2, '0')}</span>
            <small>Hours</small>
        </div>
        <div class="timer-block" data-value="${minutes}">
            <span>${String(minutes).padStart(2, '0')}</span>
            <small>Minutes</small>
        </div>
        <div class="timer-block" data-value="${seconds}">
            <span>${String(seconds).padStart(2, '0')}</span>
            <small>Seconds</small>
        </div>
    `;

    const timerElement = document.getElementById('timer');
    
    if (distance < 0) {
        timerElement.innerHTML = '<div class="timer-ended">Event Has Ended</div>';
        return;
    }

    // Only update changing values to prevent unnecessary re-renders
    const currentBlocks = timerElement.querySelectorAll('.timer-block');
    if (currentBlocks.length === 0) {
        timerElement.innerHTML = timerHTML;
    } else {
        currentBlocks.forEach((block, index) => {
            const newValue = [days, hours, minutes, seconds][index];
            if (parseInt(block.dataset.value) !== newValue) {
                block.dataset.value = newValue;
                block.querySelector('span').textContent = String(newValue).padStart(2, '0');
                block.classList.remove('pulse-animation');
                void block.offsetWidth; // Trigger reflow
                block.classList.add('pulse-animation');
            }
        });
    }
}

// Initialize and update timer
updateTimer();
setInterval(updateTimer, 1000);

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Active section highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

const highlightNavigation = () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navbar.offsetHeight - 100;
        if (window.pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
};

window.addEventListener('scroll', highlightNavigation);
highlightNavigation(); // Initial check

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const heroSection = document.querySelector('.hero-section');
    const scrolled = window.pageYOffset;
    heroSection.style.backgroundPositionY = scrolled * 0.5 + 'px';
});

// Parallax effect for shapes
window.addEventListener('scroll', () => {
    const shapes = document.querySelectorAll('.shape');
    const scrolled = window.pageYOffset;
    
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.2;
        shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.02}deg)`;
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            if (entry.target.classList.contains('hero-title')) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        }
    });
}, observerOptions);

// Observe elements for animations
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.hero-title, .hero-description, .event-badge, .countdown-wrapper, .hero-actions, .hero-stats');
    animatedElements.forEach(el => {
        observer.observe(el);
        if (el.classList.contains('hero-title')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.8s ease-out';
        }
    });
    
    // Initialize tooltips if using Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// Function to load and process scores (updated for RegNo mapping)
async function loadScores() {
    try {
        // Fetch students.csv and score.csv
        const [studentsResponse, scoresResponse] = await Promise.all([
            fetch('./students.csv'),
            fetch('./score.csv')
        ]);
        const studentsCsv = await studentsResponse.text();
        const scoresCsv = await scoresResponse.text();

        // Parse students.csv
        const studentRows = studentsCsv.trim().split('\n').map(row => row.split(','));
        const studentHeaders = studentRows.shift();
        const students = {};
        studentRows.forEach(row => {
            const student = {};
            studentHeaders.forEach((header, i) => {
                student[header.trim()] = row[i] ? row[i].trim() : '';
            });
            // Store with lowercase RegNo for case-insensitive matching
            students[student.RegNo ? student.RegNo.trim().toLowerCase() : ''] = student;
        });

        // Parse score.csv
        const scoreRows = scoresCsv.trim().split('\n').map(row => row.split(','));
        const scoreHeaders = scoreRows.shift();
        const scores = scoreRows.map(row => {
            const entry = {};
            scoreHeaders.forEach((header, i) => {
                entry[header.trim()] = row[i] ? row[i].trim() : '';
            });
            return entry;
        });

        // Map scores to students (case-insensitive RegNo matching)
        const individualMap = {};
        const teamMap = {};
        console.log('Missing in students.csv:');
        scores.forEach(score => {
            const regNo = score.RegNo ? score.RegNo.trim().toLowerCase() : '';
            const student = students[regNo];
            if (!student) {
                // Print details if RegNo is not found in students.csv
                console.log("Email : " + score.email + "," + " RegNo : " + regNo + "," + " Name : " + score.Name + "," + " Team : " + score.Team)
                return;
            }
            // Individual
            if (!individualMap[regNo]) {
                individualMap[regNo] = {
                    regNo: student.RegNo,
                    name: student.Name,
                    email: student.Email,
                    team: student.Team,
                    totalScore: 0
                };
            }
            // Use Number instead of parseInt and check for valid number
            const scoreValue = Number(score.Score);
            if (!isNaN(scoreValue)) {
                individualMap[regNo].totalScore += scoreValue;
                // Team
                const teamKey = student.Team.toLowerCase().trim().replace(" ","");
                if (!teamMap[teamKey]) {
                    teamMap[teamKey] = {
                        name: student.Team,
                        totalScore: 0,
                        members: new Set()
                    };
                }
                teamMap[teamKey].totalScore += scoreValue;
                teamMap[teamKey].members.add(student.Name);
            }
        });
    
        // Prepare arrays for display
        // Ensure all students are included, even those with no scores
        const allIndividualScores = Object.values(students).map(student => {
            const regNo = student.RegNo ? student.RegNo.trim().toLowerCase() : '';
            if (individualMap[regNo]) {
                return individualMap[regNo];
            } else {
                return {
                    regNo: student.RegNo,
                    name: student.Name,
                    email: student.Email,
                    team: student.Team,
                    totalScore: 0
                };
            }
        }).sort((a, b) => b.totalScore - a.totalScore);

        // Ensure all teams are included, even those with no scores
        // Build a map of all teams from students.csv, with all members
        const allTeams = {};
        Object.values(students).forEach(student => {
            const teamKey = student.Team ? student.Team.toLowerCase().trim().replace(" ","") : '';
            if (!allTeams[teamKey]) {
                allTeams[teamKey] = {
                    name: student.Team,
                    members: new Set(),
                };
            }
            allTeams[teamKey].members.add(student.Name);
        });
        // Remove teams named "Yet to be decide" and teams with <2 members
        Object.keys(allTeams).forEach(key => {
            if (
                !allTeams[key].name ||
                allTeams[key].name.toLowerCase().includes('yet to be decide') ||
                allTeams[key].members.size < 2
            ) {
                delete allTeams[key];
            }
        });

        // Merge with teamMap (scores), but always use all members from students.csv
        const allTeamScores = Object.keys(allTeams).map(teamKey => {
            const team = allTeams[teamKey];
            if (teamMap[teamKey]) {
                // Use calculated score, but members from students.csv
                return {
                    ...teamMap[teamKey],
                    totalScore: teamMap[teamKey].totalScore / team.members.size, // average
                    totalMembers: team.members.size,
                    members: Array.from(team.members).join(', ')
                };
            } else {
                // No score, but valid team
                return {
                    name: team.name,
                    totalScore: 0,
                    totalMembers: team.members.size,
                    members: Array.from(team.members).join(', ')
                };
            }
        }).sort((a, b) => b.totalScore - a.totalScore);

        // Display scores
        displayIndividualScores(allIndividualScores);
        displayTeamScores(allTeamScores);
    } catch (error) {
        console.error('Error processing scores:', error);
        document.getElementById('individualScores').innerHTML = '<div class="score-item">Error loading scores</div>';
        document.getElementById('teamScores').innerHTML = '<div class="score-item">Error loading scores</div>';
    }
}

// Calculate individual scores
function calculateIndividualScores(rows) {
    const scores = new Map();
    
    rows.forEach(row => {
        if (row.length < 5) return; 
        const [name, email, team, activity, score] = row;
        console.log('Row:', row);
        if (!scores.has(email)) {
            scores.set(email, {
                name: name.trim(),
                email: email.trim(),
                team: team.trim(),
                totalScore: 0
            });
        }
        scores.get(email).totalScore += parseInt(score) || 0;
    });
    
    return Array.from(scores.values())
        .sort((a, b) => b.totalScore - a.totalScore);
}

// Calculate team scores
function calculateTeamScores(rows) {
    const teams = new Map();
    const teamMembers = new Map();
    rows.forEach(row => { 
        if (row.length < 5) return; 
        const [name, email, team, activity, score] = row;
        if (!teams.has(team)) {
            teams.set(team, 0);
            teamMembers.set(team, new Set());
        }
        teams.set(team, teams.get(team) + (parseInt(score) || 0));
        teamMembers.get(team).add(name.trim());
    });
    
    return Array.from(teams.entries())
        .map(([team, score]) => ({
            name: team.trim(),
            totalScore: score,
            members: Array.from(teamMembers.get(team)).join(', ')
        }))
        .sort((a, b) => b.totalScore - a.totalScore);
}

// Display individual scores
function displayIndividualScores(scores) {
    const scoreList = document.getElementById('individualScores');
    if (!scoreList) return;
    if (!scores || scores.length === 0) {
        scoreList.innerHTML = '<div class="score-item">Hang tight — individual score details are on the way!</div>';
        return;
    }
    let lastScore = null;
    let lastRank = 0;
    let displayRank = 0;
    scoreList.innerHTML = scores
        .map((score, index) => {
            displayRank = (score.totalScore === lastScore) ? lastRank : index + 1;
            lastScore = score.totalScore;
            lastRank = displayRank;
            if (displayRank <= 20) {
                // Special style for top 20
                const icons = [
                    '<span class="score-icon gold">🏆</span>',
                    '<span class="score-icon silver">🥈</span>',
                    '<span class="score-icon bronze">🥉</span>',
                    '<span class="score-icon star">⭐</span>',
                    '<span class="score-icon star">⭐</span>',
                    '<span class="score-icon star">⭐</span>',
                    '<span class="score-icon star">⭐</span>',
                    '<span class="score-icon star">⭐</span>',
                    '<span class="score-icon star">⭐</span>',
                    '<span class="score-icon star">⭐</span>',
                    '<span class="score-icon star">⭐</span>',
                    '<span class="score-icon star">⭐</span>',
                    '<span class="score-icon star">⭐</span>',
                    '<span class="score-icon star">⭐</span>',
                    '<span class="score-icon star">⭐</span>',
                    '<span class="score-icon star">⭐</span>',
                    '<span class="score-icon star">⭐</span>'
                ];
                return `
                    <div class="score-item top-six top-${displayRank}">
                        <div class="score-rank top-rank top-rank-${displayRank}">${displayRank}</div>
                        ${icons[displayRank - 1] || ''}
                        <div class="score-info">
                            <div class="score-name">${score.name}</div>
                            <div class="score-team">${score.team}</div>
                        </div>
                        <div class="score-value">${score.totalScore.toFixed(2)} pts</div>
                    </div>
                `;
            } else {
                return `
                    <div class="score-item">
                        <div class="score-rank ${displayRank <= 3 ? 'top-' + displayRank : ''}">${displayRank}</div>
                        <div class="score-info">
                            <div class="score-name">${score.name}</div>
                            <div class="score-team">Team ${score.team}</div>
                        </div>
                        <div class="score-value">${score.totalScore.toFixed(2)} pts</div>
                    </div>
                `;
            }
        })
        .join('');
}

// Display team scores
function displayTeamScores(scores) {
    scores.filter(score => score.totalMembers < 2).forEach(score => {
        console.warn(`Team ${score.name} has less than 2 members, skipping display.`);
    })
    scores = scores
    .filter(score => score.totalMembers >= 2)

    const scoreList = document.getElementById('teamScores');
    if (!scoreList) return;
    if (!scores || scores.length === 0) {
        scoreList.innerHTML = '<div class="score-item">Hang tight — team score details are on the way!</div>';
        return;
    }
    let lastScore = null;
    let lastRank = 0;
    let displayRank = 0;
    scoreList.innerHTML = scores
        .map((score, index) => {
            displayRank = (score.totalScore === lastScore) ? lastRank : index + 1;
            lastScore = score.totalScore;
            lastRank = displayRank;
            if (displayRank <= 10) {
                const icons = [
                    '<span class="score-icon gold">🏆</span>',
                    '<span class="score-icon silver">🥈</span>',
                    '<span class="score-icon bronze">🥉</span>',
                    '<span class="score-icon star">⭐</span>',
                    '<span class="score-icon star">⭐</span>',
                    '<span class="score-icon star">⭐</span>'
                ];
                return `
                    <div class="score-item p-2 top-six top-${displayRank}">
                        <div class="score-rank top-rank top-rank-${displayRank}">${displayRank}</div>
                        ${icons[displayRank - 1] || ''}
                        <div class="score-info">
                            <div class="score-name">Team ${score.name}</div>
                            <div class="team-members">${score.members}</div>
                        </div>
                        <div class="score-value">${score.totalScore.toFixed(2)} pts</div>
                    </div>
                `;
            } else {
                return `
                    <div class="score-item">
                        <div class="score-rank ${displayRank <= 3 ? 'top-' + displayRank : ''}">${displayRank}</div>
                        <div class="score-info">
                            <div class="score-name">Team ${score.name}</div>
                            <div class="team-members">${score.members}</div>
                        </div>
                        <div class="score-value">${score.totalScore.toFixed(2)} pts</div>
                    </div>
                `;
            }
        })
        .join('');
}

// --- SLOT SCHEDULE DISPLAY ---
function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        // Handle quoted fields with commas
        const values = [];
        let current = '', inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') inQuotes = !inQuotes;
            else if (char === ',' && !inQuotes) {
                values.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current);
        const obj = {};
        headers.forEach((h, i) => obj[h.trim()] = values[i]?.replace(/^"|"$/g, '').trim());
        return obj;
    });
}

function renderSlots(slots) {
    const container = document.getElementById('slots-list');
    if (!container) return;
    let i = 1;
    container.innerHTML = slots.map(slot => `
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card shadow-sm slot-card h-100">
                <div class="card-body p-3">
                    <h5 class="card-title mb-2" style="font-weight:600; color:#38BDF8;">${i++} - ${slot['Team Name']}</h5>
                    <div class="small text-muted mb-1">Batch: <b>${slot.Batch}</b></div>
                    <div class="mb-1">
                        <span>Time slot: ${slot['Time Slot']}</span>
                    </div>
                    <div class="mb-1">Team Size: <b>${slot['Team Size']}</b></div>
                    <details>
                        <summary class="mb-1">Members</summary>
                        <div class="small member-list">${slot['Team Members (Name - Reg No)'].split(';').map(m => `<div>${m.trim()}</div>`).join('')}</div>
                    </details>
                </div>
            </div>
        </div>
    `).join('');
}

fetch('slots.csv')
    .then(res => res.text())
    .then(csv => {
        const slots = parseCSV(csv);
        renderSlots(slots);
    });

// Load scores when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadScores();
});


