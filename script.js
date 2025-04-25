
function toggleBreakInputs() {
  const isMultiple = document.getElementById("multipleBreaks").value;
  document.getElementById("breakConfig").style.display = (isMultiple === "yes") ? "block" : "none";
}

function generateBreakInputs() {
  const container = document.getElementById("breakInputsContainer");
  container.innerHTML = '';
  const count = parseInt(document.getElementById("breakCount").value);

  for (let i = 1; i <= count; i++) {
    container.innerHTML += `
      <div style="margin-bottom:15px; border-bottom: 1px solid #ccc; padding-bottom:10px;">
        <label><strong>Break ${i}</strong></label><br>
        <label>Time (e.g. 10:15 AM):</label>
        <input type="text" id="breakTime_${i}" placeholder="10:15 AM"><br>
        <label>Duration (minutes):</label>
        <input type="number" id="breakDuration_${i}" min="1" required><br>
        <label>Group (e.g. Boys, Girls, Primary):</label>
        <input type="text" id="breakGroup_${i}" required>
      </div>
    `;
  }
}
