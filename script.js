const teachers = [];

function addSubjectClass() {
  const container = document.getElementById('subjectClassContainer');
  const div = document.createElement('div');
  div.className = 'subject-class-entry';
  div.innerHTML = `
    <input type="text" class="subject-input" placeholder="Subject (e.g. English)" required>
    <input type="text" class="class-input" placeholder="Class (e.g. 9th B)" required>
  `;
  container.appendChild(div);
}

function saveTeacher() {
  const name = document.getElementById('teacherName').value.trim();
  if (!name) return alert("Please enter the teacher's name.");

  const subjectInputs = document.querySelectorAll('.subject-input');
  const classInputs = document.querySelectorAll('.class-input');

  const subjects = [];
  for (let i = 0; i < subjectInputs.length; i++) {
    const subject = subjectInputs[i].value.trim();
    const className = classInputs[i].value.trim();
    if (subject && className) {
      subjects.push({ subject, class: className });
    }
  }

  if (subjects.length === 0) return alert("Add at least one subject and class.");

  teachers.push({ name, subjects });

  // Reset form
  document.getElementById('teacherName').value = '';
  document.getElementById('subjectClassContainer').innerHTML = `
    <div class="subject-class-entry">
      <input type="text" class="subject-input" placeholder="Subject (e.g. English)" required>
      <input type="text" class="class-input" placeholder="Class (e.g. 9th B)" required>
    </div>
  `;

  alert('Teacher saved!');
}

function generateTeacherWise() {
  const schoolName = document.getElementById('schoolName').value.trim();
  const logoFile = document.getElementById('schoolLogo').files[0];

  let html = `<h2>${schoolName || 'Your School'}</h2>`;
  if (logoFile) {
    const logoURL = URL.createObjectURL(logoFile);
    html += `<img src="${logoURL}" alt="School Logo" class="school-logo">`;
  }

  html += `<h3>Teacher-Wise Timetable</h3><div class="timetable">`;
  teachers.forEach(teacher => {
    html += `<div class="teacher-card"><strong>${teacher.name}</strong><ul>`;
    teacher.subjects.forEach(s => {
      html += `<li>${s.subject} — ${s.class}</li>`;
    });
    html += `</ul></div>`;
  });
  html += `</div>`;
  document.getElementById('outputArea').innerHTML = html;
}

function generateClassWise() {
  const schoolName = document.getElementById('schoolName').value.trim();
  const logoFile = document.getElementById('schoolLogo').files[0];

  let html = `<h2>${schoolName || 'Your School'}</h2>`;
  if (logoFile) {
    const logoURL = URL.createObjectURL(logoFile);
    html += `<img src="${logoURL}" alt="School Logo" class="school-logo">`;
  }

  html += `<h3>Class-Wise Timetable</h3><div class="timetable">`;

  const classMap = {};
  teachers.forEach(teacher => {
    teacher.subjects.forEach(entry => {
      if (!classMap[entry.class]) {
        classMap[entry.class] = [];
      }
      classMap[entry.class].push({ subject: entry.subject, teacher: teacher.name });
    });
  });

  Object.keys(classMap).forEach(className => {
    html += `<div class="class-card"><strong>${className}</strong><ul>`;
    classMap[className].forEach(item => {
      html += `<li>${item.subject} — ${item.teacher}</li>`;
    });
    html += `</ul></div>`;
  });

  html += `</div>`;
  document.getElementById('outputArea').innerHTML = html;
}
