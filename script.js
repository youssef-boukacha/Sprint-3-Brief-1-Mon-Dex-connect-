
// =============================================================
// script.js — Mon Dex
// =============================================================

// IMPORTS
import { Creatures, getPokemonTypes } from "./src/services/api.js";
import { displayCreatures } from "./src/ui.js";

// =============================================================
// 1. VARIABLES
// =============================================================

let creatures = [];
let offset = 0;
let page = 1;
let selectedType = "all";
let monEquipe = [];

const grid = document.getElementById("grid");
const search = document.getElementById("search");
const filters = document.getElementById("filters");
const mobileFilter = document.getElementById("mobile-filter");

const detail = document.getElementById("detail");

// =============================================================
// 2. DISPLAY + PAGINATION
// =============================================================

const prev = document.getElementById("prev");
const next = document.getElementById("next");
const pageNumber = document.getElementById("page-number");

async function loadPage() {
    try {
        creatures = await Creatures(offset);

        console.log("Loaded creatures:", creatures);

        updateCreatures();

        pageNumber.textContent = `Page ${page}`;
        prev.disabled = offset === 0;

    } catch (error) {
        console.error("Error loading creatures:", error);
    }
}

await loadPage();

next.addEventListener("click", async function() {
    offset += 20;
    page++;
    await loadPage();
});

prev.addEventListener("click", async function() {
    if (offset >= 20) {
        offset -= 20;
        page--;
        await loadPage();
    }
});

// =============================================================
// 3. DETAILS
// =============================================================

// Get stats from API array or custom creature object.
function getStat(creature, apiName, customName) {
    if (Array.isArray(creature.stats)) {
        const stat = creature.stats.find(function(item) {
            return item.stat.name === apiName;
        });

        return stat ? stat.base_stat : 0;
    }

    return creature.stats[customName] || 0;
}

function details() {

    grid.addEventListener("click", function(event) {

        // Do not open details when a button is clicked.
        if (event.target.closest(".button, .add-to-team")) {
            return;
        }

        const card = event.target.closest(".card");

        if (!card) {
            return;
        }

        const id = card.dataset.id;

        const creature = creatures.find(function(creature) {
            return String(creature.id) === id;
        });

        if (!creature) {
            return;
        }

        document.getElementById("detail-id").textContent = creature.id;
        document.getElementById("detail-name").textContent = creature.name;
        document.getElementById("detail-type").textContent = creature.type;

        document.getElementById("detail-description").textContent =
            creature.description || "Aucune description disponible.";

        const image = document.getElementById("detail-image");

        image.src = creature.image;
        image.alt = creature.name;

        const hp = getStat(creature, "hp", "hp");
        const attack = getStat(creature, "attack", "attack");
        const defence = getStat(creature, "defense", "defence");

        document.getElementById("detail-hp").textContent = hp;
        document.getElementById("detail-attack").textContent = attack;
        document.getElementById("detail-defence").textContent = defence;

        document.getElementById("bar-hp").style.width =
            (hp / 255 * 100) + "%";

        document.getElementById("bar-attack").style.width =
            (attack / 190 * 100) + "%";

        document.getElementById("bar-defence").style.width =
            (defence / 230 * 100) + "%";

        detail.classList.remove("hidden");

        detail.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    });
}

details();

// Close details.
document.getElementById("close-detail").addEventListener("click", function() {
    detail.classList.add("hidden");
});

// =============================================================
// 4. SEARCH + FILTER
// =============================================================

// Update selected button style.
function updateFilterStyle() {

    filters.querySelectorAll("button").forEach(function(button) {

        button.classList.remove(
            "bg-ink",
            "text-white",
            "border-ink"
        );

        if (button.dataset.type === selectedType) {
            button.classList.add(
                "bg-ink",
                "text-white",
                "border-ink"
            );
        }

    });
}

