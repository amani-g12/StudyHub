const mainContent = document.getElementById("main-content");
const dashboardLink = document.getElementById("dashboard-link");
const coursesLink = document.getElementById("courses-link");
const assignmentsLink = document.getElementById("assignments-link");
const calendarLink = document.getElementById("calendar-link");



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

calendarLink.addEventListener("click", function(event){

    event.preventDefault();
    showCalendar();
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
          <button class="add-task-button" id="add-task-button">Add Task</button>
          <div class="tasks-list" id="task-list"></div>
        </section>
    
    `;

    renderUpcomingAssignments();
    renderTasks();

    const addTaskButton = document.getElementById("add-task-button");

    addTaskButton.addEventListener("click", function() {
        showTaskForm();
    });
}



function showAssignments() {
    mainContent.innerHTML = `

    <h2>Assignments</h2>

    <button class="add-assignment-button" id="add-assignment-button">Add Assignment</button>

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


function showCourses() {

    mainContent.innerHTML = `
    
        <h2>Courses</h2>

        <button class="add-course-button" id="add-course-button">Add Course</button>

        <div class="course-list" id="course-list"></div>
        
    `;

    const addCourseButton = document.getElementById("add-course-button");

    addCourseButton.addEventListener("click", function() {
        showCourseForm();
    });

    renderCourses();
    
}


function showCalendar() {
    mainContent.innerHTML = `
        <h2>Calendar</h2>

        <div class="calendar">
            <div class="calendar-header">
                <button id="previous-month">←</button>
                <h3 id="calendar-month"></h3>
                <button id="next-month">→</button>
            </div>

            <div class="calendar-weekdays">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
            </div>

            <div class="calendar-grid" id="calendar-grid"></div>
        </div>
    `;


}




/* COURSES PAGE*/


let courses = JSON.parse(localStorage.getItem("courses")) || [];

function renderCourses() {

    const courseList = document.getElementById("course-list");

    courseList.innerHTML = "";

    for (const course of courses) {

        const courseElement = document.createElement("div");

        courseElement.classList.add("course-card");

        courseElement.innerHTML = `
            <h3>${course.code}</h3>
            <p>${course.name}</p>
            <button class="edit-course">Edit</button>
            <button class="delete-course">Delete</button>
        `;
        const editButton = courseElement.querySelector(".edit-course");
        const deleteButton = courseElement.querySelector(".delete-course");


        editButton.addEventListener("click", function() {
            showEditCourseForm(course);

        });

        deleteButton.addEventListener("click", function() {
            const userConfirm = confirm(
                "Are you sure you would like to delete? \n" +
                "Deleting this course will not delete any assignments or tasks that belong to this course. \n" + 
                "Continue?");

            if(!userConfirm){
                return;
            }

            courses = courses.filter(function(item) {
                return item.id !== course.id;
            });

            localStorage.setItem("courses", JSON.stringify(courses));

            showCourses();

        });

        

        courseList.appendChild(courseElement);

    }

}


function showCourseForm () {

    
    mainContent.innerHTML = `
        <h2>Add Course</h2>

        <form id="course-form" novalidate>


            <label>Course Code</label>
            <input type="text" id="course-code">

            <label>Course Name</label>
            <input type="text" id="course-name">


            <button type="submit">Add Course</button>

        </form>
    `;

    const courseForm = document.getElementById("course-form");

    courseForm.addEventListener("submit", function(event) {


        event.preventDefault();

        const code = document.getElementById("course-code").value.trim();
        const name = document.getElementById("course-name").value.trim();

        if (code === "" || name === "") {
            alert("Please fill in all of the required fields.");
            return;
        }

        const newCourse = {

            id: Date.now(),
            code: code,
            name: name,
        }

        courses.push(newCourse);

        localStorage.setItem("courses", JSON.stringify(courses));

        showCourses();

        });

}

function showEditCourseForm (course) {

    
    mainContent.innerHTML = `
        <h2>Edit Course</h2>

        <form id="edit-course-form" novalidate>


            <label>Course Code</label>
            <input type="text" id="edit-course-code" value="${course.code}">

            <label>Course Name</label>
            <input type="text" id="edit-course-name" value="${course.name}">


            <button type="submit">Save Changes</button>

        </form>
    `;

    const editCourseForm = document.getElementById("edit-course-form");

    editCourseForm.addEventListener("submit", function(event) {


        event.preventDefault();

        const code = document.getElementById("edit-course-code").value.trim();
        const name = document.getElementById("edit-course-name").value.trim();

        if (code === "" || name === "") {
            alert("Please fill in all of the required fields.");
            return;
        }

        course.code = code;
        course.name = name;

        localStorage.setItem("courses", JSON.stringify(courses));

        showCourses();

        });

}


/* ASSIGNMENTS */



let assignments = JSON.parse(localStorage.getItem("assignments")) || [];


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

        const checkbox = assignmentElement.querySelector("input");

        checkbox.addEventListener("change", function() {
            assignment.completed = checkbox.checked;

            localStorage.setItem("assignments", JSON.stringify(assignments));

            renderUpcomingAssignments();
    });

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
            <select id="assignment-course">
                <option value="">Select a course</option>
            </select>

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

    const courseSelect = document.getElementById("assignment-course");

    for (const course of courses) {

        const option = document.createElement("option");

        option.value = course.code;
        option.textContent = `${course.code} - ${course.name}`;

        courseSelect.appendChild(option);
    }

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


let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


function renderTasks() {

    const tasksList = document.getElementById("task-list");

    tasksList.innerHTML = "";

    const sortedTasks = [...tasks];

    sortedTasks.sort(function(a, b) {
        return new Date(a.dueDate + "T00:00:00") - new Date(b.dueDate + "T00:00:00");
    });



    const taskGroups = {};

    for (const task of sortedTasks){


        const dateGroup = getTaskDateGroup(task.dueDate);

        if(!taskGroups[dateGroup]) {

            const taskGroup = document.createElement("div");

            taskGroup.classList.add("task-group");

            taskGroup.innerHTML = `
                <h4>${dateGroup}</h4>
            `;

            tasksList.appendChild(taskGroup);

            taskGroups[dateGroup] = taskGroup;

            }


        const taskElement = document.createElement("div");
        taskElement.classList.add("task")

        taskElement.innerHTML = `
            <input type="checkbox">
            <span class="task-description">${task.description}</span>
            <span class="course">${task.course}</span>
            <span class="task-due-date">${formatDate(task.dueDate)}</span>
            <button class="delete-task">Delete</button>
        `;

        const checkbox = taskElement.querySelector("input");
        const deleteButton = taskElement.querySelector(".delete-task");

        checkbox.checked = task.completed;

        if (task.completed) {
            taskElement.classList.add("completed");
        }

        checkbox.addEventListener("change", function(){
            task.completed = checkbox.checked;

            if (task.completed){
            taskElement.classList.add("completed");
            }
            else{
                taskElement.classList.remove("completed");
            }

            localStorage.setItem("tasks", JSON.stringify(tasks));

        });

        

        deleteButton.addEventListener("click", function() {

            const userConfirm = confirm("Are you sure you would like to delete?");

            if(!userConfirm){
                return;
            }

            tasks = tasks.filter(function(item) {
                return item.id !== task.id;
            });

            localStorage.setItem("tasks", JSON.stringify(tasks));

            renderTasks();
        });

        taskGroups[dateGroup].appendChild(taskElement);

    }
}



function getTaskDateGroup(dueDate) {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const taskDate = new Date(dueDate + "T00:00:00");


    if (taskDate.getTime() === today.getTime()) {
        return "Today";
    }

    
    if (taskDate.getTime() === tomorrow.getTime()) {
        return "Tomorrow";
    }

    return "Upcoming";
}


function formatDate(dateString) {

    const date = new Date (dateString + "T00:00:00");

    let format = {
        month: "short",
        day: "numeric",
        /*year: "numeric"*/
    };

    return date.toLocaleDateString("en-CA", format);
}


function showTaskForm() {

    mainContent.innerHTML = `
        <h2>Add Task</h2>

        <form id="task-form" novalidate>


            <label>Course</label>
            <select id="task-course">
                <option value="">Select a course</option>
            </select>

            <label>Due Date</label>
            <input type="date" id="task-due-date">

            <label>Task</label>
            <input type="text" id="task-description">


            <button type="submit">Add Task</button>

        </form>
    `;

    const taskForm = document.getElementById("task-form");

    const courseSelect = document.getElementById("task-course");

    for (const course of courses) {

        const option = document.createElement("option");

        option.value = course.code;
        option.textContent = `${course.code} - ${course.name}`;

        courseSelect.appendChild(option);
    }

    taskForm.addEventListener("submit", function(event) {


        event.preventDefault();

        const course = document.getElementById("task-course").value.trim();
        const dueDate = document.getElementById("task-due-date").value;
        const description = document.getElementById("task-description").value.trim();

        if (course === "" || dueDate === "" || description === ""){
            alert("Please fill in all of the required fields.");
            return;
        }

        const newTask = {

            id: Date.now(),
            course: course,
            dueDate: dueDate,
            description: description,
            completed: false,
        }

        tasks.push(newTask);

        localStorage.setItem("tasks", JSON.stringify(tasks));

        showDashboard();

        });
}


showDashboard();

