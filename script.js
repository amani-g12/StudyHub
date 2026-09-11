const mainContent = document.getElementById("main-content");
const dashboardLink = document.getElementById("dashboard-link");
const coursesLink = document.getElementById("courses-link");
const assignmentsLink = document.getElementById("assignments-link");



dashboardLink.addEventListener("click", function(event){

    event.preventDefault();
    showDashboard();

});


coursesLink.addEventListener("click", function(event){

    event.preventDefault();
    showCourses();

});

assignmentsLink.addEventListener("click", function(event){

    event.preventDefault();
    showAssignments();

});


function showAssignments() {
    mainContent.innerHTML = `

    <h2>Assignments</h2>

    <button id="add-assignment-button">Add Assignment</button>

    <div class="assignment-list" id="assignment-list"></div>
    `;

    const addAssignmentButton = document.getElementById("add-assignment-button");

    addAssignmentButton.addEventListener("click", function() {
        showAssignmentForm();
    });

    renderAssignments();
}


function showAssignmentForm() {
    mainContent.innerHTML = `
        <h2>Add Assignment</h2>

        <form id="assignment-form" novalidate>

            <label>Assignment Name</label>
            <input type="text" id="assignment-name">

            <label>Course</label>
            <input type="text" id="assignment-course">

            <label>Due Date</label>
            <input type="date" id="assignment-due-date">

            <label>Weight (%)</label>
            <input type="number" id="assignment-weight">

            <label>Priority</label>
            <select id="assignment-priority">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>

            <label>Notes</label>
            <textarea id="assignment-notes"></textarea>

            <button type="submit">Add Assignment</button>

        </form>
    `;

    const assignmentForm = document.getElementById("assignment-form");

    assignmentForm.addEventListener("submit", function(event) {


        event.preventDefault();

        const name = document.getElementById("assignment-name").value.trim();
        const course = document.getElementById("assignment-course").value.trim();
        const dueDate = document.getElementById("assignment-due-date").value;
        const weight = document.getElementById("assignment-weight").value;
        const priority = document.getElementById("assignment-priority").value;
        const notes = document.getElementById("assignment-notes").value.trim();

        if (name === "" || course === "" || dueDate === "" || weight === ""){
            alert("Please fill in all of the required fields.");
            return;
        }

        const newAssignment = {

            id: assignments.length + 1,
            name: name,
            course: course,
            dueDate: dueDate,
            weight: Number(weight),
            priority: priority,
            completed: false,
            notes: notes
        }
        assignments.push(newAssignment);

        localStorage.setItem("assignments", JSON.stringify(assignments));

        showAssignments();

        });




}



/* DASHBOARD PAGE*/

function showDashboard() {
    mainContent.innerHTML = `
    
        <h2>Dashboard</h2>

        <section class="upcoming">
          <h3>Upcoming</h3>

          <div class="assignment-list" id="assignment-list"></div>
        </section>

        <section class="tasks">
          <h3>Tasks</h3>
          <div class="tasks-list" id="task-list"></div>
        </section>
    
    `;

    renderAssignments();
    renderTasks();
}


/* ASSIGNMENTS */

const defaultAssignments = [
    {
        id:1,
        name: "Assignment 2",
        course: "MAT 1341",
        dueDate: "2026-09-10",
        weight: 10,
        priority: "High",
        completed: false,
        notes: "Review chapters 1 and 5"
    },

    {
        id:2,
        name: "Lab 1",
        course: "CSI 2101",
        dueDate: "2026-09-12",
        weight: 5,
        priority: "Medium",
        completed: false,
        notes: "Review lab instructions"
    },

    {
        id:3,
        name: "Lab Report",
        course: "SEG 2105",
        dueDate: "2026-09-15",
        weight: 20,
        priority: "High",
        completed: false,
        notes: "Choose a topic"
    }
];


let assignments = JSON.parse(localStorage.getItem("assignments")) || defaultAssignments;

function renderAssignments(){

    const assignmentList = document.getElementById("assignment-list");

    for (const assignment of assignments) {

        const assignmentElement = document.createElement("div");

        assignmentElement.classList.add("assignment");


        assignmentElement.innerHTML = `
            <input type="checkbox">
            <span class="course">${assignment.course}</span>
            <span class="assignment-name">${assignment.name}</span>
            <span class="weight">${assignment.weight}%</span>
            <span class="due-date">${assignment.dueDate}</span>
            <span class="priority">${assignment.priority}</span>
            <span class="notes">${assignment.notes}</span>
        `;

        const checkbox = assignmentElement.querySelector("input");

        checkbox.checked = assignment.completed;
        if (assignment.completed) {
            assignmentElement.classList.add("completed");
            }
        


        checkbox.addEventListener("change", function() {
            assignment.completed = checkbox.checked;
            if (assignment.completed){
            assignmentElement.classList.add("completed");
            }
            else{
                assignmentElement.classList.remove("completed");
            }

        });


        assignmentList.appendChild(assignmentElement);
    }
}


/* TASKS */

const tasks = [
    {
        id: 1,
        course: "MAT 1341",
        description: "Read Chapter 4",
        completed: false
    },

    {
        id: 2,
        course: "MAT 1341",
        description: "Complete practice problems",
        completed: false
    },

    {
        id: 3,
        course: "MAT 1341",
        description: "Review lecture notes",
        completed: false
    },

    {
        id: 4,
        course: "CSI 2101",
        description: "Finish lab preparation",
        completed: false
    },

    {
        id: 5,
        course: "CSI 2101",
        description: "Review lecture slides",
        completed: false
    }
];

function renderTasks() {

    const tasksList = document.getElementById("task-list");

    const taskGroups = {};

    for (const task of tasks){

        if (!taskGroups[task.course]) {
            const taskGroup = document.createElement("div");
            taskGroup.classList.add("task-group");

            taskGroup.innerHTML = `
            <h4>${task.course}</h4>
        `;

            tasksList.appendChild(taskGroup);

            taskGroups[task.course] = taskGroup;

        }

        const taskElement = document.createElement("div");
        taskElement.classList.add("task")

        taskElement.innerHTML = `
            <input type="checkbox">
            <span>${task.description}</span>
        `

        taskGroups[task.course].appendChild(taskElement);

    }

}




/* COURSES PAGE*/

const courses = [

    {
        id: 1,
        code: "MAT 1341",
        name: "Linear Algebra"
    },

    {
        id: 2,
        code: "CSI 2101",
        name: "Computer Science"
    },

    {
        id: 3,
        code: "SEG 2105",
        name: "Introduction to Software Engineering"
    },

    {
        id: 4,
        code: "CEG 2136",
        name: "Computer Architecture I"
    }

]


function showCourses() {

    mainContent.innerHTML = `
        <h2>Courses</h2>

        <div class="course-list" id="course-list"></div>
    `;

    renderCourses();
    
}


function renderCourses() {

    const courseList = document.getElementById("course-list");

    for (const course of courses) {

    const courseElement = document.createElement("div");

    courseElement.classList.add("course-card");

    courseElement.innerHTML = `
        <h3>${course.code}</h3>
        <p>${course.name}</p>
    `;

    courseList.appendChild(courseElement);

    }

}



showDashboard();

