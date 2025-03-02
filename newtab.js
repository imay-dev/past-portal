// Cache constants
const CACHE_KEY = 'pastportal_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// Utility functions
const getCache = async () => {
    try {
        const cache = await chrome.storage.local.get(CACHE_KEY);
        return cache[CACHE_KEY];
    } catch (error) {
        console.error('Cache read error:', error);
        return null;
    }
};

const setCache = async (data) => {
    try {
        await chrome.storage.local.set({
            [CACHE_KEY]: {
                timestamp: Date.now(),
                data: data
            }
        });
    } catch (error) {
        console.error('Cache write error:', error);
    }
};

const isCacheValid = (cache) => {
    return cache && 
           cache.timestamp && 
           cache.data &&
           (Date.now() - cache.timestamp) < CACHE_DURATION;
};

const fetchHistoricalData = async (date) => {
    const response = await fetch(
        `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${date.getMonth()+1}/${date.getDate()}`,
        { 
            mode: 'cors',
            headers: {
                'Accept': 'application/json'
            }
        }
    );
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

const displayError = (error, retryFn) => {
    const errorMessage = error.message || 'Unknown error occurred';
    document.body.innerHTML = `
        <div class="card">
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Time Portal Malfunction!</p>
                <small>${errorMessage}</small>
                ${retryFn ? '<button id="retryButton">Try Again</button>' : ''}
            </div>
        </div>
        ${document.body.innerHTML}
    `;
    
    if (retryFn) {
        document.getElementById('retryButton').addEventListener('click', retryFn);
    }
    
    document.body.style.overflow = 'auto';
    console.error('PastPortal Error:', error);
};

const displayEvent = (randomEvent) => {
    const img = document.getElementById('eventImage');
    
    img.onload = () => {
        img.classList.add('loaded');
        document.body.style.setProperty('--bg-image', `url(${img.src})`);
        document.body.classList.add('has-bg');
        document.querySelector('.loading-overlay')?.remove();
    };

    img.onerror = () => {
        img.remove();
        document.querySelector('.loading-overlay')?.remove();
        throw new Error('Failed to load image');
    };

    img.src = randomEvent.pages[0].thumbnail.source;
    document.body.style.overflow = 'auto';
    document.getElementById('eventYear').textContent = randomEvent.year;
    document.getElementById('eventText').textContent = randomEvent.text;
    document.getElementById('readMore').href = randomEvent.pages[0]?.content_urls?.desktop?.page;
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (date, retryCount = 0) => {
    try {
        return await fetchHistoricalData(date);
    } catch (error) {
        if (retryCount < MAX_RETRIES) {
            const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
            console.log(`Attempt ${retryCount + 1} failed. Retrying in ${delay}ms...`);
            await sleep(delay);
            return fetchWithRetry(date, retryCount + 1);
        }
        throw new Error(`Failed after ${MAX_RETRIES} attempts: ${error.message}`);
    }
};

// Main function
const loadHistoricalEvent = async () => {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = '<i class="fas fa-hourglass-start loading-spinner"></i>';
    document.body.appendChild(loadingOverlay);

    try {
        const today = new Date();
        const cache = await getCache();
        
        let data;
        if (isCacheValid(cache)) {
            data = cache.data;
        } else {
            data = await fetchWithRetry(today);
            await setCache(data);
        }

        const events = data.selected || [];
        const validEvents = events.filter(e => e.pages?.[0]?.thumbnail?.source);

        if (validEvents.length === 0) {
            throw new Error('No visual history available for today');
        }

        const randomEvent = validEvents[Math.floor(Math.random() * validEvents.length)];
        displayEvent(randomEvent);

    } catch (error) {
        loadingOverlay.remove();
        displayError(error, () => window.location.reload());
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', loadHistoricalEvent);

// Add refresh button listener
document.addEventListener('DOMContentLoaded', () => {
    const refreshButton = document.createElement('button');
    refreshButton.id = 'refreshButton';
    refreshButton.innerHTML = '<i class="fas fa-sync-alt"></i>';
    refreshButton.title = 'Show another event';
    document.body.appendChild(refreshButton);
    
    refreshButton.addEventListener('click', (e) => {
        e.preventDefault();
        loadHistoricalEvent();
    });
});