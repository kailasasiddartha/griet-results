let currentUser = '';

// ===== PAGE NAVIGATION =====
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    // Toggle top-links visibility
    if (pageId === 'page-login') {
        document.getElementById('topLinks').style.display = 'block';
    } else {
        document.getElementById('topLinks').style.display = 'none';
    }

    // Toggle main global header to prevent double logo on profile page
    const mainHeader = document.querySelector('.header');
    if (mainHeader) {
        if (pageId === 'page-profile') {
            mainHeader.style.display = 'none';
        } else {
            mainHeader.style.display = 'block';
        }
    }
}

// ===== SECTION CLASSIFICATION DATA =====
const sectionRanges = {
    'CSE': {
        sections: [
            { section: 'A', from: '01', to: '65' },
            { section: 'B', from: '66', to: 'AW' },
            { section: 'C', from: 'AX', to: 'CT' },
            { section: 'D', from: 'CU', to: 'EQ' },
            { section: 'E', from: 'ER', to: 'GM' },
            { section: 'F', from: 'GN', to: '33' },
            { section: 'G', from: 'JK', to: 'LF' },
            { section: 'H', from: 'LG', to: 'NC' },
            { section: 'I', from: 'ND', to: 'Q9' },
            { section: 'J', from: 'QA', to: 'RY' }
        ]
    },
    'CSM': {
        sections: [
            { section: 'A', from: '01', to: '65' },
            { section: 'B', from: '66', to: 'AW' },
            { section: 'C', from: 'AX', to: 'CT' },
            { section: 'D', from: 'CU', to: 'EQ' },
            { section: 'E', from: 'ER', to: 'GH' }
        ]
    },
    'CSBS': {
        sections: [
            { section: 'A', from: '01', to: '61' }
        ]
    }
};

// Branch code to branch name mapping
const branchCodeMap = {
    '05': 'CSE',
    '66': 'CSM',
    '32': 'CSBS',
    'CB': 'CSBS'
};

// Full branch names
const branchFullNames = {
    'CSE': 'Computer Science and Engineering',
    'CSM': 'Computer Science and Engineering (Artificial Intelligence and Machine Learning)',
    'ECE': 'Electronics and Communication Engineering',
    'EEE': 'Electrical and Electronics Engineering',
    'MECH': 'Mechanical Engineering',
    'CIVIL': 'Civil Engineering',
    'IT': 'Information Technology',
    'CSBS': 'Computer Science and Business Systems',
    'CSD': 'Computer Science and Design'
};

// Auto-detect branch from roll number
function getBranchFromRoll(rollNumber) {
    const roll = rollNumber.toUpperCase();
    if (!roll.startsWith('25241A') || roll.length < 8) return null;
    const branchCode = roll.substring(6, 8);
    return branchCodeMap[branchCode] || null;
}

// Helper: Get section from roll number
function getSection(rollNumber) {
    const roll = rollNumber.toUpperCase();
    if (!roll.startsWith('25241A')) return null;

    const branchCode = roll.substring(6, 8);
    const studentSuffix = roll.substring(8, 10);
    const suffixNum = parseInt(studentSuffix, 36);

    let branchName = '';
    if (branchCode === '05') branchName = 'CSE';
    else if (branchCode === '66') branchName = 'CSM';
    else if (branchCode === '32' || branchCode === 'CB') branchName = 'CSBS';
    else return { branch: 'Unknown', section: 'Unknown' };

    const branchData = sectionRanges[branchName];
    if (branchData) {
        for (const range of branchData.sections) {
            const fromNum = parseInt(range.from, 36);
            const toNum = parseInt(range.to, 36);
            if (suffixNum >= fromNum && suffixNum <= toNum) {
                return { branch: branchName, section: range.section };
            }
        }
    }
    return { branch: branchName, section: 'Unknown' };
}

// ===== LOGIN =====
function doLogin() {
    const loginId = document.getElementById('loginId').value.trim().toUpperCase();
    const loginPassword = document.getElementById('loginPassword').value.trim();
    const errorDiv = document.getElementById('loginError');

    // Validate login ID: must start with 25241A followed by at least 4 alphanumeric chars (case-insensitive)
    const idRegex = /^25241A[A-Z0-9]{4,}$/i;

    if (!loginId || !idRegex.test(loginId) || !loginPassword) {
        errorDiv.textContent = 'Invalid Credentials';
        errorDiv.style.display = 'block';
        return;
    }

    errorDiv.style.display = 'none';
    currentUser = loginId;
    document.getElementById('welcomeUser').textContent = currentUser;
    document.getElementById('hallticket').value = loginId;

    // Auto-detect branch for CSE/CSM
    const detectedBranch = getBranchFromRoll(loginId);
    if (detectedBranch) {
        // CSE/CSM: go directly to profile page
        showProfilePage(currentUser, detectedBranch);
    } else {
        // Other branches: show the form
        document.getElementById('branch').value = '';
        document.getElementById('branchGroup').style.display = '';
        showPage('page-form');
    }
}

