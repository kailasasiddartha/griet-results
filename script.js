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
        branchCode: '05',
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
        branchCode: '66',
        sections: [
            { section: 'A', from: '01', to: '65' },
            { section: 'B', from: '66', to: 'AW' },
            { section: 'C', from: 'AX', to: 'CT' },
            { section: 'D', from: 'CU', to: 'EQ' },
            { section: 'E', from: 'ER', to: 'GH' }
        ]
    },
    'CSBS': {
        branchCode: '32',
        sections: [
            { section: 'A', from: '01', to: 'ZZ' }
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
    'CSBS': 'Computer Science and Business Systems'
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
    const loginId = document.getElementById('loginId').value.trim();
    const loginPassword = document.getElementById('loginPassword').value.trim();
    const errorDiv = document.getElementById('loginError');

    // Validate login ID: must start with 25241a/25241A followed by at least 4 alphanumeric chars
    const idRegex = /^25241a[a-zA-Z0-9]{4,}$/i;

    if (!loginId || !idRegex.test(loginId) || !loginPassword) {
        errorDiv.textContent = 'Invalid Credentials';
        errorDiv.style.display = 'block';
        return;
    }

    errorDiv.style.display = 'none';
    currentUser = loginId.toUpperCase();
    document.getElementById('welcomeUser').textContent = currentUser;
    document.getElementById('welcomeUser2').textContent = currentUser;
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
    const hallticket = document.getElementById('hallticket').value.trim();
    const examType = document.getElementById('examType').value;
    const semester = document.getElementById('semester').value;

    const htRegex = /^25241a[a-zA-Z0-9]{4}$/i;
    if (!hallticket || !htRegex.test(hallticket)) {
        alert('Please enter a valid Hallticket number.');
        return;
    }
    if (!examType) {
        alert('Please select an Exam Type.');
        return;
    }

    // Auto-detect branch for CSE/CSM, else use dropdown
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

    // Determine section from roll number
    const sectionInfo = getSection(hallticket);
    const sectionDisplay = sectionInfo ? sectionInfo.section : 'N/A';

    // Show student info
    document.getElementById('studentInfo').innerHTML =
        'Hallticket: <strong>' + hallticket.toUpperCase() + '</strong> | ' +
        'Branch: <strong>' + branch + '</strong> | ' +
        'Section: <strong>' + sectionDisplay + '</strong> | ' +
        'Exam Type: <strong>' + examType + '</strong> | ' +
        'Semester: <strong>' + semester + '</strong>';

    // Generate results with randomized grades based on roll number
    generateSampleResults(branch, semester, hallticket);
    showPage('page-results');
}

// ===== BRANCH-WISE SUBJECT DATA =====
const branchSubjects = {
    'CSE': {
        '1-1': [
            { code: 'MA101', name: 'Mathematics - I', credits: 4, grade: 'B+', points: 7 },
            { code: 'PH102', name: 'Applied Physics', credits: 4, grade: 'B+', points: 7 },
            { code: 'CS103', name: 'Programming for Problem Solving (C)', credits: 3, grade: 'B', points: 6 },
            { code: 'ME104', name: 'Engineering Drawing', credits: 3, grade: 'B+', points: 7 },
            { code: 'EN105', name: 'English', credits: 2, grade: 'B+', points: 7 },
            { code: 'CS106', name: 'C Programming Lab', credits: 2, grade: 'B+', points: 7 },
            { code: 'GR17A1026', name: 'Basics of Computer Science and Engineering', credits: 1, grade: 'B+', points: 7 },
            { code: 'PH102', name: 'Applied Physics lab', credits: 2, grade: 'B+', points: 7 },
            { code: 'GR17A1026', name: 'english lab', credits: 1, grade: 'B+', points: 7 },
            { code: 'MA101', name: 'Semi Conductors and Devices', credits: 4, grade: 'A', points: 6 }

        ],
        '1-2': [
            { code: 'MA201', name: 'Mathematics - II', credits: 4, grade: 'B+', points: 7 },
            { code: 'CH202', name: 'Applied Chemistry', credits: 4, grade: 'B', points: 6 },
            { code: 'CS203', name: 'Data Structures', credits: 3, grade: 'B+', points: 7 },
            { code: 'EE204', name: 'Basic Electrical Engineering', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS205', name: 'Digital Logic Design', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS206', name: 'Data Structures Lab', credits: 2, grade: 'B+', points: 7 }
        ],
        '2-1': [
            { code: 'MA301', name: 'Mathematics - III', credits: 4, grade: 'B', points: 6 },
            { code: 'CS302', name: 'Object Oriented Programming (Java)', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS303', name: 'Computer Organization & Architecture', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS304', name: 'Discrete Mathematics', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS305', name: 'Operating Systems', credits: 3, grade: 'B', points: 6 },
            { code: 'CS306', name: 'Java Programming Lab', credits: 2, grade: 'B+', points: 7 }
        ],
        '2-2': [
            { code: 'MA401', name: 'Probability & Statistics', credits: 4, grade: 'B+', points: 7 },
            { code: 'CS402', name: 'Database Management Systems', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS403', name: 'Theory of Computation', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS404', name: 'Software Engineering', credits: 3, grade: 'B', points: 6 },
            { code: 'CS405', name: 'Computer Networks', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS406', name: 'DBMS Lab', credits: 2, grade: 'B+', points: 7 }
        ],
        '3-1': [
            { code: 'CS501', name: 'Compiler Design', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS502', name: 'Artificial Intelligence', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS503', name: 'Web Technologies', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS504', name: 'Design & Analysis of Algorithms', credits: 3, grade: 'B', points: 6 },
            { code: 'CS505', name: 'Information Security', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS506', name: 'Web Technologies Lab', credits: 2, grade: 'B+', points: 7 }
        ],
        '3-2': [
            { code: 'CS601', name: 'Machine Learning', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS602', name: 'Cloud Computing', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS603', name: 'Data Mining', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS604', name: 'Distributed Systems', credits: 3, grade: 'B', points: 6 },
            { code: 'CS605', name: 'Mobile Application Development', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS606', name: 'ML Lab', credits: 2, grade: 'B+', points: 7 }
        ],
        '4-1': [
            { code: 'CS701', name: 'Deep Learning', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS702', name: 'Big Data Analytics', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS703', name: 'Internet of Things', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS704', name: 'Project - I', credits: 4, grade: 'B+', points: 7 }
        ],
        '4-2': [
            { code: 'CS801', name: 'Project - II', credits: 10, grade: 'B+', points: 7 },
            { code: 'CS802', name: 'Seminar', credits: 2, grade: 'B+', points: 7 }
        ]
    },
    'ECE': {
        '1-1': [
            { code: 'MA101', name: 'Mathematics - I', credits: 4, grade: 'B+', points: 7 },
            { code: 'PH102', name: 'Applied Physics', credits: 4, grade: 'B+', points: 7 },
            { code: 'EC103', name: 'Basic Electronics', credits: 3, grade: 'B+', points: 7 },
            { code: 'ME104', name: 'Engineering Drawing', credits: 3, grade: 'B', points: 6 },
            { code: 'EN105', name: 'English', credits: 2, grade: 'B+', points: 7 },
            { code: 'EC106', name: 'Electronics Lab', credits: 2, grade: 'B+', points: 7 }
        ],
        '1-2': [
            { code: 'MA201', name: 'Mathematics - II', credits: 4, grade: 'B', points: 6 },
            { code: 'CH202', name: 'Applied Chemistry', credits: 4, grade: 'B+', points: 7 },
            { code: 'EC203', name: 'Network Analysis', credits: 3, grade: 'B+', points: 7 },
            { code: 'EC204', name: 'Electronic Devices & Circuits', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS205', name: 'Programming in C', credits: 3, grade: 'B+', points: 7 },
            { code: 'EC206', name: 'EDC Lab', credits: 2, grade: 'B+', points: 7 }
        ],
        '2-1': [
            { code: 'MA301', name: 'Mathematics - III', credits: 4, grade: 'B+', points: 7 },
            { code: 'EC302', name: 'Signals & Systems', credits: 3, grade: 'B+', points: 7 },
            { code: 'EC303', name: 'Analog Communications', credits: 3, grade: 'B+', points: 7 },
            { code: 'EC304', name: 'Digital Electronics', credits: 3, grade: 'B', points: 6 },
            { code: 'EC305', name: 'Electromagnetic Theory', credits: 3, grade: 'B+', points: 7 },
            { code: 'EC306', name: 'Analog Communications Lab', credits: 2, grade: 'B+', points: 7 }
        ],
        '2-2': [
            { code: 'MA401', name: 'Probability & Statistics', credits: 4, grade: 'B+', points: 7 },
            { code: 'EC402', name: 'Digital Communications', credits: 3, grade: 'B+', points: 7 },
            { code: 'EC403', name: 'Linear IC Applications', credits: 3, grade: 'B+', points: 7 },
            { code: 'EC404', name: 'Microprocessors & Microcontrollers', credits: 3, grade: 'B+', points: 7 },
            { code: 'EC405', name: 'Control Systems', credits: 3, grade: 'B', points: 6 },
            { code: 'EC406', name: 'Microprocessors Lab', credits: 2, grade: 'B+', points: 7 }
        ],
        '3-1': [
            { code: 'EC501', name: 'VLSI Design', credits: 3, grade: 'B+', points: 7 },
            { code: 'EC502', name: 'Digital Signal Processing', credits: 3, grade: 'B+', points: 7 },
            { code: 'EC503', name: 'Antennas & Wave Propagation', credits: 3, grade: 'B+', points: 7 },
            { code: 'EC504', name: 'Computer Networks', credits: 3, grade: 'B', points: 6 },
            { code: 'EC505', name: 'Analog IC Design', credits: 3, grade: 'B+', points: 7 },
            { code: 'EC506', name: 'VLSI Lab', credits: 2, grade: 'B+', points: 7 }
        ],
        '3-2': [
            { code: 'EC601', name: 'Embedded Systems', credits: 3, grade: 'B+', points: 7 },
            { code: 'EC602', name: 'Wireless Communications', credits: 3, grade: 'B+', points: 7 },
            { code: 'EC603', name: 'Optical Communications', credits: 3, grade: 'B+', points: 7 },
            { code: 'EC604', name: 'Radar Systems', credits: 3, grade: 'B', points: 6 },
            { code: 'EC605', name: 'Image Processing', credits: 3, grade: 'B+', points: 7 },
            { code: 'EC606', name: 'Embedded Systems Lab', credits: 2, grade: 'B+', points: 7 }
        ],
        '4-1': [
            { code: 'EC701', name: 'Satellite Communications', credits: 3, grade: 'B+', points: 7 },
            { code: 'EC702', name: 'Biomedical Instrumentation', credits: 3, grade: 'B+', points: 7 },
            { code: 'EC703', name: 'CMOS Design', credits: 3, grade: 'B+', points: 7 },
            { code: 'EC704', name: 'Project - I', credits: 4, grade: 'B+', points: 7 }
        ],
        '4-2': [
            { code: 'EC801', name: 'Project - II', credits: 10, grade: 'B+', points: 7 },
            { code: 'EC802', name: 'Seminar', credits: 2, grade: 'B+', points: 7 }
        ]
    },
    'EEE': {
        '1-1': [
            { code: 'MA101', name: 'Mathematics - I', credits: 4, grade: 'B+', points: 7 },
            { code: 'PH102', name: 'Applied Physics', credits: 4, grade: 'B', points: 6 },
            { code: 'EE103', name: 'Circuit Theory', credits: 3, grade: 'B+', points: 7 },
            { code: 'ME104', name: 'Engineering Drawing', credits: 3, grade: 'B+', points: 7 },
            { code: 'EN105', name: 'English', credits: 2, grade: 'B+', points: 7 },
            { code: 'EE106', name: 'Electrical Workshop', credits: 2, grade: 'B+', points: 7 }
        ],
        '2-1': [
            { code: 'MA301', name: 'Mathematics - III', credits: 4, grade: 'B+', points: 7 },
            { code: 'EE302', name: 'Electrical Machines - I', credits: 3, grade: 'B+', points: 7 },
            { code: 'EE303', name: 'Power Systems - I', credits: 3, grade: 'B+', points: 7 },
            { code: 'EE304', name: 'Signals & Systems', credits: 3, grade: 'B', points: 6 },
            { code: 'EE305', name: 'Control Systems', credits: 3, grade: 'B+', points: 7 },
            { code: 'EE306', name: 'Electrical Machines Lab', credits: 2, grade: 'B+', points: 7 }
        ]
    },
    'MECH': {
        '1-1': [
            { code: 'MA101', name: 'Mathematics - I', credits: 4, grade: 'B+', points: 7 },
            { code: 'PH102', name: 'Applied Physics', credits: 4, grade: 'B+', points: 7 },
            { code: 'ME103', name: 'Engineering Mechanics', credits: 3, grade: 'B+', points: 7 },
            { code: 'ME104', name: 'Engineering Drawing', credits: 3, grade: 'B+', points: 7 },
            { code: 'EN105', name: 'English', credits: 2, grade: 'B', points: 6 },
            { code: 'ME106', name: 'Workshop Practice', credits: 2, grade: 'B+', points: 7 }
        ],
        '2-1': [
            { code: 'MA301', name: 'Mathematics - III', credits: 4, grade: 'B+', points: 7 },
            { code: 'ME302', name: 'Thermodynamics', credits: 3, grade: 'B+', points: 7 },
            { code: 'ME303', name: 'Strength of Materials', credits: 3, grade: 'B+', points: 7 },
            { code: 'ME304', name: 'Manufacturing Processes', credits: 3, grade: 'B+', points: 7 },
            { code: 'ME305', name: 'Kinematics of Machinery', credits: 3, grade: 'B', points: 6 },
            { code: 'ME306', name: 'Manufacturing Lab', credits: 2, grade: 'B+', points: 7 }
        ]
    },
    'CIVIL': {
        '1-1': [
            { code: 'MA101', name: 'Mathematics - I', credits: 4, grade: 'B+', points: 7 },
            { code: 'PH102', name: 'Applied Physics', credits: 4, grade: 'B+', points: 7 },
            { code: 'CE103', name: 'Engineering Mechanics', credits: 3, grade: 'B+', points: 7 },
            { code: 'CE104', name: 'Engineering Drawing', credits: 3, grade: 'B+', points: 7 },
            { code: 'EN105', name: 'English', credits: 2, grade: 'B+', points: 7 },
            { code: 'CE106', name: 'Surveying Lab', credits: 2, grade: 'B+', points: 7 }
        ],
        '2-1': [
            { code: 'MA301', name: 'Mathematics - III', credits: 4, grade: 'B', points: 6 },
            { code: 'CE302', name: 'Structural Analysis - I', credits: 3, grade: 'B+', points: 7 },
            { code: 'CE303', name: 'Fluid Mechanics', credits: 3, grade: 'B+', points: 7 },
            { code: 'CE304', name: 'Building Materials & Construction', credits: 3, grade: 'B+', points: 7 },
            { code: 'CE305', name: 'Geotechnical Engineering', credits: 3, grade: 'B+', points: 7 },
            { code: 'CE306', name: 'Fluid Mechanics Lab', credits: 2, grade: 'B+', points: 7 }
        ]
    },
    'IT': {
        '1-1': [
            { code: 'MA101', name: 'Mathematics - I', credits: 4, grade: 'B+', points: 7 },
            { code: 'PH102', name: 'Applied Physics', credits: 4, grade: 'B+', points: 7 },
            { code: 'IT103', name: 'Introduction to Programming', credits: 3, grade: 'B+', points: 7 },
            { code: 'ME104', name: 'Engineering Drawing', credits: 3, grade: 'B', points: 6 },
            { code: 'EN105', name: 'English', credits: 2, grade: 'B+', points: 7 },
            { code: 'IT106', name: 'Programming Lab', credits: 2, grade: 'B+', points: 7 }
        ],
        '1-2': [
            { code: 'MA201', name: 'Mathematics - II', credits: 4, grade: 'B+', points: 7 },
            { code: 'CH202', name: 'Applied Chemistry', credits: 4, grade: 'B+', points: 7 },
            { code: 'IT203', name: 'Data Structures & Algorithms', credits: 3, grade: 'B+', points: 7 },
            { code: 'EE204', name: 'Basic Electrical Engineering', credits: 3, grade: 'B', points: 6 },
            { code: 'IT205', name: 'Digital Logic & Design', credits: 3, grade: 'B+', points: 7 },
            { code: 'IT206', name: 'DS Lab', credits: 2, grade: 'B+', points: 7 }
        ],
        '2-1': [
            { code: 'MA301', name: 'Mathematics - III', credits: 4, grade: 'B+', points: 7 },
            { code: 'IT302', name: 'Object Oriented Programming', credits: 3, grade: 'B+', points: 7 },
            { code: 'IT303', name: 'Computer Organization', credits: 3, grade: 'B+', points: 7 },
            { code: 'IT304', name: 'Discrete Mathematics', credits: 3, grade: 'B+', points: 7 },
            { code: 'IT305', name: 'Operating Systems', credits: 3, grade: 'B', points: 6 },
            { code: 'IT306', name: 'OOP Lab', credits: 2, grade: 'B+', points: 7 }
        ],
        '2-2': [
            { code: 'MA401', name: 'Probability & Statistics', credits: 4, grade: 'B+', points: 7 },
            { code: 'IT402', name: 'Database Systems', credits: 3, grade: 'B+', points: 7 },
            { code: 'IT403', name: 'Software Engineering', credits: 3, grade: 'B+', points: 7 },
            { code: 'IT404', name: 'Computer Networks', credits: 3, grade: 'B+', points: 7 },
            { code: 'IT405', name: 'Web Programming', credits: 3, grade: 'B+', points: 7 },
            { code: 'IT406', name: 'Web Programming Lab', credits: 2, grade: 'B+', points: 7 }
        ],
        '3-1': [
            { code: 'IT501', name: 'Information Security', credits: 3, grade: 'B+', points: 7 },
            { code: 'IT502', name: 'Data Science', credits: 3, grade: 'B+', points: 7 },
            { code: 'IT503', name: 'Cloud Computing', credits: 3, grade: 'B+', points: 7 },
            { code: 'IT504', name: 'Software Testing', credits: 3, grade: 'B', points: 6 },
            { code: 'IT505', name: 'DevOps', credits: 3, grade: 'B+', points: 7 },
            { code: 'IT506', name: 'Cloud Computing Lab', credits: 2, grade: 'B+', points: 7 }
        ],
        '3-2': [
            { code: 'IT601', name: 'Artificial Intelligence', credits: 3, grade: 'B+', points: 7 },
            { code: 'IT602', name: 'Blockchain Technology', credits: 3, grade: 'B+', points: 7 },
            { code: 'IT603', name: 'Full Stack Development', credits: 3, grade: 'B+', points: 7 },
            { code: 'IT604', name: 'Cyber Security', credits: 3, grade: 'B+', points: 7 },
            { code: 'IT605', name: 'Data Analytics', credits: 3, grade: 'B', points: 6 },
            { code: 'IT606', name: 'Full Stack Lab', credits: 2, grade: 'B+', points: 7 }
        ],
        '4-1': [
            { code: 'IT701', name: 'Machine Learning', credits: 3, grade: 'B+', points: 7 },
            { code: 'IT702', name: 'Natural Language Processing', credits: 3, grade: 'B+', points: 7 },
            { code: 'IT703', name: 'Edge Computing', credits: 3, grade: 'B+', points: 7 },
            { code: 'IT704', name: 'Project - I', credits: 4, grade: 'B+', points: 7 }
        ],
        '4-2': [
            { code: 'IT801', name: 'Project - II', credits: 10, grade: 'B+', points: 7 },
            { code: 'IT802', name: 'Seminar', credits: 2, grade: 'B+', points: 7 }
        ]
    },
    'CSM': {
        '1-1': [
            { code: 'GR17A1001', name: 'Linear Algebra and Single Variable Calculus', credits: 3, grade: 'B+', points: 7 },
            { code: 'GR17A1002', name: 'Fundamentals of Electrical Engineering lab', credits: 2, grade: 'B+', points: 7 },
            { code: 'GR17A1008', name: 'Engineering Chemistry', credits: 3, grade: 'B+', points: 7 },
            { code: 'GR17A1018', name: 'Fundamentals of Electrical Engineering', credits: 3, grade: 'B', points: 6 },
            { code: 'GR17A1009', name: 'Computer Programming', credits: 3, grade: 'B+', points: 7 },
            { code: 'GR17A1025', name: 'Engineering Workshop', credits: 2, grade: 'B+', points: 7 },
            { code: 'GR17A1030', name: 'Engineering Chemistry Lab', credits: 2, grade: 'B+', points: 7 },
            { code: 'GR17A1027', name: 'Computer Programming Lab', credits: 2, grade: 'B+', points: 7 },
            { code: 'GR17A1026', name: 'Basics of Computer Science and Engineering', credits: 1, grade: 'B+', points: 7 },
            { code: 'GR17A1028', name: 'inovation and design thinking', credits: 1, grade: 'B+', points: 7 }
        ],
        '1-2': [
            { code: 'GR17A1003', name: 'Fourier Series and Transform Calculus', credits: 3, grade: 'B+', points: 7 },
            { code: 'GR17A1004', name: 'Numerical Methods', credits: 3, grade: 'B+', points: 7 },
            { code: 'GR17A1007', name: 'Engineering Physics', credits: 3, grade: 'B+', points: 7 },
            { code: 'GR17A1010', name: 'Data Structures', credits: 3, grade: 'B+', points: 7 },
            { code: 'GR17A1023', name: 'Engineering Graphics', credits: 3, grade: 'B+', points: 7 },
            { code: 'GR17A1019', name: 'Fundamentals of Electronics Engineering', credits: 3, grade: 'B', points: 6 },
            { code: 'GR17A1024', name: 'Business Communication and Soft Skills', credits: 2, grade: 'B+', points: 7 },
            { code: 'GR17A1026', name: 'IT Workshop', credits: 2, grade: 'B+', points: 7 },
            { code: 'GR17A1029', name: 'Engineering Physics Lab', credits: 2, grade: 'B+', points: 7 }
        ],
        '2-1': [
            { code: 'GR17A2047', name: 'Electrical Circuits', credits: 3, grade: 'B+', points: 7 },
            { code: 'GR17A2048', name: 'Electronic Circuit Analysis', credits: 4, grade: 'B+', points: 7 },
            { code: 'GR17A2049', name: 'Signals and Systems', credits: 4, grade: 'B+', points: 7 },
            { code: 'GR17A2050', name: 'Probability Theory and Stochastic Processes', credits: 3, grade: 'B+', points: 7 },
            { code: 'GR17A2043', name: 'Digital Electronics', credits: 4, grade: 'B', points: 6 },
            { code: 'GR17A2051', name: 'Electronics Circuits Analysis Lab', credits: 2, grade: 'B+', points: 7 },
            { code: 'GR17A2052', name: 'Signals and Systems Lab', credits: 2, grade: 'B+', points: 7 },
            { code: 'GR17A2053', name: 'Digital Electronics Lab', credits: 2, grade: 'B+', points: 7 }
        ],
        '2-2': [
            { code: 'GR17A2054', name: 'Electromagnetic Fields and Transmission Lines', credits: 4, grade: 'B+', points: 7 },
            { code: 'GR17A2055', name: 'Microcontrollers', credits: 4, grade: 'B+', points: 7 },
            { code: 'GR17A2056', name: 'Analog Communications', credits: 3, grade: 'B+', points: 7 },
            { code: 'GR17A2057', name: 'Analog Electronics', credits: 4, grade: 'B+', points: 7 },
            { code: 'GR17A2058', name: 'Special Functions and Complex Variables', credits: 3, grade: 'B', points: 6 },
            { code: 'GR17A2059', name: 'Microcontrollers Lab', credits: 2, grade: 'B+', points: 7 },
            { code: 'GR17A2060', name: 'Analog Communications Lab', credits: 2, grade: 'B+', points: 7 },
            { code: 'GR17A2061', name: 'Analog Electronics Lab', credits: 2, grade: 'B+', points: 7 }
        ],
        '3-1': [
            { code: 'CS501', name: 'Deep Learning', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS502', name: 'Natural Language Processing', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS503', name: 'Computer Vision', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS504', name: 'Design & Analysis of Algorithms', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS505', name: 'Data Mining', credits: 3, grade: 'B', points: 6 },
            { code: 'CS506', name: 'Deep Learning Lab', credits: 2, grade: 'B+', points: 7 }
        ],
        '3-2': [
            { code: 'CS601', name: 'Reinforcement Learning', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS602', name: 'Generative AI', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS603', name: 'Big Data Analytics', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS604', name: 'MLOps & Model Deployment', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS605', name: 'Information Security', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS606', name: 'Generative AI Lab', credits: 2, grade: 'B+', points: 7 }
        ],
        '4-1': [
            { code: 'CS701', name: 'Advanced Deep Learning', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS702', name: 'AI Ethics & Responsible AI', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS703', name: 'Edge AI & TinyML', credits: 3, grade: 'B+', points: 7 },
            { code: 'CS704', name: 'Project - I', credits: 4, grade: 'B+', points: 7 }
        ],
        '4-2': [
            { code: 'CS801', name: 'Project - II', credits: 10, grade: 'B+', points: 7 },
            { code: 'CS802', name: 'Seminar', credits: 2, grade: 'B+', points: 7 }
        ]
    },
    'CSBS': {
        '1-1': [
            { code: 'MA101', name: 'Mathematics - I', credits: 4, grade: 'B+', points: 7 },
            { code: 'PH102', name: 'Applied Physics', credits: 4, grade: 'B+', points: 7 },
            { code: 'CS103', name: 'Programming for Problem Solving (C)', credits: 3, grade: 'B', points: 6 },
            { code: 'ME104', name: 'Engineering Drawing', credits: 3, grade: 'B+', points: 7 },
            { code: 'EN105', name: 'English', credits: 2, grade: 'B+', points: 7 },
            { code: 'CS106', name: 'C Programming Lab', credits: 2, grade: 'B+', points: 7 }
        ],
        '1-2': [
            { code: 'MA201', name: 'Mathematics - II', credits: 4, grade: 'B+', points: 7 },
            { code: 'CH202', name: 'Applied Chemistry', credits: 4, grade: 'B', points: 6 },
            { code: 'CB203', name: 'Data Structures & Algorithms', credits: 3, grade: 'B+', points: 7 },
            { code: 'EE204', name: 'Basic Electrical Engineering', credits: 3, grade: 'B+', points: 7 },
            { code: 'CB205', name: 'Business Systems', credits: 3, grade: 'B+', points: 7 },
            { code: 'CB206', name: 'DS Lab', credits: 2, grade: 'B+', points: 7 }
        ],
        '2-1': [
            { code: 'MA301', name: 'Mathematics - III', credits: 4, grade: 'B', points: 6 },
            { code: 'CB302', name: 'Object Oriented Programming', credits: 3, grade: 'B+', points: 7 },
            { code: 'CB303', name: 'Computer Organization & Architecture', credits: 3, grade: 'B+', points: 7 },
            { code: 'CB304', name: 'Discrete Mathematics', credits: 3, grade: 'B+', points: 7 },
            { code: 'CB305', name: 'Software Engineering', credits: 3, grade: 'B', points: 6 },
            { code: 'CB306', name: 'OOP Lab', credits: 2, grade: 'B+', points: 7 }
        ]
    }
};

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

// ===== GENERATE RESULTS WITH RANDOMIZED GRADES =====
function generateSampleResults(branch, semester, hallticket) {
    const defaultSubjects = [
        { code: 'SUB01', name: 'Subject 1', credits: 4 },
        { code: 'SUB02', name: 'Subject 2', credits: 3 },
        { code: 'SUB03', name: 'Subject 3', credits: 3 },
        { code: 'SUB04', name: 'Subject 4', credits: 3 },
        { code: 'SUB05', name: 'Subject 5', credits: 3 },
        { code: 'SUB06', name: 'Subject 6 Lab', credits: 2 }
    ];

    const branchData = branchSubjects[branch] || {};
    const semSubjects = branchData[semester] || defaultSubjects;

    // Create a seed unique to this student + semester combination
    const seedStr = (hallticket || 'default').toUpperCase() + '_' + semester;
    let seed = hashString(seedStr);

    // Target SGPA range: 6.9 to 8.9
    // We'll assign random grades per subject, then adjust to hit the target
    const totalCredits = semSubjects.reduce((sum, s) => sum + s.credits, 0);

    // Generate a target SGPA for this student+semester (6.9 to 8.9)
    const targetSgpa = 6.9 + seededRandom(seed) * 2.0; // 6.9 to 8.9
    seed += 1;
    const targetWeighted = targetSgpa * totalCredits;

    // Assign random grade points to each subject, aiming for the target
    let assignedPoints = [];
    let runningWeighted = 0;

    for (let i = 0; i < semSubjects.length; i++) {
        const sub = semSubjects[i];
        const remainingSubjects = semSubjects.length - i - 1;
        const remainingCredits = semSubjects.slice(i + 1).reduce((s, x) => s + x.credits, 0);
        const needed = targetWeighted - runningWeighted;

        // Calculate ideal points for this subject
        let idealPoints;
        if (remainingSubjects === 0) {
            // Last subject: assign whatever is needed
            idealPoints = needed / sub.credits;
        } else {
            // Add some randomness but keep it within bounds
            const randVal = seededRandom(seed + i);
            // Random grade points between 6 and 10
            idealPoints = 6 + randVal * 4;
        }

        // Clamp to valid grade points
        idealPoints = Math.max(6, Math.min(10, idealPoints));

        // Snap to nearest valid grade point (6, 7, 8, 9, or 10)
        let bestPoints = Math.round(idealPoints);
        bestPoints = Math.max(6, Math.min(10, bestPoints));

        assignedPoints.push(bestPoints);
        runningWeighted += bestPoints * sub.credits;
    }

    // Final adjustment pass: nudge grades to get closer to target SGPA
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

    // Build table
    const tbody = document.getElementById('resultsBody');
    tbody.innerHTML = '';
    let totalCreditsSum = 0;
    let totalWeighted = 0;

    semSubjects.forEach((sub, i) => {
        const pts = assignedPoints[i];
        const gradeInfo = gradeScale.find(g => g.points === pts) || { grade: 'B', points: 6 };
        const row = document.createElement('tr');
        const gradeClass = 'grade-pass';
        row.innerHTML =
            '<td>' + (i + 1) + '</td>' +
            '<td>' + sub.code + '</td>' +
            '<td>' + sub.name + '</td>' +
            '<td>' + sub.credits + '</td>' +
            '<td class="' + gradeClass + '">' + gradeInfo.grade + '</td>' +
            '<td>' + pts + '</td>';
        tbody.appendChild(row);
        totalCreditsSum += sub.credits;
        totalWeighted += sub.credits * pts;
    });

    const sgpa = (totalWeighted / totalCreditsSum).toFixed(2);

    document.getElementById('sgpaValue').textContent = sgpa;
    document.getElementById('creditsValue').textContent = totalCreditsSum;

    const resultEl = document.getElementById('resultStatus');
    resultEl.textContent = 'PASS';
    resultEl.className = 'value pass';
}

// ===== TOGGLE SUBJECTS TABLE =====
function toggleSubjects() {
    const section = document.getElementById('subjectsSection');
    const btn = event.target;
    if (section.classList.contains('show')) {
        section.classList.remove('show');
        btn.textContent = '📋 View Subject Marks';
    } else {
        section.classList.add('show');
        btn.textContent = '✕ Hide Subject Marks';
    }
}

// ===== BACK TO FORM =====
function goBackToForm() {
    document.getElementById('subjectsSection').classList.remove('show');
    showPage('page-form');
}

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
    const sectionDisplay = sectionInfo ? sectionInfo.section : 'N/A';

    // Populate profile card
    document.getElementById('profileBranch').textContent = fullBranchName;
    document.getElementById('profileRollNo').textContent = rollNumber;
    document.getElementById('profileSection').textContent = sectionDisplay;

    // Set student photo from GCAP
    const photoUrl = 'https://griet.in/gcap/photosrgb/' + rollNumber.toUpperCase() + '.JPG';
    document.getElementById('photoLoader').style.display = 'flex';
    document.getElementById('profilePhoto').style.display = 'none';
    document.getElementById('profilePhoto').src = photoUrl;

    // Hide results area initially
    document.getElementById('profileResultsArea').style.display = 'none';
    document.getElementById('semesterDetailArea').style.display = 'none';

    // Calculate overall CGPA and Credits
    let totalCredits = 0;
    let totalWeighted = 0;
    let sem1Credits = 0;

    // Check all semesters available in branchSubjects for this branch
    const bData = branchSubjects[branch] || {};
    for (const sem in bData) {
        const result = computeSemesterSgpa(rollNumber, branch, sem);
        if (result && result.totalCredits > 0) {
            totalCredits += result.totalCredits;
            totalWeighted += (result.sgpa * result.totalCredits);

            // Only save the 1-1 semester credits for the display table
            if (sem === '1-1') {
                sem1Credits = result.totalCredits;
            }
        }
    }

    let cgpa = 0;
    if (totalCredits > 0) {
        cgpa = (totalWeighted / totalCredits).toFixed(2);
    }

    // Base backlogs on a deterministic random check so they stay visually consistent
    let hasBacklogs = seededRandom(hashString(rollNumber + "backlogs")) > 0.85; // 15% chance of backlogs
    let backlogsCount = hasBacklogs ? Math.floor(seededRandom(hashString(rollNumber + "count")) * 3) + 1 : 0;

    // Update the Current Details UI
    document.getElementById('currentCredits').textContent = sem1Credits || 0;
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
