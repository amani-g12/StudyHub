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

    renderUpcomingAssignments();
    renderTasks();
}




function showAssignments() {
    mainContent.innerHTML = `

    <h2>Assignments</h2>

    <button id="add-assignment-button">Add Assignment</button>

    <div class="assignment-filters">

        <label>

            Course:
            <select id="course-filter">
                <option value="All">All Courses</option>
            </select>

        </label>

         <label>

            Status:
            <select id="status-filter">
                <option value="All">All</option>
                <option value="Incomplete">Incomplete</option>
                <option value="Completed">Completed</option>
            </select>

        </label>

        <label>

            Priority:
            <select id="priority-filter">
                <option value="All">All</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>

        </label>

    </div>

    <div class="assignment-list" id="assignment-list"></div>
    `;

    const addAssignmentButton = document.getElementById("add-assignment-button");

    addAssignmentButton.addEventListener("click", function() {
        showAssignmentForm();
    });


    populateCourseFilter();

    const courseFilter = document.getElementById("course-filter");
    const statusFilter = document.getElementById("status-filter");
    const priorityFilter = document.getElementById("priority-filter");

    courseFilter.addEventListener("change", renderAssignments);
    statusFilter.addEventListener("change", renderAssignments);
    priorityFilter.addEventListener("change", renderAssignments);

    renderAssignments();
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


function populateCourseFilter() {

    const courseFilter = document.getElementById("course-filter");

    const uniqueCourses = [];

    for (const assignment of assignments) {

        if (!uniqueCourses.includes(assignment.course)) {
            uniqueCourses.push(assignment.course);
        }
    }


    for (const course of uniqueCourses) {
        
        const option = document.createElement("option");

        option.value = course;
        option.textContent = course;

        courseFilter.appendChild(option);
    }
}

function renderUpcomingAssignments() {

    const assignmentList = document.getElementById("assignment-list");

    assignmentList.innerHTML = "";


    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 6);


    const upcomingAssignments = assignments.filter(function(assignment) {

        const dueDate = new Date(assignment.dueDate + "T00:00:00");
        
        
        return !assignment.completed && 
               dueDate >= today &&
               dueDate <= nextWeek; /*To make sure that the assignments 
               displayed on dashboard are omly ones that are due within the next week.*/
    });


    upcomingAssignments.sort(function(a,b) {

        return new Date(a.dueDate + "T00:00:00") - new Date(b.dueDate + "T00:00:00");

    });


    for (const assignment of upcomingAssignments) {

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

        assignmentList.appendChild(assignmentElement);
    }
}


function renderAssignments(){

    const assignmentList = document.getElementById("assignment-list");

    assignmentList.innerHTML = "";

    const courseFilter = document.getElementById("course-filter");
    const statusFilter = document.getElementById("status-filter");
    const priorityFilter = document.getElementById("priority-filter");

    const selectedCourse = courseFilter.value;
    const selectedStatus = statusFilter.value;
    const selectedPriority = priorityFilter.value;


    const filteredAssignments = assignments.filter(function(assignment) {

        const courseMatches = 
        selectedCourse === "All" || 
        assignment.course === selectedCourse;

        const statusMatches = 
        selectedStatus === "All" ||
        (selectedStatus === "Completed" && assignment.completed) ||
        (selectedStatus === "Incomplete" && !assignment.completed);

        const priorityMatches = 
        selectedPriority === "All" ||
        assignment.priority === selectedPriority;

        return courseMatches && statusMatches && priorityMatches;

    });



    for (const assignment of filteredAssignments) {

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
            <button class="delete-assignment">Delete</button>
            <button class="edit-assignment">Edit</button>
        `;

        const checkbox = assignmentElement.querySelector("input");
        
        const deleteButton = assignmentElement.querySelector(".delete-assignment");
        const editButton = assignmentElement.querySelector(".edit-assignment");

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

            localStorage.setItem("assignments", JSON.stringify(assignments));
        });


        deleteButton.addEventListener("click", function() {

            const userConfirm = confirm("Are you sure you would like to delete?");

            if(!userConfirm){
                return;
            }

            assignments = assignments.filter(function(item) {
                return item.id !== assignment.id;
            });

            localStorage.setItem("assignments", JSON.stringify(assignments));

            showAssignments();
        });
        

        editButton.addEventListener("click", function() {
            showEditAssignmentForm(assignment);
        });


        assignmentList.appendChild(assignmentElement);
    }
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

            id: Date.now(),
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


function showEditAssignmentForm(assignment) {

     mainContent.innerHTML = `
        <h2>Edit Assignment</h2>

        <form id="edit-assignment-form" novalidate>

            <label>Assignment Name</label>
            <input type="text" id="edit-assignment-name" value="${assignment.name}">

            <label>Course</label>
            <input type="text" id="edit-assignment-course" value="${assignment.course}">

            <label>Due Date</label>
            <input type="date" id="edit-assignment-due-date" value="${assignment.dueDate}">

            <label>Weight (%)</label>
            <input type="number" id="edit-assignment-weight" value="${assignment.weight}">

            <label>Priority</label>
            <select id="edit-assignment-priority">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>

            <label>Notes</label>
            <textarea id="edit-assignment-notes">${assignment.notes}</textarea>

            <button type="submit">Save changes</button>

        </form>
    `;

    const editAssignmentForm = document.getElementById("edit-assignment-form");

    editAssignmentForm.addEventListener("submit", function(event) {


        event.preventDefault();

        const name = document.getElementById("edit-assignment-name").value.trim();
        const course = document.getElementById("edit-assignment-course").value.trim();
        const dueDate = document.getElementById("edit-assignment-due-date").value;
        const weight = document.getElementById("edit-assignment-weight").value;
        const priority = document.getElementById("edit-assignment-priority").value;
        const notes = document.getElementById("edit-assignment-notes").value.trim();

        if (name === "" || course === "" || dueDate === "" || weight === ""){
            alert("Please fill in all of the required fields.");
            return;
        }

        assignment.name = name;
        assignment.course = course;
        assignment.dueDate = dueDate;
        assignment.weight = Number(weight);
        assignment.priority = priority;
        assignment.notes = notes;


        localStorage.setItem("assignments", JSON.stringify(assignments));

        showAssignments();

    });
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

