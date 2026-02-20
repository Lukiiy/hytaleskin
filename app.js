const skinImg = document.getElementById("skin");
const skinTable = document.getElementById("skinFeatures");
const button = document.getElementById("btn");
const usernameInput = document.getElementById("username");

const buttonOg = button.textContent;

function buttonState(state) {
    button.textContent = state ? buttonOg : "Loading...";
    button.disabled = !state;
}

async function fetchProfile(id) {
    const res = await fetch(`https://playerdb.co/api/player/hytale/${encodeURIComponent(id)}`);

    if (!res.ok) throw new Error("Failed to fetch player data.");

    const json = await res.json();
    const player = json?.data?.player;

    if (!json.success || !player) throw new Error("User does not exist.");

    return player;
}

async function execute(id) {
    if (button.disabled) return;

    buttonState(false);

    skinFeatures.querySelector("tbody").textContent = "";

    try {
        const profile = await fetchProfile(id);
        const username = profile.username ?? profile.name ?? id;

        usernameInput.value = username;
        skinImg.src = `https://crafthead.net/hytale/body/${encodeURIComponent(username)}`;

        if (profile.avatar) setFavicon(profile.avatar);

        feedFeaturesTable(profile.skin);
    } catch (err) {
        console.error(err?.message ?? err);
        alert("User does not exist. Please check the username or UUID and try again.");
    } finally {
        buttonState(true);
    }
}

function setFavicon(url) {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement("link");
        link.rel = "icon";

        document.head.appendChild(link);
    }

    link.href = url;
}

function feedFeaturesTable(skin) {
    const tbody = skinFeatures.querySelector("tbody");

    for (const [property, value] of Object.entries(skin)) {
        if (value == null) continue;

        const row = document.createElement("tr");
        const propCell = document.createElement("td");
        propCell.textContent = property;

        const valueCell = document.createElement("td");
        valueCell.textContent = value;

        row.append(propCell, valueCell);
        tbody.appendChild(row);
    }
}

document.addEventListener("keydown", function(e) {
    if (e.key === "Enter" && document.activeElement === usernameInput) {
        e.preventDefault();
        execute(usernameInput.value.trim());
    };
});