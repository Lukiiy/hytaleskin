const skinImg = document.getElementById("skin");
const skinTable = document.getElementById("skinFeatures");
const button = document.getElementById("btn");
const usernameInput = document.getElementById("username");

function buttonState(state) {
    button.textContent = state ? "View" : "Loading...";
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

    try {
        const profile = await fetchProfile(id);
        const username = profile.username ?? profile.name ?? id;

        usernameInput.value = username;
        skinImg.src = `https://crafthead.net/hytale/body/${encodeURIComponent(username)}`;
    } catch (err) {
        console.error(err?.message ?? err);
        alert("User does not exist. Please check the username or UUID and try again.");
    } finally {
        buttonState(true);
    }
}

document.addEventListener("keydown", function(e) {
    if (e.key === "Enter" && document.activeElement === usernameInput) {
        e.preventDefault();
        execute(usernameInput.value.trim());
    };
});