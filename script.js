let periods = [];
let breaks = [];
let teachers = [];
let classes = [];
let subjects = [];

function createPeriodInputs() {
    const numberOfPeriods = document.getElementById('numberOfPeriods').value;
    const periodInputs = document.getElementById('periodInputs');
    periodInputs.innerHTML = '';
    periods = [];

    for (let i = 1; i <= numberOfPeriods; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Period ${i} Timing (e.g., 8:00-8:40)`;
        input.id = `period-${i}`;
        periodInputs.appendChild(input);
        periods.push(`period-${i}`);
    }
}

function createBreakInputs() {
    const numberOfBreaks = document.getElementById('numberOfBreaks').value;
    const breakInputs = document.getElementById('breakInputs');
    breakInputs.innerHTML = '';
    breaks = [];

    for (let i = 1; i <= numberOfBreaks; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Break ${i} after which period?`;
        input.id = `break-${i}`;
        breakInputs.appendChild(input);
        breaks.push(`break-${i}`);
    }
}

function addTeacher() {
    const teacherName = document.getElementById('teacherName').value.trim();
    if (!teacherName) return alert('Enter Teacher Name.');

    if (subjects.length === 0 || classes.length === 0) {
        alert("Please first enter Subjects and Classes!");
        return;
    }

    const teacherDiv = document.createElement('div');
    teacherDiv.className = 'teacher-entry';
    
    const subjectSelect = document.createElement('select');
    subjects.forEach(sub => {
        const opt = document.createElement('option');
        opt.value = sub.trim();
        opt.innerText = sub.trim();
        subjectSelect.appendChild(opt);
    });

    const classSelect = document.createElement('select');
    classes.forEach(cls => {
        const opt = document.createElement('option');
        opt.value = cls.trim();
        opt.innerText = cls.trim();
        classSelect.appendChild(opt);
    });

    teacherDiv.innerHTML = `<strong>${teacherName}</strong> teaches `;
    teacherDiv.appendChild(subjectSelect);
    teacherDiv.innerHTML += ' to ';
    teacherDiv.appendChild(classSelect);
    
    const editBtn = document.createElement('button');
    editBtn.innerText = 'Edit';
    editBtn.onclick = () => {
        subjectSelect.disabled = !subjectSelect.disabled;
        classSelect.disabled = !classSelect.disabled;
    };
    teacherDiv.appendChild(editBtn);

    document.getElementById('teacherList').appendChild(teacherDiv);

    teachers.push({
        name: teacherName,
        subjectSelect: subjectSelect,
        classSelect: classSelect
    });

    document.getElementById('teacherName').value = '';
}

function generateTimetable() {
    const schoolName = document.getElementById('schoolName').value;
    const schoolLogoFile = document.getElementById('schoolLogo').files[0];
    const teacherWiseDiv = document.getElementById('teacherWise');
    const classWiseDiv = document.getElementById('classWise');
    const schoolHeader = document.getElementById('schoolHeader');

    classes = document.getElementById('classesInput').value.split(',').map(c => c.trim());
    subjects = document.getElementById('subjectsInput').value.split(',').map(s => s.trim());

    teacherWiseDiv.innerHTML = '';
    classWiseDiv.innerHTML = '';
    schoolHeader.innerHTML = '';

    if (schoolName) {
        const schoolHeading = document.createElement('h2');
        schoolHeading.innerText = schoolName;
        schoolHeader.appendChild(schoolHeading);
    }

    if (schoolLogoFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = "School Logo";
            img.style.maxWidth = "100px";
            schoolHeader.appendChild(img);
        };
        reader.readAsDataURL(schoolLogoFile);
    }

    // Teacher Wise Table
    const teacherTable = document.createElement('table');
    let headerRow = '<tr><th>Teacher</th>';
    periods.forEach((p, idx) => {
        const time = document.getElementById(p).value;
        headerRow += `<th>${idx + 1} (${time})</th>`;
    });
    headerRow += '</tr>';
    teacherTable.innerHTML += headerRow;

    teachers.forEach(t => {
        let row = `<tr><td>${t.name}</td>`;
        periods.forEach(() => {
            row += `<td>${t.classSelect.value} - ${t.subjectSelect.value}</td>`;
        });
        row += '</tr>';
        teacherTable.innerHTML += row;
    });

    teacherWiseDiv.innerHTML = `<h3>Teacher Wise Timetable</h3>`;
    teacherWiseDiv.appendChild(teacherTable);

    // Class Wise Table
    const classTable = document.createElement('table');
    let classHeader = '<tr><th>Class</th>';
    periods.forEach((p, idx) => {
        const time = document.getElementById(p).value;
        classHeader += `<th>${idx + 1} (${time})</th>`;
    });
    classHeader += '</tr>';
    classTable.innerHTML += classHeader;

    classes.forEach(cls => {
        let row = `<tr><td>${cls}</td>`;
        periods.forEach(() => {
            let found = teachers.find(t => t.classSelect.value === cls);
            row += `<td>${found ? found.name + ' (' + found.subjectSelect.value + ')' : '-'}</td>`;
        });
        row += '</tr>';
        classTable.innerHTML += row;
    });

    classWiseDiv.innerHTML = `<h3>Class Wise Timetable</h3>`;
    classWiseDiv.appendChild(classTable);
}

function downloadPDF() {
    window.print();
}
