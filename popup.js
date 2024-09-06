document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('categorySelect');
    const saveButton = document.getElementById('saveButton');
    const toggleButton = document.getElementById('toggleButton');
    const storage = (typeof chrome !== 'undefined' ? chrome : browser).storage;

    storage.sync.get(['category', 'contentScriptEnabled'], (result) => {
        if (result.category) {
            categorySelect.value = result.category;
        }

        const contentScriptEnabled = result.contentScriptEnabled ?? true;
        toggleButton.textContent = contentScriptEnabled ? 'Disable Extension' : 'Enable Extension';
    });

    saveButton.addEventListener('click', () => {
        const selectedCategory = categorySelect.value;

        storage.sync.get(['contentScriptEnabled'], (result) => {
            const contentScriptEnabled = result.contentScriptEnabled ?? true;

            let type = 'sfw';
            if (selectedCategory === 'trap' || selectedCategory === 'blowjob' || selectedCategory === 'waifu_nsfw' || selectedCategory === 'neko_nsfw') {
                type = 'nsfw';
            }

            storage.sync.set({ type, category: selectedCategory }, () => {
                (typeof chrome !== 'undefined' ? chrome : browser).tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    (typeof chrome !== 'undefined' ? chrome : browser).tabs.sendMessage(tabs[0].id, { action: 'reload' });
                });
            });
        });
    });

    toggleButton.addEventListener('click', () => {
        storage.sync.get(['contentScriptEnabled'], (result) => {
            const isEnabled = result.contentScriptEnabled ?? true;
            const newState = !isEnabled;

            storage.sync.set({ contentScriptEnabled: newState }, () => {
                toggleButton.textContent = newState ? 'Disable Extension' : 'Enable Extension';
                (typeof chrome !== 'undefined' ? chrome : browser).tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    (typeof chrome !== 'undefined' ? chrome : browser).tabs.sendMessage(tabs[0].id, { action: 'reload' });
                });
            });
        });
    });
});