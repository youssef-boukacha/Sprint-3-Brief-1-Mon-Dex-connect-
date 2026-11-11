const Base_URL ="https://pokeapi.co/api/v2/pokemon?limit=20&offset=0";
let data ="";
export  async function Creatures()    {

    const response = await fetch(Base_URL) 
      
    if (response.ok) {
        
      data = await response.json()
    }
getCreatures(data)
}


async function getCreatures (data)    {
const pokemons_data = data.results;
pokemons_data.map( async (pokemon) => {
   const response = await fetch (pokemon.url) 
    if (response.ok){
        const data = await response.json();
}
    
await promise.all(data)
})

   


}