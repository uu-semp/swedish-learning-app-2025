import { local_set_volume, local_set_sound_effects } from "../store/write.js";
import { local_get_volume, local_get_sound_effects } from "../store/read.js";

const settingsModal = document.querySelector("#settings-modal");
const openSettingsButton = document.querySelector("#open-settings-button")
  ? document.querySelector("#open-settings-button")
  : document.querySelector("#settingsBtn");
const closeSettingsButton = document.querySelector("#close-settings");
const popup = document.getElementById("volumePopup");

const volumeSlider = document.querySelector("#volume-slider");
const soundEffectsToggle = document.querySelector("#sound-effects-toggle");

// When the settings button is clicked the modal opens
openSettingsButton.addEventListener("click", () => {
  const currentVolume = local_get_volume();

  if (currentVolume !== null) {
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
  const vol = Number(event.target.value);
  local_set_volume(vol);
  console.log(`Volume set to: ${vol}`);
});

// Save the sound effects setting whenever the checkbox is toggled
soundEffectsToggle.addEventListener("change", (event) => {
  local_set_sound_effects(event.target.checked);
  console.log(`Sound effects enabled: ${event.target.checked}`);
});

function update_components() {
  volumeSlider.value = local_get_volume();
  soundEffectsToggle.checked = local_get_sound_effects();
}

document.addEventListener("keydown", (e) => {
  // Increase volume (ArrowUp)
  if (e.key === "+") {
    e.preventDefault();
    const vol = local_get_volume();
    console.log(vol);
    console.log(typeof vol);
    let newVol = Math.min(100.0, vol + 10);
    console.log("new volume: ", newVol);
    local_set_volume(newVol);
    update_components();
    showVolumePopup(`🔊 ${Math.round(newVol)}%`);
  }

  // Decrease volume (ArrowDown)
  if (e.key === "-") {
    e.preventDefault();
    const vol = local_get_volume();
    let newVol = Math.max(0, vol - 10);
    local_set_volume(newVol);
    update_components();
    showVolumePopup(`🔉 ${Math.round(newVol)}%`);
  }

  // Toggle sound effects (M)
  if (e.key.toLowerCase() === "m") {
    e.preventDefault();
    let effectsEnabled = !local_get_sound_effects();
    local_set_sound_effects(effectsEnabled);
    update_components();
    showVolumePopup(effectsEnabled ? "🎵 Effects ON" : "🔇 Effects OFF");
  }
});

// Small on-screen popup to show current volume/effect changes
function showVolumePopup(text) {
  popup.textContent = text;
  popup.style.opacity = "1";
  clearTimeout(popup._timeout);
  popup._timeout = setTimeout(() => {
    popup.style.opacity = "0";
  }, 1200);
}