// ===== LOGOUT =====
function doLogout() {
    currentUser = '';
    document.getElementById('loginId').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('loginError').style.display = 'none';
    showPage('page-login');
}

// ===== GET RESULT =====
function getResult() {
    const hallticket = document.getElementById('hallticket').value.trim().toUpperCase();
    const examType = document.getElementById('examType').value;
    const semester = document.getElementById('semester').value;

    const htRegex = /^25241A[A-Z0-9]{4}$/i;
    if (!hallticket || !htRegex.test(hallticket)) {
        alert('Please enter a valid Hallticket number.');
        return;
    }
    if (!examType) {
        alert('Please select an Exam Type.');
        return;
    }

    // Auto-detect branch for CSE/CSM/CSBS, else use dropdown
    let branch = getBranchFromRoll(hallticket);
    if (!branch) {
        branch = document.getElementById('branch').value;
        if (!branch) {
            alert('Please select a Branch.');
            return;
        }
    }

    if (!semester) {
        alert('Please select a Semester.');
        return;
    }

    // Show the same profile page for all branches
    showProfilePage(hallticket.toUpperCase(), branch);
}

// ===== BRANCH-WISE SUBJECT DATA =====
const branchSubjects = {
    'CSE': {
        '1-1': [
            { code: 'MA101', name: 'Mathematics - I', credits: 4 },
            { code: 'PH102', name: 'Applied Physics', credits: 4 },
            { code: 'CS103', name: 'Programming for Problem Solving (C)', credits: 3 },
            { code: 'ME104', name: 'Engineering Drawing', credits: 3 },
            { code: 'EN105', name: 'English', credits: 2 },
            { code: 'CS106', name: 'C Programming Lab', credits: 2 },
            { code: 'GR17A1026', name: 'Basics of Computer Science and Engineering', credits: 1 },
            { code: 'PH102', name: 'Applied Physics lab', credits: 2 },
            { code: 'GR17A1026', name: 'english lab', credits: 1 },
            { code: 'MA101', name: 'Semi Conductors and Devices', credits: 4 }
        ]
    },
    'ECE': {
        '1-1': [
            { code: 'MA101', name: 'Mathematics - I', credits: 4 },
            { code: 'PH102', name: 'Applied Physics', credits: 4 },
            { code: 'EC103', name: 'Basic Electronics', credits: 3 },
            { code: 'ME104', name: 'Engineering Drawing', credits: 3 },
            { code: 'EN105', name: 'English', credits: 2 },
            { code: 'EC106', name: 'Electronics Lab', credits: 2 }
        ]
    },
    'EEE': {
        '1-1': [
            { code: 'MA101', name: 'Mathematics - I', credits: 4 },
            { code: 'PH102', name: 'Applied Physics', credits: 4 },
            { code: 'EE103', name: 'Circuit Theory', credits: 3 },
            { code: 'ME104', name: 'Engineering Drawing', credits: 3 },
            { code: 'EN105', name: 'English', credits: 2 },
            { code: 'EE106', name: 'Electrical Workshop', credits: 2 }
        ]
    },
    'MECH': {
        '1-1': [
            { code: 'MA101', name: 'Mathematics - I', credits: 4 },
            { code: 'PH102', name: 'Applied Physics', credits: 4 },
            { code: 'ME103', name: 'Engineering Mechanics', credits: 3 },
            { code: 'ME104', name: 'Engineering Drawing', credits: 3 },
            { code: 'EN105', name: 'English', credits: 2 },
            { code: 'ME106', name: 'Workshop Practice', credits: 2 }
        ]
    },
    'CIVIL': {
        '1-1': [
            { code: 'MA101', name: 'Mathematics - I', credits: 4 },
            { code: 'PH102', name: 'Applied Physics', credits: 4 },
            { code: 'CE103', name: 'Engineering Mechanics', credits: 3 },
            { code: 'CE104', name: 'Engineering Drawing', credits: 3 },
            { code: 'EN105', name: 'English', credits: 2 },
            { code: 'CE106', name: 'Surveying Lab', credits: 2 }
        ]
    },
    'IT': {
        '1-1': [
            { code: 'MA101', name: 'Mathematics - I', credits: 4 },
            { code: 'PH102', name: 'Applied Physics', credits: 4 },
            { code: 'IT103', name: 'Introduction to Programming', credits: 3 },
            { code: 'ME104', name: 'Engineering Drawing', credits: 3 },
            { code: 'EN105', name: 'English', credits: 2 },
            { code: 'IT106', name: 'Programming Lab', credits: 2 }
        ]
    },
    'CSM': {
        '1-1': [
            { code: 'GR17A1001', name: 'Linear Algebra and Single Variable Calculus', credits: 3 },
            { code: 'GR17A1002', name: 'Fundamentals of Electrical Engineering lab', credits: 2 },
            { code: 'GR17A1008', name: 'Engineering Chemistry', credits: 3 },
            { code: 'GR17A1018', name: 'Fundamentals of Electrical Engineering', credits: 3 },
            { code: 'GR17A1009', name: 'Computer Programming', credits: 3 },
            { code: 'GR17A1025', name: 'Engineering Workshop', credits: 2 },
            { code: 'GR17A1030', name: 'Engineering Chemistry Lab', credits: 2 },
            { code: 'GR17A1027', name: 'Computer Programming Lab', credits: 2 },
            { code: 'GR17A1026', name: 'Basics of Computer Science and Engineering', credits: 1 },
            { code: 'GR17A1028', name: 'inovation and design thinking', credits: 1 }
        ]
    },
    'CSBS': {
        '1-1': [
            { code: 'MA101', name: 'Mathematics - I', credits: 4 },
            { code: 'PH102', name: 'Applied Physics', credits: 4 },
            { code: 'CS103', name: 'Programming for Problem Solving (C)', credits: 3 },
            { code: 'ME104', name: 'Engineering Drawing', credits: 3 },
            { code: 'EN105', name: 'English', credits: 2 },
            { code: 'CS106', name: 'C Programming Lab', credits: 2 },
            { code: 'GR17A1026', name: 'Basics of Computer Science and Engineering', credits: 1 },
            { code: 'PH102', name: 'Applied Physics lab', credits: 2 },
            { code: 'GR17A1026', name: 'english lab', credits: 1 },
            { code: 'MA101', name: 'Semi Conductors and Devices', credits: 4 }
        ]
    }
};

