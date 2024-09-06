document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('categorySelect');
    const storage = (typeof chrome !== 'undefined' ? chrome : browser).storage;

    storage.sync.get(['category'], (result) => {
        if (result.category) {
            categorySelect.value = result.category;
        }
    });
});

document.getElementById('saveButton').addEventListener('click', () => {
    const selectedCategory = document.getElementById('categorySelect').value;

    let type = 'sfw';
    if (selectedCategory === 'trap' || selectedCategory === 'blowjob' || selectedCategory === 'waifu_nsfw' || selectedCategory === 'neko_nsfw') {
        type = 'nsfw';
    }

    const storage = (typeof chrome !== 'undefined' ? chrome : browser).storage;

    storage.sync.set({ type, category: selectedCategory }, () => {
        (typeof chrome !== 'undefined' ? chrome : browser).tabs.query({ active: true, currentWindow: true }, (tabs) => {
            (typeof chrome !== 'undefined' ? chrome : browser).tabs.sendMessage(tabs[0].id, { action: 'reload' });
        });
    });
});
