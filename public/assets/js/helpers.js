function renderCameraList(cameras) {
    const $container = document.getElementById("cameraList");
    $container.innerHTML = "";

    if (cameras.length === 0) {
        const $li = document.createElement("li");
        $li.className = "list-group-item";
        $li.textContent = "No cameras found";
        $container.appendChild($li);
        return;
    }

    cameras.forEach(c => {
        const $li = document.createElement("li");
        $li.className = `list-group-item list-group-item-action ${window.bookmarked.has(c.name) ? 'gold' : ''}`;

        const $div = document.createElement("div");
        $div.textContent = c.name;
        $div.style.display = "inline-block";

        const $button = document.createElement("button");
        $button.textContent = window.bookmarked.has(c.name) ? "Bookmarked" : "Bookmark";
        window.bookmarked.has(c.name) ? $button.classList.add("bookmarked") : $button.classList.remove("bookmarked");
        $button.style.float = "right";
        $button.onclick = () => window.toggleBookmark(c.name);

        const $vButton = document.createElement("button");
        $vButton.textContent = "👁️";
        $vButton.classList.add("vbutton");
        $vButton.style.float = "right";
        window.bookmarked.has(c.name) ? $vButton.classList.add("bookmarked") : $vButton.classList.remove("bookmarked");
        $vButton.onclick = () => view(c.name);

        $li.appendChild($div);
        $li.appendChild($vButton);
        $li.appendChild($button);

        $li.addEventListener("click", (e) => {
            if (e.target !== $button) {
                c.marker.openPopup();
                c._map.setView([c.lat, c.lng], 5);
            }
        });

        $container.appendChild($li);
    });
}

export {renderCameraList};
