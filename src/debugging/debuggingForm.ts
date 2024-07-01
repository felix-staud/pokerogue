import { allSpecies } from "#app/data/pokemon-species.js";
import debugFormHtml from "./debugging-form.html?raw";

export function renderDebugForm(doc: Document = document) {
  console.log("renderDebugForm");
  const app = doc.querySelector("#app");
  const debugContainer = doc.createElement("div");
  debugContainer.id = "debug-form-container";

  debugContainer.innerHTML = debugFormHtml;

  populatePokemonSelect(debugContainer.querySelector("#player-pokemon"));
  populatePokemonSelect(debugContainer.querySelector("#opponent-pokemon"));

  doc.body.classList.add("debugging");
  doc.body.insertBefore(debugContainer, app);
}

function populatePokemonSelect(
  select: HTMLSelectElement,
  doc: Document = document
) {
  const onSpeciesInitialized = () => {
    allSpecies.forEach((species) => {
      const option = doc.createElement("option");
      option.value = String(species.speciesId);
      option.text = species.getName();
      select.append(option);
    });
    window.removeEventListener("species/initialized", onSpeciesInitialized);
  };

  window.addEventListener("species/initialized", onSpeciesInitialized);
}
