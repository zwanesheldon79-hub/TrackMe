let selectedDate = null;

const tasks =
JSON.parse(localStorage.getItem("trackmeTasks")) || {};

const calendar =
document.getElementById("calendar");

const monthTitle =
document.getElementById("monthTitle");

const today = new Date();

generateCalendar();

function generateCalendar(){

    calendar.innerHTML="";

    const year = today.getFullYear();
    const month = today.getMonth();

    monthTitle.innerText =
        today.toLocaleString("default",
        {month:"long",year:"numeric"});

    const days =
    new Date(year,month+1,0).getDate();

    for(let i=1;i<=days;i++){

        const dateKey =
        `${year}-${month+1}-${i}`;

        const day =
        document.createElement("div");

        day.classList.add("day");

        if(i===today.getDate()){
            day.classList.add("today");
        }

        day.innerText=i;

        day.onclick=()=>{
            selectDate(dateKey);
        }

        calendar.appendChild(day);
    }
}

function selectDate(date){

    selectedDate = date;

    document.getElementById("selectedDate").innerText = date;

    generateAutoTasks(date);

    saveTasks();

    renderTasks();
}

/**DAILY SCORE SYSTEMS */
function calculateScore(){

    if(!selectedDate || !tasks[selectedDate]) return;

    const total = tasks[selectedDate].length;

    const done = tasks[selectedDate]
        .filter(t => t.completed).length;

    document.getElementById("dailyScore").innerText =
        `Today: ${done} / ${total} tasks (${Math.round((done/total)*100)}%)`;
}

function addTask(){

    if(!selectedDate){
        alert("Select a date first");
        return;
    }

    const title =
    document.getElementById(
        "taskTitle"
    ).value;

    if(!title) return;

    const task = {

        id:Date.now(),

        title:title,

        time:
        document.getElementById(
        "taskTime").value,

        duration:
        document.getElementById(
        "taskDuration").value,

        category:
        document.getElementById(
        "taskCategory").value,

        completed:false,

        comment:""
    };

    if(!tasks[selectedDate]){
        tasks[selectedDate]=[];
    }

    tasks[selectedDate].push(task);

    saveTasks();

    renderTasks();

    document.getElementById(
    "taskTitle").value="";
}

function renderTasks(){

    const taskList =
    document.getElementById("taskList");

    taskList.innerHTML="";

    if(
      !selectedDate ||
      !tasks[selectedDate]
    ) return;

    tasks[selectedDate]
    .forEach(task=>{

        const card =
        document.createElement("div");

        card.className=
        `task-card ${task.category}`;

        card.innerHTML=`

        <h3>${task.title}</h3>

        <p>
        ${task.time || "No Time"}
        |
        ${task.duration || 0} min
        </p>

        <label>

        <input
        type="checkbox"
        ${task.completed?"checked":""}
        onchange="toggleTask(${task.id})">

        Completed

        </label>

        <textarea
        class="comment"
        placeholder="Comment..."
        onchange="saveComment(${task.id},this.value)"
        >${task.comment}</textarea>

        <button
        onclick="deleteTask(${task.id})">
        Delete
        </button>
        `;

        taskList.appendChild(card);
    });
    calculateScore();
}

function toggleTask(id){

    tasks[selectedDate]
    .forEach(task=>{

        if(task.id===id){

            task.completed=
            !task.completed;
        }
    });

    saveTasks();
    renderTasks();
}

function saveComment(id,text){

    tasks[selectedDate]
    .forEach(task=>{

        if(task.id===id){

            task.comment=text;
        }
    });

    saveTasks();
}

function deleteTask(id){

    tasks[selectedDate]=
    tasks[selectedDate]
    .filter(task=>task.id!==id);

    saveTasks();

    renderTasks();
}

function saveTasks(){

    localStorage.setItem(
        "trackmeTasks",
        JSON.stringify(tasks)
    );
}

/** DECISION ENGINE */
function suggestNextTask(){

    if(!selectedDate || !tasks[selectedDate]) return;

    const priority = ["red","green","blue","brown"];

    for(let p of priority){

        const task = tasks[selectedDate]
        .find(t => !t.completed && t.category === p);

        if(task){

            alert(
                `Do Next:\n\n${task.title}\n${task.time || ""}`
            );

            return;
        }
    }

    alert("All tasks complete. Do a brain reset.");
}

/** AUTO TASK GENERATOR */
function generateAutoTasks(dateKey){

    if(!tasks[dateKey]) tasks[dateKey] = [];

    const exists = tasks[dateKey].some(t => t.auto);

    if(exists) return;

    const baseTasks = [

        {
            title:"No Phone First Hour",
            time:"06:00",
            duration:60,
            category:"red",
            auto:true,
            completed:false,
            comment:""
        },

        {
            title:"Study Session (2x50min)",
            time:"09:00",
            duration:105,
            category:"green",
            auto:true,
            completed:false,
            comment:""
        },

        {
            title:"Business Work Session",
            time:"11:00",
            duration:105,
            category:"green",
            auto:true,
            completed:false,
            comment:""
        }
    ];

    tasks[dateKey].push(...baseTasks);
}