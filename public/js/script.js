// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// Map
document.addEventListener("DOMContentLoaded", () => {
    const mapDiv = document.getElementById("map");
    if (!mapDiv) return;

    const coords = JSON.parse(mapDiv.dataset.coords);

    const map = L.map("map").setView(
        [coords[1], coords[0]],
        13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    L.marker([coords[1], coords[0]])
        .addTo(map)
        .bindPopup(
            `<b>${mapDiv.dataset.title}</b><br>${mapDiv.dataset.location}`
        )
        .openPopup();
});
