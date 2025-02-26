document.addEventListener('DOMContentLoaded', async () => {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = '<i class="fas fa-hourglass-start loading-spinner"></i>';
    document.body.appendChild(loadingOverlay);

    try {
        const today = new Date();
        const response = await fetch(
            `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${today.getMonth()+1}/${today.getDate()}`,
            { mode: 'cors' }
        );
        
        if (!response.ok) throw new Error('Failed to fetch historical data');
        const data = await response.json();
        const events = data.selected || [];
        const validEvents = events.filter(e => e.pages?.[0]?.thumbnail?.source);

        if (validEvents.length === 0) throw new Error('No visual history available');

        const randomEvent = validEvents[Math.floor(Math.random() * validEvents.length)];
        const img = document.getElementById('eventImage');
        
        img.onload = () => {
            img.classList.add('loaded');
            document.body.style.setProperty('--bg-image', `url(${img.src})`);
            document.body.classList.add('has-bg');
            loadingOverlay.remove();
          };

        img.onerror = () => {
            img.remove();
            loadingOverlay.remove();
            throw new Error('Image load failed');
        };

        img.src = randomEvent.pages[0].thumbnail.source;
        document.body.style.overflow = 'auto';
        document.getElementById('eventYear').textContent = randomEvent.year;
        document.getElementById('eventText').textContent = randomEvent.text;
        document.getElementById('readMore').href = 
            randomEvent.pages[0]?.content_urls?.desktop?.page;

    } catch (error) {
        loadingOverlay.remove();
        document.body.innerHTML = `
            <div class="card">
                <div class="error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Time Portal Malfunction!</p>
                    <small>${error.message}</small>
                </div>
            </div>
            ${document.body.innerHTML}
        `;
        document.body.style.overflow = 'auto';
        console.error(error);
    }
});