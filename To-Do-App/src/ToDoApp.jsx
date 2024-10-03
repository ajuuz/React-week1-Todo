import React, { useState, useEffect, useRef, createElement } from "react";

function ToDoApp() {
  const [newTask, setNewTask] = useState("");
  const [obj,setObj]=useState({})
  const [editTask,setEditTask]=useState()
const [dltConfiramtionIndex,setDelConfirmationIndex] = useState(null);
const [dltSelectedCompTaskBoolean,setDltSelectedCompTaskBoolean] = useState(false)

// useRef

const errRef = useRef();

const storedCompletedTask = JSON.parse(localStorage.getItem("completedTasks")) || [];
const [completedTasksArray,setCompletedTaskArray] = useState(storedCompletedTask)

useEffect(()=>{
    localStorage.setItem("completedTasks",JSON.stringify(completedTasksArray));
    // console.log(completedTasksArray.length);
    // console.log(completedTasksArray);
},[completedTasksArray])

const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
const [tasks, setTasks] = useState(storedTasks);

useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);


  const storedSelectedCompTask = JSON.parse(localStorage.getItem("selectedTasks")) || {};
  const [dltSelectedCompTask,setDltSelectedCompTask] = useState(storedSelectedCompTask); 
  useEffect(()=>{
    localStorage.setItem("selectedTasks",JSON.stringify(dltSelectedCompTask))
    console.log(dltSelectedCompTask);
  },[dltSelectedCompTask])

  function handleAddTask() {
    if (newTask.trim() !== "") {
    setNewTask("");
    setObj({...obj,[Object.keys(obj).length]:false})
      setTasks([...tasks, newTask]);
    }
    else
    {
      errRef.current.style.visibility="visible"
      errRef.current.style.transform = "translate(0px,20px)"
     setTimeout(()=>{
      errRef.current.style.visibility="hidden"
     },500)
     
      setTimeout(()=>{
      errRef.current.style.transform = "translate(0px,0px)"
      },1000)
    }
  }

  function handleCompleteTask(e, index,task) {
    const completedTask=[index,task]
    setDltSelectedCompTask({...dltSelectedCompTask,[Object.keys(completedTasksArray).length]:false})
    setTimeout(() => {
    setCompletedTaskArray([...completedTasksArray,completedTask])
}, 500);
    e.target.checked = true;
    setTimeout(() => {
      setTasks(tasks.filter((_, i) => i !== index));
      e.target.checked = false;
    }, 500);
  }
  function handleMoveUpTask(index, task) {
    if (index === 0) {
      setTasks([...tasks]);
    } else {
      tasks.splice(index, 1);
      tasks.splice(index - 1, 0, task);
      setTasks([...tasks]);
    }
  }
  function handleMoveDownTask(index, task) {
    if (index === tasks.length - 1) {
      setTasks([...tasks]);
    } else {
      tasks.splice(index, 1);
      tasks.splice(index + 1, 0, task);
      setTasks([...tasks]);
    }
  }
  function handlechangeInp(e) {
    setNewTask(e.target.value);
  }


  function  handleDeleteCompletely(e,index){
    setDelConfirmationIndex(index);
setTimeout(()=>{
    const delConfirmDiv = document.querySelector(`.delConfirmDiv${index}`)

    const deleteConfirm = (e) =>{
        if(!delConfirmDiv.contains(e.target))
            {
                setDelConfirmationIndex(null);
               return document.removeEventListener('click',deleteConfirm)
            }

    }
    document.addEventListener('click',deleteConfirm)
        
},0)
    
  }

  function cancelDelConfirmation(){
    setDelConfirmationIndex(null)
  }

  function tickDelete(index){
    setTasks(tasks.filter((_,i)=>index!==i))
    setDelConfirmationIndex(null)
  }

  function displayEditTask(e,index,task) {
    setObj({[index]:true})
    // console.log(task);
    const editSpanInp = document.querySelector(`.editSpanInp${index}`)
    editSpanInp.value=task;
    const editInp = document.querySelector(`.editSpan${index}`);
    const editClickEventListener=(e)=>{
        if(!editInp.contains(e.target))
        {
            setObj({[index]:false})
            return document.removeEventListener('click',editClickEventListener)
        }
    }
    document.addEventListener('click',editClickEventListener)
  }

  function handleEditChangeInp(e){
    setEditTask(e.target.value);
  }

  function handleEditClick(index){
    if(editTask.trim()!=="")
    {
    tasks[index]=editTask;
    setTasks(tasks)
    setObj({[index]:false})
    localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }

function handleShowCompletedTask(){
    setDltSelectedCompTaskBoolean(false)
   let completedTaskDisplay =  document.getElementById('completedTask')
    if(completedTaskDisplay.style.display === 'none')
    {
        completedTaskDisplay.style.display = "block"
    }
    else
    {
        completedTaskDisplay.style.display = "none"
    }
}
  
function handleBacktoNotCompleted(compTask,ind){

    tasks.splice(compTask[0],0,compTask[1]);
    setTasks([...tasks])
    setCompletedTaskArray(completedTasksArray.filter((completedTask,i)=>ind!==i))
}

function clearCompletedTasks(){
    setCompletedTaskArray([]);
    setDltSelectedCompTask({})
}

function selectAnddelete(){
    // console.log("working")
    // console.log(dltSelectedCompTaskBoolean);
    if(dltSelectedCompTaskBoolean){
        // console.log("working2");
        setDltSelectedCompTaskBoolean(false)
        // console.log(dltSelectedCompTaskBoolean);
    }
    else
    {
        // console.log("working3");
        setDltSelectedCompTaskBoolean(true)
        // console.log(dltSelectedCompTaskBoolean);
    }
}

function selectCompletedTask(index){

    
    if(dltSelectedCompTask[index]===false)
        {
            // console.log("working");
            console.log(dltSelectedCompTask);
            dltSelectedCompTask[index]= true;
        }
        else
        {
            // console.log("working2");
            console.log(dltSelectedCompTask);
        dltSelectedCompTask[index]= false;
     
    }
}

function clickdelSelectedCompTask(){
    const compTaskEntries = Object.entries(dltSelectedCompTask);
    // console.log(compTaskEntries);
    const onlyTrue = compTaskEntries.filter((onlytrue)=>onlytrue[1]===true)
    const onlyFalse = compTaskEntries.filter((onlyfalse)=>onlyfalse[1]===false)
    // console.log(onlyTrue);
    const flatOnlyTrue = onlyTrue.flat(1);
    // console.log(flatOnlyTrue);
    const output=completedTasksArray.filter((_,i)=>!flatOnlyTrue.includes(i.toString()))
    // console.log(output);
    
    setCompletedTaskArray(output)
    // setDltSelectedCompTask(Object.fromEntries(onlyTrue))

    setTimeout(()=>{
        for(let i=0;i<completedTasksArray.length;i++)
        {
            document.querySelectorAll('.selCompCheckbox')[i].checked=false;
        }
    },0)
    
    for(let i in dltSelectedCompTask)
    {
        dltSelectedCompTask[i]=false;
    }
}

function clickToCloseSelection(){
    setDltSelectedCompTaskBoolean(false)
}

  return (
    <div className="todo-container text-center">
      <div ref={errRef} className="error-box text-red-700 p-2 px-10 border-red-500  rounded-lg m-0 border">
        task cannot be blank
      </div>
      <div className="flex justify-center">
      <img className="logo" src="/src/assets/planify_logo.svg" alt="Planify Logo" />
      </div>
      <div>
        <input
        placeholder="Add a new task..."
          type="text"
          className="border rounded-lg border-solid pt-2 pb-[10px] px-10 me-2"
          value={newTask}
          onChange={handlechangeInp}
        />
          <i onClick={handleAddTask} className="add-button border-2 text-green-400 border-green-400  hover:bg-green-400  rounded-lg pt-3 pb-3 px-4 fa-solid fa-plus hover:text-white"></i>
      </div>
      
      <table className="border m-auto my-10 ">
        <thead>
          <tr>
            <th className="py-5 px-20"></th>
            <th className="py-5 px-20">TASK</th>
            <th className="py-5 px-20">MoveUp</th>
            <th className="py-5 px-20">MoveDown</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr className="row p-1 relative" key={index}>
              <td className="pb-5">
                <input
                  type="checkbox"
                  id="addTask-checkbox"
                  title="tick if completed"
                  onChange={(e) => handleCompleteTask(e, index,task)}
                />
              </td>
              <td className="pb-5">
                <span style={{display:obj[index]?'block':'none'}}  className={`editSpan${index} absolute top-0`}>
                  <input type="text" className={`editSpanInp${index} border w-[130px]`} onChange={handleEditChangeInp}/>
                  <i class="fa-solid fa-circle-check ms-2 text-green-500 text-md" onClick={()=>handleEditClick(index)}></i>
                </span>
                <span className="absolute top-0 cursor-pointer" title="Double tap to Edit" onDoubleClick={(e) => displayEditTask(e,index,task)} style={{display:obj[index]?'none':'block'}}>
                  {task}
                </span>
              </td>
              <td className="pb-5">
                <button onClick={() => handleMoveUpTask(index, task)}>
                  <i class="move-up fa-solid fa-circle-up text-xl text-gray-600"></i>
                </button>
              </td>
              <td className="pb-5">
                <button onClick={() => handleMoveDownTask(index, task)}>
                  <i class="move-down fa-solid fa-circle-down text-xl text-gray-600"></i>
                </button>
              </td>
              <td className={`pb-5 pe-10`}>
                
                {dltConfiramtionIndex != index?
                (<button  onClick={(e) => handleDeleteCompletely(e,index)}>
                <i title="delete the task" class="delete fa-solid fa-trash text-red-500 hover:text-red-600"></i>
                </button>):(
                    <div className={`delConfirmDiv${index}`}>
                    <i onClick={()=>tickDelete(index)} class="fa-solid fa-check text-green-600"></i>
                    <i onClick={cancelDelConfirmation} class="fa-solid fa-xmark ms-3 text-red-600"></i>
                    </div>
                )}
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <span onClick={handleShowCompletedTask} className="cursor-pointer font-serif text-2xl font-bold">Completion Zone</span>
    {dltSelectedCompTaskBoolean === false?(<>
      <span onClick={selectAnddelete} className="bg-red-600 text-white p-2 ms-3 rounded-xl cursor-pointer"><i title="delete the task" class="fa-solid fa-trash me-1"></i> Selected</span>
        <span onClick={clearCompletedTasks} className="bg-red-600 text-white p-2 ms-3 rounded-xl cursor-pointer"><i title="delete the task" class="fa-solid fa-trash me-1"></i>All</span>
    </>):(
        <>
        <button onClick={clickdelSelectedCompTask}><i title="delete the task" class="fa-solid fa-trash ms-10 text-red-600"></i></button>
        <i onClick={clickToCloseSelection} class="fa-solid fa-xmark ms-10 text-green-600"></i>
        </>
)}
      <ul id='completedTask' className="border w-[30rem] mt-5 m-auto" style={{display:'none'}}>
        {completedTasksArray.map((compTask,ind)=>
        <li key={ind}>
            { dltSelectedCompTaskBoolean === false?
            (<span className="cursor-pointer" title="not completed? then double tap!!" onDoubleClick={()=>handleBacktoNotCompleted(compTask,ind)}><del>{compTask[1]}</del></span>)
            :(
            <div>
                <div className="w-[50%] ms-auto  flex justify-between">
            <span className="cursor-pointer" title="not completed? then double tap!!" onDoubleClick={()=>handleBacktoNotCompleted(compTask,ind)}><del>{compTask[1]}</del></span>
            <input type="checkbox" onChange={()=>selectCompletedTask(ind)} className="selCompCheckbox me-2" name="" id="" />
                </div>
            </div>
            )
            }
        </li>)}
      </ul>
    </div>
  );
}

export default ToDoApp;