// Update creatures using search and selected type.
function updateCreatures() {

    const text = search.value.toLowerCase();

    const result = creatures.filter(function(creature) {

        const matchesName = creature.name
            .toLowerCase()
            .includes(text);

        const matchesType =
            selectedType === "all" ||
            creature.type === selectedType;

        return matchesName && matchesType;

    });

    console.log("Filtered creatures:", result);

    displayCreatures(result);

    updateFilterStyle();
}

// Search while typing.
search.addEventListener("input", function() {
    updateCreatures();
});

// Desktop filter buttons.
filters.addEventListener("click", function(event) {

    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    selectedType = button.dataset.type;

    // Synchronize mobile select.
    mobileFilter.value = selectedType;

    console.log("Type selected:", selectedType);

    updateCreatures();
});

// Mobile filter dropdown.
mobileFilter.addEventListener("change", function() {

    selectedType = mobileFilter.value;

    console.log("Mobile type selected:", selectedType);

    updateCreatures();
});

// =============================================================
// 5. DISPLAY TYPES FROM API
// =============================================================

function displayTypes(types) {

    // Desktop buttons.
    filters.innerHTML = `
        <button
            type="button"
            class="chip shrink-0"
            data-type="all">
            Tous
        </button>
    `;

    // Mobile options.
    mobileFilter.innerHTML = `
        <option value="all">Tous</option>
    `;

    types.forEach(function(type) {

        filters.innerHTML += `
            <button
                type="button"
                class="chip shrink-0"
                data-type="${type}">
                ${type}
            </button>
        `;

        mobileFilter.innerHTML += `
            <option value="${type}">
                ${type}
            </option>
        `;

    });

    updateFilterStyle();
}

const types = await getPokemonTypes();

displayTypes(types);

// =============================================================
// 6. CREATE A CREATURE
// =============================================================

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

// Error messages.
const idError = document.getElementById("id-error");
const nameError = document.getElementById("name-error");
const typeError = document.getElementById("type-error");
const levelError = document.getElementById("level-error");

const stat1Error = document.getElementById("hp-error");
const stat2Error = document.getElementById("attack-error");
const stat3Error = document.getElementById("defence-error");

const imgError = document.getElementById("img-error");
const descError = document.getElementById("desc-error");

// Regex.
const NameRegex = /^[A-Za-z]+$/;
const idRegex = /^#[0-9]{1,3}$/;
const nivRegex = /^[A-Za-z0-9]+$/;
const statRegex = /^[0-9]{1,3}$/;
const urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i;
const descriptionRegex = /^[A-Za-z ]{10,100}$/;

