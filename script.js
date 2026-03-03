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
        }

        // ===== LOGIN =====
        function doLogin() {
            const loginId = document.getElementById('loginId').value.trim();
            const loginPassword = document.getElementById('loginPassword').value.trim();
            const errorDiv = document.getElementById('loginError');

            // Validate login ID: must start with 25241a/25241A followed by 4 alphanumeric chars
            const idRegex = /^25241a[a-zA-Z0-9]{4}$/i;
            // Validate password: must be DDMMYYYY format
            const pwRegex = /^\d{8}$/;

            if (!loginId || !idRegex.test(loginId) || !loginPassword || !pwRegex.test(loginPassword)) {
                errorDiv.textContent = 'Invalid Credentials';
                errorDiv.style.display = 'block';
                return;
            }

            const day = parseInt(loginPassword.substring(0, 2));
            const month = parseInt(loginPassword.substring(2, 4));
            const year = parseInt(loginPassword.substring(4, 8));
            if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2025) {
                errorDiv.textContent = 'Invalid Credentials';
                errorDiv.style.display = 'block';
                return;
            }

            errorDiv.style.display = 'none';
            currentUser = loginId.toUpperCase();
            document.getElementById('welcomeUser').textContent = currentUser;
            document.getElementById('welcomeUser2').textContent = currentUser;
            document.getElementById('hallticket').value = loginId;
            showPage('page-form');
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
            const viewType = document.getElementById('viewType').value;
            const branch = document.getElementById('branch').value;
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
            if (!branch) {
                alert('Please select a Branch.');
                return;
            }
            if (!semester) {
                alert('Please select a Semester.');
                return;
            }

            // Show student info
            document.getElementById('studentInfo').innerHTML =
                'Hallticket: <strong>' + hallticket.toUpperCase() + '</strong> | ' +
                'Branch: <strong>' + branch + '</strong> | ' +
                'Exam Type: <strong>' + examType + '</strong> | ' +
                'Semester: <strong>' + semester + '</strong>';

            // Generate sample results
            generateSampleResults(branch, semester);
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
            }
        };

        // ===== GENERATE RESULTS =====
        function generateSampleResults(branch, semester) {
            const defaultSubjects = [
                { code: 'SUB01', name: 'Subject 1', credits: 4, grade: 'A', points: 9 },
                { code: 'SUB02', name: 'Subject 2', credits: 3, grade: 'A+', points: 10 },
                { code: 'SUB03', name: 'Subject 3', credits: 3, grade: 'B+', points: 8 },
                { code: 'SUB04', name: 'Subject 4', credits: 3, grade: 'A', points: 9 },
                { code: 'SUB05', name: 'Subject 5', credits: 3, grade: 'A', points: 9 },
                { code: 'SUB06', name: 'Subject 6 Lab', credits: 2, grade: 'A+', points: 10 }
            ];

            const branchData = branchSubjects[branch] || {};
            const semSubjects = branchData[semester] || defaultSubjects;

            // Build table
            const tbody = document.getElementById('resultsBody');
            tbody.innerHTML = '';
            let totalCredits = 0;
            let totalWeighted = 0;

            semSubjects.forEach((sub, i) => {
                const row = document.createElement('tr');
                const gradeClass = (sub.grade === 'F') ? 'grade-fail' : 'grade-pass';
                row.innerHTML =
                    '<td>' + (i + 1) + '</td>' +
                    '<td>' + sub.code + '</td>' +
                    '<td>' + sub.name + '</td>' +
                    '<td>' + sub.credits + '</td>' +
                    '<td class="' + gradeClass + '">' + sub.grade + '</td>' +
                    '<td>' + sub.points + '</td>';
                tbody.appendChild(row);
                totalCredits += sub.credits;
                totalWeighted += sub.credits * sub.points;
            });

            const sgpa = (totalWeighted / totalCredits).toFixed(2);
            const allPass = semSubjects.every(s => s.grade !== 'F');

            document.getElementById('sgpaValue').textContent = sgpa;
            document.getElementById('creditsValue').textContent = totalCredits;

            const resultEl = document.getElementById('resultStatus');
            if (allPass) {
                resultEl.textContent = 'PASS';
                resultEl.className = 'value pass';
            } else {
                resultEl.textContent = 'FAIL';
                resultEl.className = 'value fail';
            }
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
