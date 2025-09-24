import { local_set_volume, local_set_sound_effects } from "./store/write.js";
import { local_get_volume, local_get_sound_effects } from "./store/read.js";

const settingsModal = document.querySelector("#settings-modal");
const openSettingsButton = document.querySelector("#open-settings-button");
const closeSettingsButton = document.querySelector("#close-settings");

const volumeSlider = document.querySelector("#volume-slider");
const soundEffectsToggle = document.querySelector("#sound-effects-toggle");

// When the settings button is clicked the modal opens
openSettingsButton.addEventListener("click", () => {

    const currentVolume = local_get_volume();

    if(currentVolume !== null) {
        volumeSlider.value = currentVolume;
    }

    soundEffectsToggle.checked = local_get_sound_effects();

    settingsModal.showModal();
});

// Close the modal when the close button is clicked
closeSettingsButton.addEventListener("click", () => {
    settingsModal.close();
});

// Save the volume setting whenever the slider value changes
volumeSlider.addEventListener("input", (event) => {
    local_set_volume(event.target.value);
    console.log(`Volume set to: ${event.target.value}`);
});

// Save the sound effects setting whenever the checkbox is toggled
soundEffectsToggle.addEventListener("change", (event) => {
    local_set_sound_effects(event.target.checked);
    console.log(`Sound effects enabled: ${event.target.checked}`);
});