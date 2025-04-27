let subjects = [
  "Urdu", "English", "Pakistan Studies", "Islamiat (Compulsory)",
  "Computer Science", "Biology", "Physics", "Chemistry",
  "Mathematics", "General Mathematics", "Economics", "Education",
  "Islamiat (Elective)", "General Science", "Islamiat", "Nazra"
];
let classes = [
  "6th A", "6th B", "7th A", "7th B",
  "8th A1", "8th A2", "8th B1", "8th B2",
  "9th A1", "9th A2", "9th B1", "9th B2",
  "10th A1", "10th A2", "10th B"
];
let periods = [];
let breaks = [];
let teachers = [];

function displaySubjects() {
  const subjectList = document.getElementById('subjectList');
  subjectList.innerHTML = '';
  subjects.forEach(sub => {
    const div = document.createElement('div');
    div.innerText = sub;
    subjectList.appendChild(div);
  });
}

function addSubject() {
  const newSubject = prompt('Enter new subject name:');
  if (newSubject) {
    subjects.push(newSubject);
    displaySubjects();
  }
}

function displayClasses() {
  const classList = document.getElementById('classList');
  classList.innerHTML = '';
  classes.forEach(cls => {
    const div = document.createElement('div');
    div.innerText = cls;
    classList.appendChild(div);
  });
}

function addClass() {
  const newClass = prompt('Enter new class-section name:');
  if (newClass) {
    classes.push(newClass);
    displayClasses();
  }
}

function generatePeriodInputs() {
  const num = parseInt(document.getElementById('numPeriods').value);
  const container = document.getElementById('periodInputs');
  container.innerHTML = '';
  periods = [];
  for (let i = 1; i <= num; i++) {
    const input = document.createElement('input');
    input.placeholder = `Timing for Period ${i}`;
    input.type = 'text';
    input.id = `period${i}`;
    container.appendChild(input);
    container.appendChild(document.createElement('br'));
  }
}

function generateBreakInputs() {
  const num = parseInt(document.getElementById('numBreaks').value);
  const container = document.getElementById('breakInputs');
  container.innerHTML = '';
  breaks = [];
  for (let i = 1; i <= num; i++) {
    const div = document.createElement('div');
    div.innerHTML = `
      Break ${i} after Period Number: 
      <input type="number" id="breakAfter${i}" min="1">
    `;
    container.appendChild(div);
  }
}

function addTeacher() {
  const container = document.getElementById('teacherInputs');
  
  const teacherDiv = document.createElement('div');
  teacherDiv.className = "teacher-entry";

  const nameInput = document.createElement('input');
  nameInput.placeholder = 'Teacher Name';
  
  const assignDiv = document.createElement('div');
  assignDiv.className = 'assignment-area';

  const addAssignBtn = document.createElement('button');
  addAssignBtn.innerText = "+ Assign Subject/Class";
  addAssignBtn.type = "button";
  addAssignBtn.onclick = () => {
    const selectSubject = document.createElement('select');
    subjects.forEach(sub => {
      const option = document.createElement('option');
      option.value = sub;
      option.innerText = sub;
      selectSubject.appendChild(option);
    });

    const selectClass = document.createElement('select');
    classes.forEach(cls => {
      const option = document.createElement('option');
      option.value = cls;
      option.innerText = cls;
      selectClass.appendChild(option);
    });

    assignDiv.appendChild(selectSubject);
    assignDiv.appendChild(selectClass);
    assignDiv.appendChild(document.createElement('br'));
  };

  teacherDiv.appendChild(nameInput);
  teacherDiv.appendChild(assignDiv);
  teacherDiv.appendChild(addAssignBtn);
  container.appendChild(teacherDiv);
}

