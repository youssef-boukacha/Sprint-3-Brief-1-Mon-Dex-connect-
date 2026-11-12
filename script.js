
 // =============================================================
 // script.js — Mon Dex
 // =============================================================
 // Data comes from data.js (the `creatures` array).
 // Implement each feature in this file.
 // Create a GitHub Projects card and at least one commit per feature.


 // -------------------------------------------------------------
 // 1. DISPLAY
 // Remove manually written cards from index.html and
 // build the grid from the `creatures` array.
 // -------------------------------------------------------------

 const grid = document.getElementById("grid");

 function displayCreatures(list) {

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



 // -------------------------------------------------------------
 // 2. DETAILS
 // Clicking a card opens the detail panel:
 // image, description, and statistics displayed as bars.
 // -------------------------------------------------------------

 const detail = document.getElementById("detail");

 function details() {

   grid.addEventListener("click", function(event) {

     // Do not open details when the team button is clicked.
     if (event.target.closest(".button")) {
       return;
     }

     // Find the clicked card.
     const card = event.target.closest(".card");

     if (!card) {
       return;
     }

     // Get the creature ID.
     const id = card.dataset.id;

     // Find the creature in the array.
     const creature = creatures.find(function(creature) {
       return creature.id === id;
     });

     if (!creature) {
       return;
     }

     // Fill the detail panel with creature data.
     document.getElementById("detail-id").textContent = creature.id;
     document.getElementById("detail-name").textContent = creature.name;
     document.getElementById("detail-type").textContent = creature.type;
     document.getElementById("detail-description").textContent = creature.description;

     const image = document.getElementById("detail-image");
     image.src = creature.image;
     image.alt = creature.name;

     const hp = creature.stats.hp;
     const attack = creature.stats.attack;
     const defence = creature.stats.defence;

     document.getElementById("detail-hp").textContent = hp;
     document.getElementById("detail-attack").textContent = attack;
     document.getElementById("detail-defence").textContent = defence;

     // Display statistics as progress bars.
     document.getElementById("bar-hp").style.width = ((hp / 255) * 100) + "%";
     document.getElementById("bar-attack").style.width = ((attack / 190) * 100) + "%";
     document.getElementById("bar-defence").style.width = ((defence / 230) * 100) + "%";

     // Show the detail panel.
     detail.classList.remove("hidden");

     // Scroll to the detail panel.
     detail.scrollIntoView({ behavior: "smooth", block: "nearest" });

   });

 }

 // Close the detail panel.
 document.getElementById("close-detail").addEventListener("click", function() {
   detail.classList.add("hidden");
 });

 details();


 // -------------------------------------------------------------
 // 3. SEARCH
 // Update the list while typing a name (case-insensitive).
 // -------------------------------------------------------------

 function recherche() {

   const search = document.getElementById("search");

   search.addEventListener("input", function() {

     const text = search.value.toLowerCase();

     const result = creatures.filter(function(creature) {
       return creature.name.toLowerCase().includes(text);
     });

     displayCreatures(result);

   });

 }


 // -------------------------------------------------------------
 // 4. FILTER
 // Type buttons show creatures matching the selected type.
 // "Tous" resets the filter.
 // Search and filter work together.
 // -------------------------------------------------------------

 const search = document.getElementById("search");
 const filters = document.getElementById("filters");
 const filterButtons = filters.querySelectorAll("button");
 const typeSelect = document.querySelector("#Recherche select");

 // Selected type.
 let selectedType = "Tous";

 // Update the list using search and filter.
 function updateCreatures() {

   const text = search.value.toLowerCase();

   const result = creatures.filter(function(creature) {

     const matchesName = creature.name
       .toLowerCase()
       .includes(text);

     const matchesType =
       selectedType === "Tous" ||
       creature.type
         .toLowerCase()
         .includes(selectedType.toLowerCase());

     return matchesName && matchesType;

   });

   displayCreatures(result);
 }

 // Search while typing.
 search.addEventListener("input", function() {
   updateCreatures();
 });

 // Desktop type filter buttons.
 filters.addEventListener("click", function(event) {

   const button = event.target.closest("button");

   if (!button) {
     return;
   }

   selectedType = button.textContent.trim();

   // Update the selected button style.
   filterButtons.forEach(function(btn) {
     btn.classList.remove("bg-ink", "text-white", "border-ink");
   });

   button.classList.add("bg-ink", "text-white", "border-ink");

   updateCreatures();

 });

 // Mobile type dropdown.
 typeSelect.addEventListener("change", function() {

   selectedType = typeSelect.value === " Select"
     ? "Tous"
     : typeSelect.value;

   updateCreatures();

 });


 // -------------------------------------------------------------
 // 5. CREATE A CREATURE
 // Validate each form field using a regular expression.
 // Display error messages below invalid fields.
 // -------------------------------------------------------------

 const cree = document.getElementById("creature-form");

 const numero = document.getElementById("id");
 const nom = document.getElementById("name");
 const type = document.getElementById("select");
 const niveau = document.getElementById("level");
 const statistiques1 = document.getElementById("stat1");
 const statistiques2 = document.getElementById("stat2");
 const statistiques3 = document.getElementById("stat3");
 const urlImage = document.getElementById("img");
 const description = document.getElementById("desc");

 // Error messages
 const idError = document.getElementById("id-error");
 const nameError = document.getElementById("name-error");
 const typeError = document.getElementById("type-error");
 const levelError = document.getElementById("level-error");
 const stat1Error = document.getElementById("hp-error");
 const stat2Error = document.getElementById("attack-error");
 const stat3Error = document.getElementById("defence-error");
 const imgError = document.getElementById("img-error");
 const descError = document.getElementById("desc-error");

 // Regex
 const NameRegex = /^[A-Za-z]+$/;
 const idRegex = /^#[0-9]{1,3}$/;
 const nivRegex = /^[A-Za-z0-9]+$/;
 const statRegex = /^[0-9]{1,3}$/;
 const urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i;
 const descriptionRegex = /^[A-Za-z ]{10,100}$/;

 // Change the border color.
 function verifierChamp(champ, valide) {

   champ.classList.remove("border-red-500", "border-green-500");
   champ.classList.add("border-2");

   if (valide) {
     champ.classList.add("border-green-500");
   } else {
     champ.classList.add("border-red-500");
   }

 }

 // Validate while typing.
 function verifierPendantSaisie(champ, regex, messageErreur, verifierId = false) {

   champ.addEventListener("input", function() {

     const valeur = champ.value.trim();

     if (valeur === "") {
       champ.classList.remove("border-red-500", "border-green-500", "border-2");
       messageErreur.textContent = "";
       return;
     }

     let valide = regex.test(valeur);

     if (verifierId && valide) {
       valide = !creatures.some(function(creature) {
         return creature.id === valeur;
       });
     }

     verifierChamp(champ, valide);

     if (!valide) {

       if (verifierId && regex.test(valeur)) {
         messageErreur.textContent = "Ce numéro existe déjà.";
       } else {
         messageErreur.textContent = "La valeur saisie est invalide.";
       }

     } else {
       messageErreur.textContent = "";
     }

   });

 }

 // Attach validation to each field.
 verifierPendantSaisie(numero, idRegex, idError, true);
 verifierPendantSaisie(nom, NameRegex, nameError);
 verifierPendantSaisie(niveau, nivRegex, levelError);
 verifierPendantSaisie(statistiques1, statRegex, stat1Error);
 verifierPendantSaisie(statistiques2, statRegex, stat2Error);
 verifierPendantSaisie(statistiques3, statRegex, stat3Error);
 verifierPendantSaisie(urlImage, urlRegex, imgError);
 verifierPendantSaisie(description, descriptionRegex, descError);

 // Validate the type selection.
 type.addEventListener("change", function() {

   if (type.value === "") {
     type.classList.remove("border-red-500", "border-green-500", "border-2");
     typeError.textContent = "";
   } else {
     verifierChamp(type, true);
     typeError.textContent = "";
   }

 });

 // Create a creature.
 function CreeUneCreature() {

   idError.textContent = "";
   nameError.textContent = "";
   typeError.textContent = "";
   levelError.textContent = "";
   stat1Error.textContent = "";
   stat2Error.textContent = "";
   stat3Error.textContent = "";
   imgError.textContent = "";
   descError.textContent = "";

   // Validate the ID.
   if (!idRegex.test(numero.value)) {
     idError.textContent = "Le numéro est invalide.";
     verifierChamp(numero, false);
     return;
   }

   if (creatures.some(function(creature) {
     return creature.id === numero.value;
   })) {
     idError.textContent = "Ce numéro existe déjà.";
     verifierChamp(numero, false);
     return;
   }

   verifierChamp(numero, true);

   // Validate the name.
   if (!NameRegex.test(nom.value)) {
     nameError.textContent = "Le nom doit contenir uniquement des lettres anglaises.";
     verifierChamp(nom, false);
     return;
   }

   verifierChamp(nom, true);

   // Validate the type.
   if (type.value === "") {
     typeError.textContent = "Veuillez choisir un type.";
     verifierChamp(type, false);
     return;
   }

   verifierChamp(type, true);

   // Validate the level.
   if (!nivRegex.test(niveau.value)) {
     levelError.textContent = "Le niveau contient des caractères invalides.";
     verifierChamp(niveau, false);
     return;
   }

   verifierChamp(niveau, true);

   // Validate the statistics.
   if (!statRegex.test(statistiques1.value)) {
     stat1Error.textContent = "Entrez un nombre de 1 à 3 chiffres.";
     verifierChamp(statistiques1, false);
     return;
   }

   verifierChamp(statistiques1, true);

   if (!statRegex.test(statistiques2.value)) {
     stat2Error.textContent = "Entrez un nombre de 1 à 3 chiffres.";
     verifierChamp(statistiques2, false);
     return;
   }

   verifierChamp(statistiques2, true);

   if (!statRegex.test(statistiques3.value)) {
     stat3Error.textContent = "Entrez un nombre de 1 à 3 chiffres.";
     verifierChamp(statistiques3, false);
     return;
   }

   verifierChamp(statistiques3, true);

   // Validate the image URL.
   if (!urlRegex.test(urlImage.value)) {
     imgError.textContent = "L'image doit avoir une URL finissant par jpg, jpeg, png ou webp.";
     verifierChamp(urlImage, false);
     return;
   }

   verifierChamp(urlImage, true);

   // Validate the description.
   if (!descriptionRegex.test(description.value)) {
     descError.textContent = "La description doit contenir 10 à 100 lettres ou espaces anglais.";
     verifierChamp(description, false);
     return;
   }

   verifierChamp(description, true);

   // Create the creature object.
   const AddCreatures = {
     id: numero.value,
     name: nom.value,
     type: type.value,
     level: niveau.value,
     stats: {
       hp: Number(statistiques1.value),
       attack: Number(statistiques2.value),
       defence: Number(statistiques3.value)
     },
     image: urlImage.value,
     description: description.value
   };

   // Add and display the creature.
   creatures.push(AddCreatures);
   displayCreatures(creatures);

   // Reset the form.
   cree.reset();

   // Reset border colors.
   const champs = [
     numero, nom, type, niveau,
     statistiques1, statistiques2, statistiques3,
     urlImage, description
   ];

   champs.forEach(function(champ) {
     champ.classList.remove("border-red-500", "border-green-500", "border-2");
   });

   // Clear error messages.
   idError.textContent = "";
   nameError.textContent = "";
   typeError.textContent = "";
   levelError.textContent = "";
   stat1Error.textContent = "";
   stat2Error.textContent = "";
   stat3Error.textContent = "";
   imgError.textContent = "";
   descError.textContent = "";

 }

 // Listen for form submission.
 cree.addEventListener("submit", function(event) {
   event.preventDefault();
   CreeUneCreature();
 });


 // -------------------------------------------------------------
 // 6. MY TEAM
 // Handle Add and Remove buttons with delegated event listeners.
 // -------------------------------------------------------------

 const team = document.getElementById("team");
 const teamCount = document.getElementById("team-count");
 const teamList = document.getElementById("team-list");

 // Array storing the team creatures.
 let monEquipe = [];

 // Display the team.
 function displayTeam() {

   teamList.innerHTML = "";

   monEquipe.forEach(function(creature) {

     teamList.innerHTML += `
       <div class="bg-white rounded-xl p-4 shadow">
         <img
           src="${creature.image}"
           alt="${creature.name}"
           class="w-24 h-24 object-contain"
         >

         <h3 class="font-bold">${creature.name}</h3>
         <p>${creature.type}</p>

         <button
           type="button"
           class="remove-from-team bg-red-500 text-white px-4 py-2 rounded-lg"
           data-id="${creature.id}">
           Retirer
         </button>
       </div>
     `;

   });

   teamCount.textContent = monEquipe.length + "/6";

 }

 // One delegated listener to add creatures to the team.
 grid.addEventListener("click", function(event) {

   const bouton = event.target.closest(".add-to-team");

   if (!bouton) {
     return;
   }

   const id = bouton.dataset.id;

   // Find the selected creature.
   const creature = creatures.find(function(c) {
     return c.id === id;
   });

   if (!creature) {
     return;
   }

   // Prevent duplicates.
   const existe = monEquipe.some(function(c) {
     return c.id === id;
   });

   if (existe) {
     alert("Cette créature est déjà dans votre équipe.");
     return;
   }

   // Maximum of six creatures.
   if (monEquipe.length >= 6) {
     alert("Votre équipe est complète (6/6).");
     return;
   }

   monEquipe.push(creature);
   displayTeam();

 });

 // One delegated listener to remove creatures from the team.
 team.addEventListener("click", function(event) {

   const bouton = event.target.closest(".remove-from-team");

   if (!bouton) {
     return;
   }

   const id = bouton.dataset.id;

   monEquipe = monEquipe.filter(function(creature) {
     return creature.id !== id;
   });

   displayTeam();

 });

 // Initial display.
 displayTeam();


import { Creatures } from "./src/services/api.js";
const pokemons = await Creatures();
displayCreatures(pokemons);
