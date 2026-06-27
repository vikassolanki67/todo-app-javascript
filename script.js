// ================================
// DOM SELECTION
// ================================

// Task Input Select
   const taskInput =document.querySelector("#taskInput");
   
// Date Input Select
   const expireDate =document.querySelector("#expireDate");
   let date= new Date();
   
   let year=date.getFullYear();
   let month=((date.getMonth()+1)).toString().padStart(2,"0");
   let tarik=date.getDate().toString().padStart(2,"0");
   expireDate.min= `${year}-${month}-${tarik}`;
   
// Add Button Select
   const addBtn =document.querySelector("#addBtn");
// Task Container Select
   let Container = document.querySelector(".task-list");
  
   
   
// ================================
// MAIN DATA
// ================================

// Tasks Array
// LocalStorage se data load karna hai ya empty array rakhna hai?
   let AllTasks = JSON.parse(localStorage.getItem("Alltask")) || [];


/*
================================
PAGE LOAD
================================

1. LocalStorage Read
2. Tasks Array Me Store
3. Render Function Call
*/

renderTasks();

// ================================
// RENDER FUNCTION
// ================================

/*

Purpose:

Tasks Array
    ↓
Screen Par Task Cards

Steps:

1. Container Clear
2. Loop Through Tasks Array
3. Har Task Ka Card Create
4. Card Container Me Append

*/


function renderTasks()
 {

// Container Empty
   Container.innerHTML="";
   console.log(Container);
// Loop Through Tasks
   AllTasks.forEach(element => {
            
        
      // Create Card
      
      let card = document.createElement('div');
      card.classList.add('task-card');

      let cardContant = document.createElement('div');
      cardContant.classList.add('task-content');
      
      
      // Complete Button
      let  complateButton = document.createElement('button');
      complateButton.classList.add('complete-btn');
      if(element.complated == true){
         complateButton.innerText = '✔';
      }
      else{
         complateButton.innerText = '○';
      }
      complateButton.setAttribute("data-id",element.id);

      // Task Name
      let taskInfo = document.createElement('div');
      taskInfo.classList.add('task-info');



      let taskName = document.createElement('h3');
      taskName.classList.add('task-name');

      taskName.innerText=element.taskname;

      // Delete Button
      let DeleteButton = document.createElement('button');
      DeleteButton.classList.add('delete-btn');
      
      DeleteButton.innerText='❌';
      DeleteButton.setAttribute("data-id",element.id);


      // Created Date
      let startDate = document.createElement('p');
      startDate.classList.add('start-date');

      startDate.innerText=element.StartDate;

      // Expire Date 
      let endDate = document.createElement('p');
      endDate.classList.add('end-date');

      endDate.innerText=element.ExpiredDate;


      // praents <<-- child

      // praents <<-- child {1}
      taskInfo.appendChild(taskName);
      taskInfo.appendChild(startDate);
      taskInfo.appendChild(endDate);
      
      // praents <<-- child {2}
      cardContant.appendChild(complateButton)
      cardContant.appendChild(taskInfo)

      // praents <<-- child {3}
      card.appendChild(cardContant);
      card.appendChild(DeleteButton);

      // Completed Hai To Styling
      
      if(element.complated == true){
         card.classList.add('completed');

      }
      else{}

      
      // Append Card
         
      Container.appendChild(card);
      });

      const buttons = document.querySelectorAll(".complete-btn");
      buttons.forEach(button => {
         button.addEventListener("click",()=>{
            console.log("Complete Button Clicked");
            AllTasks.forEach(element => {
            console.log(typeof button.getAttribute("data-id"));
            console.log(typeof element.id);
            console.log(button.getAttribute("data-id"), element.id);
            if(button.getAttribute("data-id")==element.id){
               if(element.complated == true){
                  element.complated =false;
               }
               else if(element.complated == false){
                  element.complated = true;
               }
            }

            });
            let Tamanna=JSON.stringify(AllTasks);
            localStorage.setItem("Alltask",Tamanna);
            renderTasks();
         })
      });

      const deleteButtons = document.querySelectorAll(".delete-btn");
      deleteButtons.forEach(button => {
         button.addEventListener("click", () => {
            AllTasks = AllTasks.filter(element => {
               return element.id != button.getAttribute("data-id")
            });
            let Tamanna=JSON.stringify(AllTasks);
            localStorage.setItem("Alltask",Tamanna);
            renderTasks();
         });
      });

}




addBtn.addEventListener("click",()=>{
    let Inputname=  taskInput.value.trim();
    let InputExpiredDate = expireDate.value;

    if(Inputname ==""&&InputExpiredDate==""){
      alert("Enter the Task And Choose the Date");
    }
    else if(Inputname==""){
      alert("Enter the Task...");
    }
    else if(InputExpiredDate==""){
      alert("Choose the Date...");
    }
    else{
         let date= new Date();
         let year=date.getFullYear();
         let month=((date.getMonth()+1)).toString().padStart(2,"0");
         let tarik=date.getDate().toString().padStart(2,"0");

         const task={
            id :Date.now(),
            taskname:Inputname,                   
            ExpiredDate:InputExpiredDate,
            StartDate:`${year}-${month}-${tarik}`,
            complated:false
         }    

         AllTasks.push(task);
         Tamanna=JSON.stringify(AllTasks);
         localStorage.setItem("Alltask",Tamanna);

         renderTasks();
      
         taskInput.value= "";
         expireDate.value = ""
      
    }


})




// ================================
// FUTURE FEATURES
// ================================

/*

Filter All

Filter Completed

Search

Edit Task

Dark Mode

*/