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