// Change border color.
function verifierChamp(champ, valide) {

    champ.classList.remove(
        "border-red-500",
        "border-green-500"
    );

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

            champ.classList.remove(
                "border-red-500",
                "border-green-500",
                "border-2"
            );

            messageErreur.textContent = "";
            return;
        }

        let valide = regex.test(valeur);

        if (verifierId && valide) {

            valide = !creatures.some(function(creature) {
                return String(creature.id) === valeur;
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

// Attach validation.
verifierPendantSaisie(numero, idRegex, idError, true);
verifierPendantSaisie(nom, NameRegex, nameError);
verifierPendantSaisie(niveau, nivRegex, levelError);

verifierPendantSaisie(statistiques1, statRegex, stat1Error);
verifierPendantSaisie(statistiques2, statRegex, stat2Error);
verifierPendantSaisie(statistiques3, statRegex, stat3Error);

verifierPendantSaisie(urlImage, urlRegex, imgError);
verifierPendantSaisie(description, descriptionRegex, descError);

// Validate type selection.
type.addEventListener("change", function() {

    if (type.value === "") {

        type.classList.remove(
            "border-red-500",
            "border-green-500",
            "border-2"
        );

        typeError.textContent = "";

    } else {

        verifierChamp(type, true);
        typeError.textContent = "";

    }

});

// Create a creature.
function CreeUneCreature() {

    // Clear errors.
    const errors = [
        idError, nameError, typeError, levelError,
        stat1Error, stat2Error, stat3Error,
        imgError, descError
    ];

    errors.forEach(function(error) {
        error.textContent = "";
    });

    // Validate ID.
    if (!idRegex.test(numero.value)) {
        idError.textContent = "Le numéro est invalide.";
        verifierChamp(numero, false);
        return;
    }

    if (creatures.some(function(creature) {
        return String(creature.id) === numero.value;
    })) {
        idError.textContent = "Ce numéro existe déjà.";
        verifierChamp(numero, false);
        return;
    }

    verifierChamp(numero, true);

    // Validate name.
    if (!NameRegex.test(nom.value)) {
        nameError.textContent = "Le nom doit contenir uniquement des lettres anglaises.";
        verifierChamp(nom, false);
        return;
    }

    verifierChamp(nom, true);

    // Validate type.
    if (type.value === "") {
        typeError.textContent = "Veuillez choisir un type.";
        verifierChamp(type, false);
        return;
    }

    verifierChamp(type, true);

    // Validate level.
    if (!nivRegex.test(niveau.value)) {
        levelError.textContent = "Le niveau contient des caractères invalides.";
        verifierChamp(niveau, false);
        return;
    }

    verifierChamp(niveau, true);

    // Validate statistics.
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

    // Validate image URL.
    if (!urlRegex.test(urlImage.value)) {
        imgError.textContent = "L'image doit avoir une URL finissant par jpg, jpeg, png ou webp.";
        verifierChamp(urlImage, false);
        return;
    }

    verifierChamp(urlImage, true);

    // Validate description.
    if (!descriptionRegex.test(description.value)) {
        descError.textContent = "La description doit contenir 10 à 100 lettres ou espaces anglais.";
        verifierChamp(description, false);
        return;
    }

    verifierChamp(description, true);

    // Create object.
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

    // Add creature.
    creatures.push(AddCreatures);

    // Display with current search and filter.
    updateCreatures();

    // Reset form.
    cree.reset();

    const champs = [
        numero, nom, type, niveau,
        statistiques1, statistiques2, statistiques3,
        urlImage, description
    ];

    champs.forEach(function(champ) {

        champ.classList.remove(
            "border-red-500",
            "border-green-500",
            "border-2"
        );

    });

    errors.forEach(function(error) {
        error.textContent = "";
    });

}

// Listen for form submission.
cree.addEventListener("submit", function(event) {

    event.preventDefault();

    CreeUneCreature();

});

// =============================================================
// 7. MY TEAM
// =============================================================

const team = document.getElementById("team");
const teamCount = document.getElementById("team-count");
const teamList = document.getElementById("team-list");

// Display team.
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

// Add creatures to team.
grid.addEventListener("click", function(event) {

    const bouton = event.target.closest(".add-to-team");

    if (!bouton) {
        return;
    }

    const id = bouton.dataset.id;

    const creature = creatures.find(function(c) {
        return String(c.id) === id;
    });

    if (!creature) {
        return;
    }

    // Prevent duplicates.
    const existe = monEquipe.some(function(c) {
        return String(c.id) === id;
    });

    if (existe) {
        alert("Cette créature est déjà dans votre équipe.");
        return;
    }

    // Maximum six creatures.
    if (monEquipe.length >= 6) {
        alert("Votre équipe est complète (6/6).");
        return;
    }

    monEquipe.push(creature);

    displayTeam();

});

// Remove creatures from team.
team.addEventListener("click", function(event) {

    const bouton = event.target.closest(".remove-from-team");

    if (!bouton) {
        return;
    }

    const id = bouton.dataset.id;

    monEquipe = monEquipe.filter(function(creature) {
        return String(creature.id) !== id;
    });

    displayTeam();

});

// Initial display.
displayTeam();
