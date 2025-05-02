let teachers = [];
let classes = [
  "6th A", "6th B", "7th A", "7th B", "8th A1", "8th A2", "8th B1", "8th B2",
  "9th A1", "9th A2", "9th B1", "9th B2", "10th A1", "10th A2", "10th B"
];
let subjects = [
  "Urdu", "English", "Pakistan Studies", "Islamiat (Compulsory)", "Computer Science", "Biology",
  "Physics", "Chemistry", "Mathematics", "General Mathematics", "Economics", "Education",
  "Islamiat (Elective)", "General Science", "Islamiat", "Nazra"
];
let periodTimings = [
  "8:00-8:40", "8:40-9:20", "9:20-10:00", "10:00-10:40", "10:40-11:20",
  "11:20-12:00", "12:00-12:40", "12:40-1:20", "1:20-2:00"
];
let classTimetable = {};
let teacherTimetable = {};
let breakInfo = [];

function initDropdowns() {
  const subjectList = document.getElementById("subject-list");
  const classList = document.getElementById("class-list");
  subjectList.innerHTML = "";
  classList.innerHTML = "";

  subjects.forEach((subj) => {
    const option = document.createElement("option");
    option.value = subj;
    option.innerText = subj;
    subjectList.appendChild(option);
  });

  classes.forEach((cls) => {
    const option = document.createElement("option");
    option.value = cls;
    option.innerText = cls;
    classList.appendChild(option);
  });
}

function addSubjectClassRow() {
  const container = document.getElementById("subject-class-container");
  const div = document.createElement("div");
  div.classList.add("subject-class-row");
  div.innerHTML = `
    <select class="subject-select">
      ${subjects.map(subj => `<option value="${subj}">${subj}</option>`).join("")}
    </select>
    <select class="class-select">
      ${classes.map(cls => `<option value="${cls}">${cls}</option>`).join("")}
    </select>
    <button onclick="this.parentElement.remove()">Remove</button>
  `;
  container.appendChild(div);
}

function addTeacher() {
  const nameInput = document.getElementById("teacher-name");
  const container = document.getElementById("subject-class-container");

  const name = nameInput.value.trim();
  if (!name) return alert("Enter teacher name");

  const assignments = [];
  container.querySelectorAll(".subject-class-row").forEach(row => {
    const subj = row.querySelector(".subject-select").value;
    const cls = row.querySelector(".class-select").value;
    assignments.push({ subject: subj, class: cls });
  });

  const teacher = { name, assignments };
  teachers.push(teacher);
  displayTeachers();
  nameInput.value = "";
  container.innerHTML = "";
  addSubjectClassRow();
}

function displayTeachers() {
  const list = document.getElementById("teacher-list");
  list.innerHTML = "";
  teachers.forEach((t, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${t.name} - ${t.assignments.map(a => `${a.subject} (${a.class})`).join(", ")}
      <button onclick="editTeacher(${index})">Edit</button>
      <button onclick="deleteTeacher(${index})">Delete</button>
    `;
    list.appendChild(li);
  });
}

function editTeacher(index) {
  const t = teachers[index];
  document.getElementById("teacher-name").value = t.name;
  const container = document.getElementById("subject-class-container");
  container.innerHTML = "";
  t.assignments.forEach(a => {
    const div = document.createElement("div");
    div.classList.add("subject-class-row");
    div.innerHTML = `
      <select class="subject-select">
        ${subjects.map(s => `<option value="${s}" ${s === a.subject ? "selected" : ""}>${s}</option>`).join("")}
      </select>
      <select class="class-select">
        ${classes.map(c => `<option value="${c}" ${c === a.class ? "selected" : ""}>${c}</option>`).join("")}
      </select>
      <button onclick="this.parentElement.remove()">Remove</button>
    `;
    container.appendChild(div);
  });
  teachers.splice(index, 1);
}

function deleteTeacher(index) {
  if (confirm("Delete this teacher?")) {
    teachers.splice(index, 1);
    displayTeachers();
  }
}

function generateTimetables() {
  teacherTimetable = {};
  classTimetable = {};
  teachers.forEach(teacher => {
    teacherTimetable[teacher.name] = Array(periodTimings.length).fill("-");
    teacher.assignments.forEach((a, i) => {
      const period = i % periodTimings.length;
      if (!classTimetable[a.class]) classTimetable[a.class] = Array(periodTimings.length).fill("-");
      const short = shortenSubject(a.subject);
      classTimetable[a.class][period] = `${short} (${teacher.name})`;
      teacherTimetable[teacher.name][period] = `${short} (${a.class})`;
    });
  });

  displayTimetable("class", classTimetable);
  displayTimetable("teacher", teacherTimetable);
}

function displayTimetable(type, data) {
  const container = document.getElementById(`${type}-timetable`);
  const table = document.createElement("table");
  const header = document.createElement("tr");
  header.innerHTML = `<th>${type === "class" ? "Class" : "Teacher"}</th>`;
  periodTimings.forEach((t, i) => {
    header.innerHTML += `<th>${ordinal(i + 1)}<br><span class="time">${t}</span></th>`;
  });
  table.appendChild(header);

  for (let key in data) {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${key}</td>`;
    data[key].forEach(cell => {
      const highlight = cell.toLowerCase().includes("break") ? ' class="break-cell"' : "";
      row.innerHTML += `<td${highlight}>${cell}</td>`;
    });
    table.appendChild(row);
  }

  container.innerHTML = "";
  container.appendChild(table);
}

function shortenSubject(subj) {
  const map = {
    "Science": "sci", "English": "eng", "Mathematics": "math",
    "Economics": "eco", "Pakistan Studies": "PST", "Computer Science": "comp",
    "Biology": "bio"
  };
  return map[subj] || subj;
}

function ordinal(n) {
  return n + (n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th") + " Period";
}

function toggleTheme() {
  document.body.classList.toggle("dark-theme");
}

function updatePeriodCount() {
  const count = parseInt(document.getElementById("period-count").value);
  const container = document.getElementById("period-timings");
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const input = document.createElement("input");
    input.placeholder = `Timing for period ${i + 1}`;
    input.value = periodTimings[i] || "";
    container.appendChild(input);
  }
}

function savePeriodTimings() {
  const inputs = document.getElementById("period-timings").querySelectorAll("input");
  periodTimings = Array.from(inputs).map(input => input.value || "-");
  alert("Period timings saved.");
}
