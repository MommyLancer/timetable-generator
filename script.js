// script.js

// Handle theme toggle
document.getElementById("toggleTheme").addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
});

// Dynamic subject & class lists
let subjects = ["Urdu", "English", "Pakistan Studies", "Islamiat (Compulsory)", "Computer Science", "Biology", "Physics", "Chemistry", "Mathematics", "General Mathematics", "Economics", "Education", "Islamiat (Elective)", "General Science", "Islamiat", "Nazra"];
let classes = ["6th A", "6th B", "7th A", "7th B", "8th A1", "8th A2", "8th B1", "8th B2", "9th A1", "9th A2", "9th B1", "9th B2", "10th A1", "10th A2", "10th B"];

function renderList(id, list, label) {
  const container = document.getElementById(id);
  container.innerHTML = `<h3>${label}</h3>`;
  list.forEach(item => {
    const el = document.createElement("div");
    el.textContent = item;
    container.appendChild(el);
  });
}

renderList("subjectList", subjects, "Subjects");
renderList("classList", classes, "Classes");

document.getElementById("addSubject").addEventListener("click", () => {
  const newSub = prompt("Enter new subject:");
  if (newSub) {
    subjects.push(newSub);
    renderList("subjectList", subjects, "Subjects");
  }
});

document.getElementById("addClass").addEventListener("click", () => {
  const newClass = prompt("Enter new class:");
  if (newClass) {
    classes.push(newClass);
    renderList("classList", classes, "Classes");
  }
});

// Period Inputs
document.getElementById("generatePeriodInputs").addEventListener("click", () => {
  const count = parseInt(document.getElementById("periodCount").value);
  const container = document.getElementById("periodInputs");
  container.innerHTML = "";
  for (let i = 1; i <= count; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = `Period ${i} time (e.g. 8:00 - 8:40)`;
    input.className = "period-time";
    container.appendChild(input);
  }
});

// Add Breaks
document.getElementById("addBreak").addEventListener("click", () => {
  const container = document.getElementById("breakDetails");
  const div = document.createElement("div");
  div.innerHTML = `Break for <input type="text" placeholder="e.g. Boys or Girls" /> at Period <input type="number" min="1" />`;
  container.appendChild(div);
});

// Add Teacher Assignments
const teacherAssignments = [];
document.getElementById("addTeacherAssignment").addEventListener("click", () => {
  const div = document.createElement("div");
  div.innerHTML = `
    Subject: <select>${subjects.map(s => `<option>${s}</option>`).join('')}</select>
    Class: <select>${classes.map(c => `<option>${c}</option>`).join('')}</select>
  `;
  document.getElementById("teacherAssignments").appendChild(div);
});

document.getElementById("saveTeacher").addEventListener("click", () => {
  const name = document.getElementById("teacherName").value;
  const entries = document.querySelectorAll("#teacherAssignments div");
  const assignments = [];
  entries.forEach(entry => {
    const subject = entry.querySelector("select:nth-child(1)").value;
    const className = entry.querySelector("select:nth-child(2)").value;
    assignments.push({ subject, className });
  });
  teacherAssignments.push({ name, assignments });
  renderTeachers();
});

function renderTeachers() {
  const container = document.getElementById("teacherList");
  container.innerHTML = "";
  teacherAssignments.forEach((t, index) => {
    const div = document.createElement("div");
    div.innerHTML = `<b>${t.name}</b>: ${t.assignments.map(a => `${a.subject} - ${a.className}`).join(", ")} <button onclick="editTeacher(${index})">Edit</button> <button onclick="deleteTeacher(${index})">Delete</button>`;
    container.appendChild(div);
  });
}

function editTeacher(index) {
  const t = teacherAssignments[index];
  const newName = prompt("Edit teacher name", t.name);
  if (newName) {
    teacherAssignments[index].name = newName;
    renderTeachers();
  }
}

function deleteTeacher(index) {
  teacherAssignments.splice(index, 1);
  renderTeachers();
}


I've added your script.js file to the canvas above. Let me know if you'd like to proceed with the style.css file next or make any changes to the JavaScript.

                                       