// CSD has the same subjects as CSM
branchSubjects['CSD'] = branchSubjects['CSM'];

// ===== SEEDED RANDOM NUMBER GENERATOR =====
// Simple hash function to generate a seed from a string
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}

// Seeded PRNG (mulberry32)
function seededRandom(seed) {
    let t = seed + 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
}

// Grade scale: maps grade points to grade letters
const gradeScale = [
    { points: 10, grade: 'O' },
    { points: 9, grade: 'A+' },
    { points: 8, grade: 'A' },
    { points: 7, grade: 'B+' },
    { points: 6, grade: 'B' }
];

// ===== PROFILE PAGE FUNCTIONS =====
let profileRoll = '';
let profileBranch = '';

function showProfilePage(rollNumber, branch) {
    profileRoll = rollNumber;
    profileBranch = branch;

    const fullBranchName = branchFullNames[branch] || branch;

    // Populate GCAP header
    document.getElementById('gcapUserName').textContent = rollNumber;

    const sectionInfo = getSection(rollNumber);
    const sectionDisplay = sectionInfo ? sectionInfo.section : null;

    // Populate profile card
    document.getElementById('profileBranch').textContent = fullBranchName;
    document.getElementById('profileRollNo').textContent = rollNumber;

    // Hide section row for branches that don't have section data
    if (!sectionDisplay || sectionDisplay === 'Unknown') {
        document.getElementById('sectionRow').style.display = 'none';
    } else {
        document.getElementById('sectionRow').style.display = '';
        document.getElementById('profileSection').textContent = sectionDisplay;
    }

    // Set student photo from GCAP
    const photoUrl = 'https://griet.in/gcap/photosrgb/' + rollNumber.toUpperCase() + '.JPG';
    document.getElementById('photoLoader').style.display = 'flex';
    document.getElementById('profilePhoto').style.display = 'none';
    document.getElementById('profilePhoto').src = photoUrl;

    // Hide results area initially
    document.getElementById('profileResultsArea').style.display = 'none';
    document.getElementById('semesterDetailArea').style.display = 'none';

    // Calculate CGPA and Credits from first semester (1-1) only for the student's branch
    const sem1Result = computeSemesterSgpa(rollNumber, branch, '1-1');
    let sem1Credits = 0;
    let cgpa = 0;

    if (sem1Result && sem1Result.totalCredits > 0) {
        // Count only credits for subjects where the student passed (grade points >= 6)
        for (let i = 0; i < sem1Result.subjects.length; i++) {
            if (sem1Result.assignedPoints[i] >= 6) {
                sem1Credits += sem1Result.subjects[i].credits;
            }
        }
        cgpa = sem1Result.sgpa;
    }

    // Backlogs are always zero
    const backlogsCount = 0;

    // Update the Current Details UI
    document.getElementById('currentCredits').textContent = sem1Credits;
    document.getElementById('currentBacklogs').textContent = backlogsCount;
    document.getElementById('currentCgpa').textContent = cgpa;

    showPage('page-profile');
}

