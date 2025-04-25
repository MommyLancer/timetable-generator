let teachers = [];

document.getElementById("themeToggle").addEventListener("change", function () {
  document.body.classList.toggle("dark-theme");
});

document.getElementById("periodCount").addEventListener("input", function () {
  const count = parseInt(this.value);
  const container = document.getElementById("periodInputs");
  container.innerHTML = "";
  for (let i = 1; i <= count; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = `Period ${i} timing (e.g. 8:00-8:45)`;
    input.classList.add("period");
    container.appendChild(input);
  }
});

document.getElementById("breakOption").addEventListener("change", function () {
  const container = document.getElementById("breakDetails");
  container.innerHTML = "";

  if (this.value === "yes") {
    const breakCountInput = document.createElement("input");
    breakCountInput.type = "number";
    breakCountInput.min = 1;
    breakCountInput.placeholder = "How many breaks?";
    breakCountInput.addEventListener("input", function () {
      const breakDetails = document.createElement("div");
      breakDetails.innerHTML = "";
      container.appendChild(breakDetails);
      breakDetails.innerHTML = "";

      for (let i = 0; i < parseInt(this.value); i++) {
        const group = document.createElement("input");
        group.placeholder = "Break for (e.g. Boys, Primary)";
        const period = document.createElement("input");
        period.placeholder = "After which period (e.g. 3)";
        breakDetails.appendChild(group);
        breakDetails.appendChild(period);
        breakDetails.appendChild(document.createElement("br"));
      }
    });
    container.appendChild(breakCountInput);
  }
});

function addSubjectClass() {
  const row = document.createElement("div");
  row.classList.add("subject-class-row");
  row.innerHTML = `
    <input type="text" class="subject" placeholder="Subject">
    <input type="text" class="class" placeholder="Class">
    <button onclick="this.parentElement.remove()">Remove</button>
  `;
  document.getElementById("subjectClassList").appendChild(row);
}

function addTeacher() {
  const teacherName = document.getElementById("teacherName").value.trim();
  if (!teacherName) return alert("Enter teacher name");

  const subjects = Array.from(document.querySelectorAll(".subject-class-row")).map(row => {
    const subject = row.querySelector(".subject").value.trim();
    const cls = row.querySelector(".class").value.trim();
    return subject && cls ? { subject, class: cls } : null;
  }).filter(Boolean);

  if (subjects.length === 0) return alert("Add at least one subject-class pair");

  teachers.push({ name: teacherName, subjects });
  document.getElementById("teacherName").value = "";
  document.getElementById("subjectClassList").innerHTML = "";

  renderTeachers();
}

function renderTeachers() {
  const list = document.getElementById("teacherList");
  list.innerHTML = "";
  teachers.forEach((t, idx) => {
    const item = document.createElement("div");
    item.textContent = `${t.name}: ${t.subjects.map(s => s.subject + " - " + s.class).join(", ")}`;
    const del = document.createElement("button");
    del.textContent = "Delete";
    del.onclick = () => {
      teachers.splice(idx, 1);
      renderTeachers();
    };
    item.appendChild(del);
    list.appendChild(item);
  });
}

function generateTimetables() {
  const periodTimings = Array.from(document.querySelectorAll(".period")).map(p => p.value.trim());
  if (periodTimings.length === 0) return alert("Add period timings");

  const teacherWise = {};
  const classWise = {};

  teachers.forEach(t => {
    teacherWise[t.name] = [];
    t.subjects.forEach(s => {
      teacherWise[t.name].push(`${s.subject} → ${s.class}`);
      if (!classWise[s.class]) classWise[s.class] = [];
      classWise[s.class].push(`${s.subject} → ${t.name}`);
    });
  });

  const schoolName = document.getElementById("schoolName").value;
  const logoInput = document.getElementById("schoolLogo");
  const logo = logoInput.files[0] ? URL.createObjectURL(logoInput.files[0]) : null;

  document.getElementById("teacherWiseOutput").textContent =
    (logo ? `[LOGO] ` : "") + (schoolName ? `${schoolName}\n\n` : "") +
    Object.entries(teacherWise).map(([t, subs]) => `${t}:\n  ${subs.join("\n  ")}`).join("\n\n");

  document.getElementById("classWiseOutput").textContent =
    (logo ? `[LOGO] ` : "") + (schoolName ? `${schoolName}\n\n` : "") +
    Object.entries(classWise).map(([c, subs]) => `${c}:\n  ${subs.join("\n  ")}`).join("\n\n");
}