function generateTimetables() {
  const schoolName = document.getElementById('schoolName').value;
  const schoolLogo = document.getElementById('schoolLogo').files[0];

  document.getElementById('schoolNameDisplay').innerText = schoolName;

  if (schoolLogo) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('schoolLogoDisplay').src = e.target.result;
      document.getElementById('schoolLogoDisplay').style.display = "block";
    };
    reader.readAsDataURL(schoolLogo);
  }

  // Collect Periods
  const periodInputs = document.querySelectorAll('[id^="period"]');
  periods = [];
  periodInputs.forEach(input => periods.push(input.value));

  // Collect Breaks
  const breakInputs = document.querySelectorAll('[id^="breakAfter"]');
  breaks = [];
  breakInputs.forEach(input => breaks.push(parseInt(input.value)));

  // Collect Teachers
  teachers = [];
  const teacherEntries = document.querySelectorAll('.teacher-entry');
  teacherEntries.forEach(entry => {
    const name = entry.querySelector('input').value;
    const assignments = [];
    const selects = entry.querySelectorAll('select');
    for (let i = 0; i < selects.length; i += 2) {
      assignments.push({
        subject: selects[i].value,
        class: selects[i+1].value
      });
    }
    teachers.push({ name, assignments });
  });

  document.getElementById('output').style.display = 'block';

  generateClassWise();
  generateTeacherWise();
}

function generateClassWise() {
  const container = document.getElementById('classWiseTimetable');
  container.innerHTML = '';

  classes.forEach(cls => {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    const th = document.createElement('th');
    th.innerText = `Class: ${cls}`;
    th.colSpan = periods.length + 1;
    headRow.appendChild(th);
    thead.appendChild(headRow);

    const periodRow = document.createElement('tr');
    const emptyTh = document.createElement('th');
    periodRow.appendChild(emptyTh);
    periods.forEach((p, idx) => {
      const periodTh = document.createElement('th');
      periodTh.innerText = `${idx+1} (${p})`;
      periodRow.appendChild(periodTh);
    });
    thead.appendChild(periodRow);

    const tbody = document.createElement('tbody');
    const row = document.createElement('tr');
    const classCell = document.createElement('td');
    classCell.innerText = cls;
    row.appendChild(classCell);

    periods.forEach((p, idx) => {
      const cell = document.createElement('td');

      let found = false;
      teachers.forEach(t => {
        t.assignments.forEach(a => {
          if (a.class === cls) {
            if (!found) {
              cell.innerText = shortForm(a.subject) + ` (${t.name})`;
              found = true;
            }
          }
        });
      });

      if (!found) {
        if (breaks.includes(idx+1)) {
          cell.innerText = "Break";
          cell.style.backgroundColor = "yellow";
        } else {
          cell.innerText = "-";
        }
      }

      row.appendChild(cell);
    });

    tbody.appendChild(row);
    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);
    container.appendChild(document.createElement('br'));
  });
}

function generateTeacherWise() {
  const container = document.getElementById('teacherWiseTimetable');
  container.innerHTML = '';

  teachers.forEach(t => {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    const th = document.createElement('th');
    th.innerText = `Teacher: ${t.name}`;
    th.colSpan = periods.length + 1;
    headRow.appendChild(th);
    thead.appendChild(headRow);

    const periodRow = document.createElement('tr');
    const emptyTh = document.createElement('th');
    periodRow.appendChild(emptyTh);
    periods.forEach((p, idx) => {
      const periodTh = document.createElement('th');
      periodTh.innerText = `${idx+1} (${p})`;
      periodRow.appendChild(periodTh);
    });
    thead.appendChild(periodRow);

    const tbody = document.createElement('tbody');
    const row = document.createElement('tr');
    const teacherCell = document.createElement('td');
    teacherCell.innerText = t.name;
    row.appendChild(teacherCell);

    periods.forEach((p, idx) => {
      const cell = document.createElement('td');

      const assigned = t.assignments[idx];
      if (assigned) {
        cell.innerText = shortForm(assigned.subject) + ` (${assigned.class})`;
      } else {
        if (breaks.includes(idx+1)) {
          cell.innerText = "Break";
          cell.style.backgroundColor = "yellow";
        } else {
          cell.innerText = "-";
        }
      }

      row.appendChild(cell);
    });

    tbody.appendChild(row);
    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);
    container.appendChild(document.createElement('br'));
  });
}

function shortForm(subject) {
  return subject.split(' ').map(word => word[0]).join('').toUpperCase();
}

function downloadPDF() {
  window.print();
  }