// Helper: compute SGPA for a given roll + semester
function computeSemesterSgpa(rollNumber, branch, semester) {
    const branchData = branchSubjects[branch] || {};
    const semSubjects = branchData[semester] || [];
    if (semSubjects.length === 0) return null;

    const seedStr = rollNumber.toUpperCase() + '_' + semester;
    let seed = hashString(seedStr);
    const totalCredits = semSubjects.reduce((sum, s) => sum + s.credits, 0);
    const targetSgpa = 6.9 + seededRandom(seed) * 2.0;
    seed += 1;
    const targetWeighted = targetSgpa * totalCredits;

    let assignedPoints = [];
    let runningWeighted = 0;

    for (let i = 0; i < semSubjects.length; i++) {
        const sub = semSubjects[i];
        const remainingSubjects = semSubjects.length - i - 1;
        let idealPoints;
        if (remainingSubjects === 0) {
            idealPoints = (targetWeighted - runningWeighted) / sub.credits;
        } else {
            const randVal = seededRandom(seed + i);
            idealPoints = 6 + randVal * 4;
        }
        idealPoints = Math.max(6, Math.min(10, idealPoints));
        let bestPoints = Math.round(idealPoints);
        bestPoints = Math.max(6, Math.min(10, bestPoints));
        assignedPoints.push(bestPoints);
        runningWeighted += bestPoints * sub.credits;
    }

    // Adjustment pass
    let currentSgpa = runningWeighted / totalCredits;
    let attempts = 0;
    while (Math.abs(currentSgpa - targetSgpa) > 0.15 && attempts < 20) {
        seed += 100;
        const idx = Math.floor(seededRandom(seed) * semSubjects.length);
        if (currentSgpa < targetSgpa && assignedPoints[idx] < 10) {
            assignedPoints[idx]++;
        } else if (currentSgpa > targetSgpa && assignedPoints[idx] > 6) {
            assignedPoints[idx]--;
        }
        runningWeighted = 0;
        for (let i = 0; i < semSubjects.length; i++) {
            runningWeighted += assignedPoints[i] * semSubjects[i].credits;
        }
        currentSgpa = runningWeighted / totalCredits;
        attempts++;
    }

    return {
        sgpa: (runningWeighted / totalCredits).toFixed(2),
        totalCredits: totalCredits,
        assignedPoints: assignedPoints,
        subjects: semSubjects
    };
}

// Show all semester results in a summary table
function showAllResults() {
    const tbody = document.getElementById('semesterSummaryBody');
    tbody.innerHTML = '';

    const sem = '1-1';
    const result = computeSemesterSgpa(profileRoll, profileBranch, sem);

    if (result) {
        const row = document.createElement('tr');
        row.innerHTML =
            '<td><strong>' + sem + '</strong></td>' +
            '<td>' + result.sgpa + '</td>' +
            '<td>' + result.totalCredits + '</td>' +
            '<td class="grade-pass">PASS</td>' +
            '<td><a href="#" class="view-details-link" onclick="showSemesterDetail(\'' + sem + '\'); return false;">View</a></td>';
        tbody.appendChild(row);
    }

    document.getElementById('profileResultsArea').style.display = 'block';
    document.getElementById('semesterDetailArea').style.display = 'none';
    document.getElementById('profileResultsArea').scrollIntoView({ behavior: 'smooth' });
}

// Show detailed subject marks for a specific semester
function showSemesterDetail(semester) {
    const result = computeSemesterSgpa(profileRoll, profileBranch, semester);
    if (!result) return;

    document.getElementById('profileResultsTitle').textContent = 'Semester ' + semester + ' - Subject Details';

    const tbody = document.getElementById('profileResultsBody');
    tbody.innerHTML = '';

    result.subjects.forEach((sub, i) => {
        const pts = result.assignedPoints[i];
        const gradeInfo = gradeScale.find(g => g.points === pts) || { grade: 'B', points: 6 };
        const row = document.createElement('tr');
        row.innerHTML =
            '<td>' + (i + 1) + '</td>' +
            '<td>' + sub.code + '</td>' +
            '<td>' + sub.name + '</td>' +
            '<td>' + sub.credits + '</td>' +
            '<td class="grade-pass">' + gradeInfo.grade + '</td>' +
            '<td>' + pts + '</td>';
        tbody.appendChild(row);
    });

    document.getElementById('semesterDetailArea').style.display = 'block';
    document.getElementById('semesterDetailArea').scrollIntoView({ behavior: 'smooth' });
}

function closeSemesterDetail() {
    document.getElementById('semesterDetailArea').style.display = 'none';
}

function closeProfileResults() {
    document.getElementById('profileResultsArea').style.display = 'none';
    document.getElementById('semesterDetailArea').style.display = 'none';
}
