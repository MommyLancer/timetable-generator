let teachers = [];
let breaks = [];

document.getElementById('themeSwitch').addEventListener('change', () => {
  document.body.classList.toggle('dark');
});

function addTeacher() {
  const name = document.querySelector('.teacher-name').value;
  const subject = document.querySelector('.teacher-subject').value;
  const className = document.querySelector('.teacher-class').value;

  if (name && subject && className) {
    teachers.push({ name, subject, class: className, isAbsent: false });
    displayTeachers();
    clearInputs();
  }
}

function clearInputs() {
  document.querySelector('.teacher-name').value = '';
  document.querySelector('.teacher-subject').value = '';
  document.querySelector('.teacher-class').value = '';
}

function displayTeachers() {
  const list = document.getElementById('teacherList');
  list.innerHTML = '';
  teachers.forEach((t, i) => {
    const div = document.createElement('div');
    div.innerHTML = `
      ${t.name} | ${t.subject} | ${t.class}
      <label>Absent?</label>
      <input type="checkbox" onchange="toggleAbsent(${i})" ${t.isAbsent ? 'checked' : ''} />
    `;
    list.appendChild(div);
  });
}

function toggleAbsent(index) {
  teachers[index].isAbsent = !teachers[index].isAbsent;
}

function addBreakInput() {
  const multi = document.getElementById('multiBreak').value;
  const setup = document.getElementById('breakSetup');
  setup.innerHTML = '';

  if (multi === 'yes') {
    const numInput = document.createElement('input');
    numInput.placeholder = 'How many breaks?';
    numInput.type = 'number';
    numInput.id = 'breakCount';
    setup.appendChild(numInput);

    const btn = document.createElement('button');
    btn.innerText = 'Add Break Timings';
    btn.onclick = () => {
      const count = parseInt(document.getElementById('breakCount').value);
      for (let i = 0; i < count; i++) {
        const b = document.createElement('input');
        b.placeholder = `Break ${i + 1} timing (e.g. 3)`;
        b.classList.add('break-time');
        setup.appendChild(b);

        const who = document.createElement('input');
        who.placeholder = `Break for (e.g. Girls, Primary)`;
        who.classList.add('break-who');
        setup.appendChild(who);
      }
    };
    setup.appendChild(btn);
  } else {
    const single = document.createElement('input');
    single.placeholder = 'Break after which period? (e.g. 4)';
    single.classList.add('break-time');
    setup.appendChild(single);
  }
}

function generateTimetables() {
  const periods = parseInt(document.getElementById('periodCount').value);
  const periodTimingStr = document.getElementById('periodTimings').value;
  const periodTimings = periodTimingStr.split(',').map(p => p.trim());
  const breakTimes = Array.from(document.querySelectorAll('.break-time')).map(b => parseInt(b.value));
  const breakWhos = Array.from(document.querySelectorAll('.break-who')).map(w => w.value.trim());

  breaks = breakTimes.map((time, i) => ({ period: time, for: breakWhos[i] || 'All' }));

  const classes = [...new Set(teachers.map(t => t.class))];
  const output = document.getElementById('timetableResults');
  output.innerHTML = '';

  // Class-wise Timetables
  const classSection = document.createElement('div');
  classSection.innerHTML = `<h3>Class-wise Timetables</h3>`;
  classes.forEach(cls => {
    const table = generateTable(periods, periodTimings, cls, 'class');
    classSection.appendChild(table);
  });

  // Teacher-wise Timetables
  const teacherSection = document.createElement('div');
  teacherSection.innerHTML = `<h3>Teacher-wise Timetables</h3>`;
  teachers.forEach(t => {
    const table = generateTable(periods, periodTimings, t.name, 'teacher');
    teacherSection.appendChild(table);
  });

  output.appendChild
