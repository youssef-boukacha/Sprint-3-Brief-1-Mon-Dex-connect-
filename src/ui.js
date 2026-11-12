
 export function displayCreatures(list) {
const grid = document.getElementById("grid");
console.log("hello")
   grid.innerHTML = "";

   list.forEach(function(creature) {

     grid.innerHTML += `
       <div class="card bg-white rounded-xl p-5 shadow-md " data-id="${creature.id}">
         <p>${creature.id}</p>

         <img src="${creature.image}" alt="${creature.name}">

         <div class="flex justify-between pb-6">
           <h2 class="text-xl font-bold">
             ${creature.name}
           </h2>
           <span class="bg-[#969696] rounded-xl">${creature.type}</span>
         </div>


         <button
           type="button"
           class="button add-to-team border-2 rounded-md bg-[#EBFBFF] hover:bg-sky-700 "
           data-id="${creature.id}">
           Ajouter à l'équipe
         </button>

       </div>
     `;

   });

 }