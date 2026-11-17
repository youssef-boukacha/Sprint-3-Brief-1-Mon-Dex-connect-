const grid = document.querySelector("#grid")

export function displayCreatures (poke){
grid.innerHTML="";
poke.forEach(creature => {
    grid.innerHTML += `
            <div class="bg-white rounded-xl p-4 shadow data-id="${creature.id}"">
 
         <p>${creature.id}</p>
        
                <img
                    src="${creature.image}"
                    alt="${creature.name}"
                    class="w-24 h-24 object-contain"
                >

                <h3 class="font-bold">${creature.name}</h3>

                <p>${creature.type}</p>


            </div>
        `;

    });
}
    
    
