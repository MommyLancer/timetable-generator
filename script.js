let teachers = [];
let periods = [];
let breaks = [];

function generatePeriodInputs() {
  const num = parseInt(document.getElementById('numPeriods').value);
  const container = document.getElementById('periodInputs');
  container.innerHTML = '';
  for (let i = 1; i <= num; i++) {
    const input = document.createElement('input');
    input.placeholder = `Period ${i} (e.g., 8:00 - 8:40)`;
    input.className = 'periodTime';
    container.appendChild(input);
  }
}

function addSubjectClassRow() {
  const row = document.createElement('div');
  row.className = 'subject-class-row';
  row.innerHTML = `
    <input type="text" placeholder="Subject" class="subject" />
    <input type="text" placeholder="Class" class="class" />
  `;
  document.getElementById('subjectClassInputs').appendChild(row);
}

function saveTeacher() {
  const name = document.getElementById('teacherName').value;
  const subjectInputs = document.querySelectorAll('.subject');
  const classInputs = document.querySelectorAll('.class');

  const entries = [];
  for (let i = 0; i < subjectInputs.length; i++) {
    if (subjectInputs[i].value && classInputs[i].value) {
      entries.push({
        subject: subjectInputs[i].value,
        class: classInputs[i].value
      });
    }
  }

  if (name && entries.length > 0) {
    teachers.push({ name, entries });
    displayTeacherList();
    document.getElementById('teacherName').value = '';
    document.getElementById('subjectClassInputs').innerHTML = `
      <div class="subject-class-row">
        <input type="text" placeholder="Subject" class="subject" />
        <input type="text" placeholder="Class" class="class" />
      </div>
    `;
  }
}

function displayTeacherList() {
  const container = document.getElementById('teacherList');
  container.innerHTML = '<h3>Teachers Added:</h3>';
  teachers.forEach(teacher => {
    const div = document.createElement('div');
    div.innerHTML = `<strong>${teacher.name}</strong>: ${teacher.entries.map(e => `${e.subject} - ${e.class}`).join(', ')}`;
    container.appendChild(div);
  });
}

function showBreakInputs() {
  const count = parseInt(document.getElementById('breakCount').value);
  const container = document.getElementById('breakInputs');
  container.innerHTML = '';
  for (let i = 1; i <= count; i++) {
    const label = document.createElement('label');
    label.textContent = `Break ${i} Timing & Group (e.g., 10:00 - 10:15, Girls Primary)`;
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'breakTime';
    container.appendChild(label);
    container.appendChild(input);
  }
}

function generateTimetable() {
  periods = Array.from(document.querySelectorAll('.periodTime')).map(p => p.value);
  breaks = Array.from(document.querySelectorAll('.breakTime')).map(b => b.value);

  const result = document.getElementById('timetableResults');
  result.innerHTML = `<h2>Generated Timetables</h2><p>(Mock output for now)</p>`;
  result.innerHTML += `<pre>${JSON.stringify({ periods, teachers, breaks }, null, 2)}</pre>`;
}

document.getElementById('themeSwitch').addEventListener('change', function () {
  document.body.classList.toggle('dark-mode');
});
