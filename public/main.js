document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/currentPosition');
        if (response.ok) {
            const data = await response.json();
            document.getElementById('currentPosition').textContent = data.position;
        } else {
            console.error('User is not logged in');
        }
    } catch (error) {
        console.error('Error fetching current ATC position data:', error);
    }
});

var ACTIVE_TAB = ""

async function getContent(tab) {
    var content_div = document.getElementById("main-content")

    if (ACTIVE_TAB == tab) {
        document.getElementById(ACTIVE_TAB).classList.remove("button-active")
        content_div.innerHTML = ""
        ACTIVE_TAB = ""
        return
    } else if (ACTIVE_TAB != "") {
        document.getElementById(ACTIVE_TAB).classList.remove("button-active")
    }

    ACTIVE_TAB = tab
    document.getElementById(ACTIVE_TAB).classList.add("button-active")
    
    try {
        const response = await fetch('/' + tab + 'Content');
        if (response.ok) {
            const htmlContent = await response.text();
            content_div.innerHTML = htmlContent;
        } else {
            console.error('Error getting HTML content for ' + tab);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function handleLogout() {
    window.location.href = "/logout"
}