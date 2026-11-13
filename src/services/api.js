export  async function Creatures(offset = 0)    {

    const Base_URL =`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`;
try { 
    const response = await fetch(Base_URL) 
    

   
    if (!response.ok) { 
        throw new Error("Failed to fetch Pokémon");

}
 const data = await response.json();
    
 
      return await getCreatures(data);
}
catch (error){
    console.error(error)
throw error;
}

    }
    



async function getCreatures (info)    {
   try {
    const pokemons_result = info.results;
const result = await Promise.all( 

    pokemons_result.map( async (pokemon) => {
   const response = await fetch (pokemon.url) 
    if (!response.ok){
       throw new Error ("Failed to fetch Pokémon: " + pokemon.name);
    
    }
    
    const pokemons_data_objects = await response.json();

    const pokemoneObjectDetails= 
    {
        id: pokemons_data_objects.id,
        name: pokemons_data_objects.name,
        type: pokemons_data_objects.types[0].type.name,
        stats: pokemons_data_objects.stats,
        image: pokemons_data_objects.sprites.front_default
    };

    return pokemoneObjectDetails
})
)
return result;

 } 
 catch (error){
    console.error("Error fetching pokemon details:", error);
    throw error;
 }
}