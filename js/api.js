const BaseUrl = "http://localhost:3000/creatures";


export async function getCreatures() {
    try {
        const response = await fetch(`${BaseUrl}`)
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);

        }
        const creatures = await response.json();
    return creatures ;
}
    catch (error) {   console.error("Could not load Creatures:", error); }
    
 }
getCreaturesByType('Feu')
export async function getCreaturesByType (creatures){
try {
    const response = await fetch(`${BaseUrl}?type=${creatures}`)
    if (!response.ok){
        throw new Error (`HTTP error: ${response.status}`);
    }
const types = await response.json();
return types ;
}
    catch (error) {console.error ("could not load Types:", error )}
}
console.log(getCreaturesByType());
