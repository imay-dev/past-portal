const BOOKMARKS_KEY = 'pastportal_bookmarks';

const loadBookmarks = async () => {
    const container = document.getElementById('bookmarks-container');
    const noBookmarks = document.getElementById('no-bookmarks');
    
    try {
        const result = await chrome.storage.local.get(BOOKMARKS_KEY);
        const bookmarks = result[BOOKMARKS_KEY] || [];
        
        if (bookmarks.length === 0) {
            container.style.display = 'none';
            noBookmarks.style.display = 'block';
            return;
        }

        container.style.display = 'grid';
        noBookmarks.style.display = 'none';
        
        container.innerHTML = bookmarks.map(event => `
            <div class="bookmark-card" data-id="${event.id}">
                <img class="bookmark-image" src="${event.thumbnail}" alt="${event.text}">
                <div class="bookmark-content">
                    <div class="bookmark-year">
                        <i class="fas fa-calendar"></i>
                        ${event.year}
                    </div>
                    <p class="bookmark-text">${event.text}</p>
                    <div class="bookmark-actions">
                        <a href="${event.url}" class="bookmark-link" target="_blank">
                            Read More <i class="fas fa-external-link-alt"></i>
                        </a>
                        <button class="remove-bookmark" title="Remove bookmark">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-bookmark').forEach(button => {
            button.addEventListener('click', async (e) => {
                const card = e.target.closest('.bookmark-card');
                const id = card.dataset.id;
                
                try {
                    const result = await chrome.storage.local.get(BOOKMARKS_KEY);
                    const bookmarks = result[BOOKMARKS_KEY] || [];
                    const updatedBookmarks = bookmarks.filter(b => b.id !== id);
                    
                    await chrome.storage.local.set({ [BOOKMARKS_KEY]: updatedBookmarks });
                    card.remove();
                    
                    if (updatedBookmarks.length === 0) {
                        container.style.display = 'none';
                        noBookmarks.style.display = 'block';
                    }
                } catch (error) {
                    console.error('Failed to remove bookmark:', error);
                }
            });
        });
        
    } catch (error) {
        console.error('Failed to load bookmarks:', error);
        container.innerHTML = '<p class="error">Failed to load bookmarks. Please try again later.</p>';
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', loadBookmarks); 