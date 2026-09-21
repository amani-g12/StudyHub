const mainContent = document.getElementById("main-content");
const dashboardLink = document.getElementById("dashboard-link");
const coursesLink = document.getElementById("courses-link");
const assignmentsLink = document.getElementById("assignments-link");
const calendarLink = document.getElementById("calendar-link");
let currentCalendarDate = new Date();

let selectedCourseFilter = "All";
let selectedStatusFilter = "All";
let selectedPriorityFilter = "All";



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
          <button class="add-task-button" id="add-task-button">+ Add Task</button>
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

            <div class="priority-filter">
                Priority:
                <select id="priority-filter">
                    <option value="All">All</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>

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

    courseFilter.value = selectedCourseFilter;
    statusFilter.value = selectedStatusFilter;
    priorityFilter.value = selectedPriorityFilter;


    courseFilter.addEventListener("change", function() {
        selectedCourseFilter = courseFilter.value;
        renderAssignments();
    });

    statusFilter.addEventListener("change", function() {
        selectedStatusFilter = statusFilter.value;
        renderAssignments();
    });

    priorityFilter.addEventListener("change", function() {
        selectedPriorityFilter = priorityFilter.value;
        renderAssignments();
    });

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

            <button class="add-exam-button" id="add-exam-button">Add Exam</button>
        </div>
    `;

    const addExamButton = document.getElementById("add-exam-button");

    addExamButton.addEventListener("click", function() {
        showExamForm();
    });

    renderCalendar();

    const previousMonthButton = document.getElementById("previous-month");
    const nextMonthButton = document.getElementById("next-month");

    previousMonthButton.addEventListener("click", function() {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthButton.addEventListener("click", function(){
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
        renderCalendar();
    });
}



// COURSES PAGE 

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

            <button class="edit-course">
                <img src="images/edit-icon.svg" alt="Edit">
            </button>

            <button class="delete-course">
                <img src="images/delete-icon.svg" alt="Delete">
            </button>
        `;

        const editButton = courseElement.querySelector(".edit-course");
        const deleteButton = courseElement.querySelector(".delete-course");


        editButton.addEventListener("click", function() {
            showCourseForm(course);

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

function showCourseForm(courseToEdit = null) {

    mainContent.innerHTML = `
        <h2>${courseToEdit ? "Edit Course" : "Add Course"}</h2>

        <form id="course-form" novalidate>

            <label>Course Code</label>
            <input type="text" id="course-code"
                value="${courseToEdit ? courseToEdit.code : ""}">

            <label>Course Name</label>
            <input type="text" id="course-name"
                value="${courseToEdit ? courseToEdit.name : ""}">

            <button type="submit" class="save-course-button">
                ${courseToEdit ? "Save Changes" : "Add Course"}
            </button>

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

        if (courseToEdit) {

            courseToEdit.code = code;
            courseToEdit.name = name;

        } else {

            const newCourse = {

                id: Date.now(),
                code: code,
                name: name
            }

            courses.push(newCourse);
        }

        localStorage.setItem("courses", JSON.stringify(courses));

        showCourses();

    });
}




// ASSIGNMENTS PAGE

let assignments = JSON.parse(localStorage.getItem("assignments")) || [];


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

        return new Date(a.dueDate + "T" + a.dueTime) - new Date(b.dueDate + "T" + b.dueTime);

    });


    for (const assignment of upcomingAssignments) {

        const assignmentElement = document.createElement("div");

        assignmentElement.classList.add("assignment");

        assignmentElement.innerHTML = `
            <input type="checkbox">
            <span class="course">${assignment.course}</span>
            <span class="assignment-name">${assignment.name}</span>
            <span class="weight">${assignment.weight}%</span>
            <span class="due-date">
                ${formatDate(assignment.dueDate)} - ${formatTime(assignment.dueTime)}
            </span>
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

    filteredAssignments.sort(function(a,b) {
        return new Date(a.dueDate + "T00:00:00") - new Date(b.dueDate + "T00:00:00");
    })



    for (const assignment of filteredAssignments) {

        const assignmentElement = document.createElement("div");

        assignmentElement.classList.add("assignment");


        assignmentElement.innerHTML = `
            <input type="checkbox">
            <span class="course">${assignment.course}</span>
            <span class="assignment-name">${assignment.name}</span>
            <span class="weight">${assignment.weight}%</span>
            <span class="due-date">
                ${formatDate(assignment.dueDate)} - ${formatTime(assignment.dueTime)}
            </span>
            <span class="priority">${assignment.priority}</span>
            <span class="notes">${assignment.notes}</span>

            <button class="delete-assignment">
                <img src="images/delete-icon.svg" alt="Delete">
            </button>

            <button class="edit-assignment">
                <img src="images/edit-icon.svg" alt="Edit">
            </button>

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
            showAssignmentForm(assignment);
        });


        assignmentList.appendChild(assignmentElement);
    }
}


function showAssignmentForm(assignmentToEdit = null) {

    mainContent.innerHTML = `
        <h2>${assignmentToEdit ? "Edit Assignment" : "Add Assignment"}</h2>

        <form id="assignment-form" novalidate>

            <label>Assignment Name</label>
            <input type="text" id="assignment-name" value="${assignmentToEdit ? assignmentToEdit.name : ""}">

            <label>Course</label>
            <select id="assignment-course">
                <option value="">Select a course</option>
            </select>

            <label>Due Date</label>
            <input type="date" id="assignment-due-date" value="${assignmentToEdit ? assignmentToEdit.dueDate : ""}">

            <label>Due Time</label>
            <input type="time" id="assignment-due-time" value="${assignmentToEdit ? assignmentToEdit.dueTime : ""}">

            <label>Weight (%)</label>
            <input type="number" id="assignment-weight" value="${assignmentToEdit ? assignmentToEdit.weight : ""}">

            <label class="priority-field">Priority</label>
            <select class="priority-field" id="assignment-priority">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>

            <label>Notes</label>
            <textarea id="assignment-notes">${assignmentToEdit ? assignmentToEdit.notes : ""}</textarea>

            <button type="submit" class="save-assignment-button">
                ${assignmentToEdit ? "Save changes" : "Add Assignment"}
            </button>

        </form>
    `;

    const assignmentForm = document.getElementById("assignment-form");

    const prioritySelect = document.getElementById("assignment-priority");

    const courseSelect = document.getElementById("assignment-course");

    for (const course of courses) {

        const option = document.createElement("option");

        option.value = course.code;
        option.textContent = `${course.code} - ${course.name}`;

        courseSelect.appendChild(option);
    }

    if(assignmentToEdit) {
        courseSelect.value = assignmentToEdit.course;
        prioritySelect.value = assignmentToEdit.priority;
    }


    assignmentForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("assignment-name").value.trim();
        const course = document.getElementById("assignment-course").value.trim();
        const dueDate = document.getElementById("assignment-due-date").value;
        const dueTime = document.getElementById("assignment-due-time").value;
        const weight = document.getElementById("assignment-weight").value;
        const priority = document.getElementById("assignment-priority").value;
        const notes = document.getElementById("assignment-notes").value.trim();

        //If no due time is entered, assume 11:59 PM is due time
        const finalDueTime = dueTime === "" ? "23:59" : dueTime;

        if (name === "" || course === "" || dueDate === "" || weight === ""){
            alert("Please fill in all of the required fields.");
            return;
        }

        if(assignmentToEdit) {
            assignmentToEdit.name = name;
            assignmentToEdit.course = course;
            assignmentToEdit.dueDate = dueDate;
            assignmentToEdit.dueTime = finalDueTime;
            assignmentToEdit.weight = Number(weight);
            assignmentToEdit.priority = priority;
            assignmentToEdit.notes = notes;

        } else {

            const newAssignment = {

                id: Date.now(),
                name: name,
                course: course,
                dueDate: dueDate,
                dueTime: finalDueTime,
                weight: Number(weight),
                priority: priority,
                completed: false,
                notes: notes
            }
            assignments.push(newAssignment);
        }

        localStorage.setItem("assignments", JSON.stringify(assignments));

        showAssignments();

        });
}


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


function formatDate(dateString) {

    const date = new Date (dateString + "T00:00:00");


    return date.toLocaleDateString("en-CA", {
        month: "short",
        day: "numeric"
    });
}


function formatTime(timeString) {
    const [hours, minutes] = timeString.split(":");

    const date = new Date();
    date.setHours(hours, minutes);

    return date.toLocaleTimeString("en-CA", {
        hour: "numeric",
        minute: "2-digit"
    });
}



// TASKS

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
            <button class="edit-task">
                <img src="images/edit-icon.svg" alt="Edit">
            </button>
            <button class="delete-task">
                <img src="images/delete-icon.svg" alt="Delete">
            </button>
        `;

        const checkbox = taskElement.querySelector("input");
        const editButton = taskElement.querySelector(".edit-task");
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

        editButton.addEventListener("click", function() {
            showTaskForm(task);
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


function showTaskForm(taskToEdit = null) {

    mainContent.innerHTML = `
        <h2>${taskToEdit ? "Edit Task" : "Add Task"}</h2>

        <form id="task-form" novalidate>

            <label>Course</label>
            <select id="task-course">
                <option value="">Select a course</option>
            </select>

            <label>Due Date</label>
            <input type="date" id="task-due-date"
                value="${taskToEdit ? taskToEdit.dueDate : ""}">

            <label>Task</label>
            <input type="text" id="task-description"
                value="${taskToEdit ? taskToEdit.description : ""}">

            <button type="submit" class="add-new-task-button">
                ${taskToEdit ? "Save Changes" : "Add Task"}
            </button>

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

    if (taskToEdit) {
        courseSelect.value = taskToEdit.course;
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

        if (taskToEdit) {

            taskToEdit.course = course;
            taskToEdit.dueDate = dueDate;
            taskToEdit.description = description;

        } else {

            const newTask = {

                id: Date.now(),
                course: course,
                dueDate: dueDate,
                description: description,
                completed: false
            }

            tasks.push(newTask);
        }

        localStorage.setItem("tasks", JSON.stringify(tasks));

        showDashboard();

    });
}



// CALENDAR 

function renderCalendar() {

    const calendarGrid = document.getElementById("calendar-grid");
    const calendarMonth  = document.getElementById("calendar-month");

    calendarGrid.innerHTML = "";

    const year = currentCalendarDate.getFullYear();

    //JS months are indexed from 0 to 11
    const month = currentCalendarDate.getMonth(); 

    const monthName = currentCalendarDate.toLocaleDateString("en-CA", {
        month: "long",
        year: "numeric"
    });

    calendarMonth.textContent = monthName;

    const firstDay = new Date(year, month, 1).getDay();

    const daysInMonth = new Date(year, month+1, 0).getDate();  /*the 0th day of October - JS interprets 
    that as the day immediately before Oct 1s which is sept 30.*/


    /*To add empty spaces before Day 1 of the month*/

    for (let i = 0; i < firstDay; i++) {

        const emptyDay = document.createElement("div");

        emptyDay.classList.add("calendar-day", "empty");

        calendarGrid.appendChild(emptyDay);
    }


    for (let day = 1; day <= daysInMonth; day++) {

        const dayElement = document.createElement("div");

        dayElement.classList.add("calendar-day");

        dayElement.textContent = day;

        const today = new Date();

       if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
       ) {
            dayElement.classList.add("today");
       }

       //Check if the day we're creating has any exam scheduled for that date

       const calendarDate = new Date(year, month, day).toLocaleDateString("en-CA"); //date being created 

       const dayExams = exams.filter(function(exam) {
            return exam.date === calendarDate;
       });

       const dayAssignments = assignments.filter(function(assignment) {
            return assignment.dueDate === calendarDate;
       });



       for (const exam of dayExams) {
        
        const examElement = document.createElement("div");

        examElement.classList.add("calendar-exam");

        examElement.innerHTML = `
            <strong>${exam.course}</strong>
            <span>${exam.name}</span>
            <span class="exam-weight">${exam.weight}%</span>
        `;

        examElement.addEventListener("click", function() {
            showExamDetails(exam);
        });


        dayElement.appendChild(examElement);
       }

       
       for (const assignment of dayAssignments) {
        
        const assignmentElement = document.createElement("div");

        assignmentElement.classList.add("calendar-assignment");

        assignmentElement.innerHTML = `
            <strong>${assignment.course}</strong>
            <span>${assignment.name}</span>
        `;

        assignmentElement.addEventListener("click", function() {
            console.log("assingment clicked", assignment);
            showAssignmentDetails(assignment);
        });


        dayElement.appendChild(assignmentElement);
       }


        calendarGrid.appendChild(dayElement);
    }
}

function showAssignmentDetails (assignment) {

    console.log("show assignment details started");

    const assignmentDetails = document.createElement("div");

    assignmentDetails.classList.add("assignment-modal");


    assignmentDetails.innerHTML = `
        
        <div class="assignment-card">

            <button class="close-assignment-button" id="close-assignment-button">x</button>
    
            <div class="assignment-card-header">
                <span class="assignment-course">${assignment.course}</span>
                <h2>${assignment.name}</h2>
            </div>


            <div class="assignment-details">

                <div class="assignment-detail">
                    <span class="detail-label">Due Date</span>
                    <span>${formatDate(assignment.dueDate)}</span>
                </div>

                <div class="assignment-detail">
                    <span class="detail-label">Due Time</span>
                    <span>${formatTime(assignment.dueTime)}</span>
                </div>

                <div class="assignment-detail">
                    <span class="detail-label">Weight</span>
                    <span>${assignment.weight}%</span>
                </div>

                <div class="assignment-detail">
                    <span class="detail-label">Status</span>
                    <span>${assignment.completed ? "Completed" : "Incomplete"}</span>
                </div>

            </div>

            <div class="assignment-notes">
                <span class="detail-label">Notes</span>
                <p>${assignment.notes || "No notes"}</p>
            </div>


            <div class="assignment-actions">

                <button class="edit-assignment" id="edit-assignment">
                    <img src="images/edit-icon.svg" alt="Edit">
                </button>

                <button class="delete-assignment" id="delete-assignment">
                    <img src="images/delete-icon.svg" alt="Delete">
                </button>

            </div>

        </div>
    `

    document.body.appendChild(assignmentDetails);

    console.log("Modal added to page");

    const closeButton = document.getElementById("close-assignment-button");

    closeButton.addEventListener("click", function() {
        assignmentDetails.remove();
    });

    const editButton = document.getElementById("edit-assignment");
    const deleteButton = document.getElementById("delete-assignment");

    editButton.addEventListener("click", function() {
        assignmentDetails.remove();
        showAssignmentForm(assignment);
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

        assignmentDetails.remove();

        renderCalendar();
    })

}


// EXAMS

let exams = JSON.parse(localStorage.getItem("exams")) || [];

function showExamForm(examToEdit = null) { /*optional parameter, when we do send in something, the form 
    knows we're editing an already existing exam, otherwise, we add a new exam */

    mainContent.innerHTML = `
        <h2>${examToEdit ? "Edit Exam" : "Add Exam"}</h2>

        <form id="exam-form" novalidate>


            <label>Course</label>
            <select id="exam-course">
                <option value="">Select a course</option>
            </select>

            <label>Name</label>
            <input type="text" id="exam-name" value="${examToEdit ? examToEdit.name : ""}">

            <label>Date</label>
            <input type="date" id="exam-date" value="${examToEdit ? examToEdit.date : ""}">

            <label>Time</label>
            <input type="time" id="exam-time" value="${examToEdit ? examToEdit.time : ""}">

            <label>Weight (%)</label>
            <input type="number" id="exam-weight" value="${examToEdit ? examToEdit.weight : ""}">

            <label>Location</label>
            <input type="text" id="exam-location" value="${examToEdit ? examToEdit.location : ""}">

            <button type="submit" class="save-exam-button">
                ${examToEdit ? "Save changes" : "Add Exam"}
            </button>

        </form>
    `;


    const examForm = document.getElementById("exam-form");

    const courseSelect = document.getElementById("exam-course");

    for (const course of courses) {

        const option = document.createElement("option");

        option.value = course.code;
        option.textContent = `${course.code} - ${course.name}`;

        courseSelect.appendChild(option);
    }

    if (examToEdit) {
        courseSelect.value = examToEdit.course;
    }


    examForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const course = document.getElementById("exam-course").value.trim();
        const name = document.getElementById("exam-name").value.trim();
        const date = document.getElementById("exam-date").value;
        const time = document.getElementById("exam-time").value;
        const weight = document.getElementById("exam-weight").value;
        const location = document.getElementById("exam-location").value.trim();

        if (course === "" || name === "" || date === "" || weight === ""){
            alert("Please fill in all of the required fields.");
            return;
        }

        if (examToEdit) {
            examToEdit.name = name;
            examToEdit.course = course;
            examToEdit.date = date;
            examToEdit.time = time;
            examToEdit.weight = Number(weight);
            examToEdit.location = location;     

        } else {

            const newExam = {

                id: Date.now(),
                course: course,
                name: name,
                date: date,
                weight: Number(weight),
                time: time,
                location: location
            }
            exams.push(newExam);
        }

        localStorage.setItem("exams", JSON.stringify(exams));

        showCalendar();

        });
}


function showExamDetails (exam) {

    const examDetails = document.createElement("div");

    examDetails.classList.add("exam-modal");

    examDetails.innerHTML = `
        
        <div class="exam-card">

            <button class="close-exam-button" id="close-exam-button">x</button>
    
            <div class="exam-card-header">
                <span class="exam-course">${exam.course}</span>
                <h2>${exam.name}</h2>
            </div>


            <div class="exam-details">

                <div class="exam-detail">
                    <span class="detail-label">Date</span>
                    <span>${formatDate(exam.date)}</span>
                </div>

                <div class="exam-detail">
                    <span class="detail-label">Time</span>
                    <span>${exam.time === "" ? "TBD" : formatTime(exam.time)}</span>
                </div>

                <div class="exam-detail">
                    <span class="detail-label">Weight</span>
                    <span>${exam.weight}%</span>
                </div>

                <div class="exam-detail">
                    <span class="detail-label">Location</span>
                    <span>${exam.location === "" ? "TBD" : exam.location}</span>
                </div>

            </div>


            <div class="exam-actions">

                <button class="edit-exam" id="edit-exam">
                    <img src="images/edit-icon.svg" alt="Edit">
                </button>

                <button class="delete-exam" id="delete-exam">
                    <img src="images/delete-icon.svg" alt="Delete">
                </button>

            </div>

        </div>
    `

    document.body.appendChild(examDetails);

    const closeButton = document.getElementById("close-exam-button");

    closeButton.addEventListener("click", function() {
        examDetails.remove();
    });

    const editButton = document.getElementById("edit-exam");
    const deleteButton = document.getElementById("delete-exam");

    editButton.addEventListener("click", function() {
        examDetails.remove();
        showExamForm(exam);
    });


    deleteButton.addEventListener("click", function() {
        
        const userConfirm = confirm("Are you sure you would like to delete?");

        if(!userConfirm){
            return;
        }

        exams = exams.filter(function(item) {
            return item.id !== exam.id;
        });

        localStorage.setItem("exams", JSON.stringify(exams));

        examDetails.remove();

        renderCalendar();
    })

}


showDashboard();

