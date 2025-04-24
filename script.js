// Updated teachers' data with real names
const teachers = [
    { name: "Ali", subjects: ["Math", "Science"], available: ["1", "2", "3"] },
    { name: "Sara", subjects: ["English", "History"], available: ["2", "3", "4"] },
    { name: "Ahmed", subjects: ["Chemistry"], available: ["1", "4", "5"] }
];

// Function to check if a teacher is available at a specific time
function isTeacherAvailable(teacherName, period) {
    const teacher = teachers.find(t => t.name === teacherName);
    return teacher ? teacher.available.includes(period) : false;
}

// Function to assign a substitute teacher if the main teacher is absent
function assignSubstituteTeacher(absentTeacherName, period) {
    const availableTeachers = teachers.filter(t => isTeacherAvailable(t.name, period) && t.name !== absentTeacherName);
    
    if (availableTeachers.length > 0) {
        const substitute = availableTeachers[Math.floor(Math.random() * availableTeachers.length)];
        return substitute.name; // Returning a random available teacher as the substitute
    }
    return null; // No substitute available
}

// Example function to generate timetable and handle absences
function generateTimetable(classes) {
    classes.forEach(classItem => {
        classItem.teachers.forEach(teacher => {
            if (!isTeacherAvailable(teacher.name, classItem.period)) {
                const substitute = assignSubstituteTeacher(teacher.name, classItem.period);
                console.log(`${teacher.name} is absent. Assigning substitute: ${substitute}`);
            } else {
                console.log(`${teacher.name} is teaching ${classItem.subject} at period ${classItem.period}`);
            }
        });
    });
}

// Example classes (assuming timetable contains class, subject, teacher, and period info)
const classes = [
    { subject: "Math", teachers: [{ name: "Ali" }], period: "1" },
    { subject: "History", teachers: [{ name: "Sara" }], period: "2" },
    { subject: "Chemistry", teachers: [{ name: "Ahmed" }], period: "3" }
];

// Call the function to generate the timetable and handle absences
generateTimetable(classes);
