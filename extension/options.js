function setSelectedTrack(selectedTrack) {
  console.log('setting selected track', selectedTrack)
  chrome.storage.sync.set({ selectedTrack });
}

function restoreOptions() {
  chrome.storage.sync.get(
    { selectedTrack: 'buy-mode' },
    ({ selectedTrack }) => {
      const radioButton = document.getElementById(selectedTrack);
      radioButton.checked = true;
    }
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const selectedTrackRadioButtons = document.querySelectorAll('input[type="radio"][name="selected-track"]');
  for (const r of selectedTrackRadioButtons) {
    r.addEventListener('input', e => setSelectedTrack(e.target.value));
  }
  restoreOptions();
});
