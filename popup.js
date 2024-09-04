document.getElementById('saveButton').addEventListener('click', () => {
    const selectedCategory = document.getElementById('categorySelect').value;

    let type = 'sfw';
    if (selectedCategory === 'trap' || selectedCategory === 'blowjob' || selectedCategory === 'waifu_nsfw' || selectedCategory === 'neko_nsfw') {
        type = 'nsfw';
    }

    const storage = chrome.storage || browser.storage;

    storage.sync.set({ type, category: selectedCategory });
});