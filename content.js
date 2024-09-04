async function replaceImage(img, type, category) {
    const url = `https://api.waifu.pics/${type}/${category}`;

    try {
        const response = await fetch(url.replace("neko_nsfw", "neko").replace("waifu_nsfw", "waifu"));
        const data = await response.json();
        
        if (data && data.url) {
            const waifuUrl = data.url;
            img.src = waifuUrl;
            img.srcset = waifuUrl;
        } else {
            console.error('Error: No URL returned from API');
        }
    } catch (error) {
        console.error('Error fetching image:', error);
    }
}

async function replaceAllImages(type, category) {
    const images = document.querySelectorAll('img');
    const promises = Array.from(images).map(img => replaceImage(img, type, category));
    
    try {
        await Promise.all(promises);
    } catch (error) {
        console.error('Error replacing some images:', error);
    }
}

function observeNewImages(type, category) {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'IMG') {
                    replaceImage(node, type, category);
                }
                if (node.querySelectorAll) {
                    node.querySelectorAll('img').forEach(img => replaceImage(img, type, category));
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

browser.storage.sync.get(['type', 'category'])
    .then(data => {
        const type = data.type || 'sfw';
        const category = data.category || 'waifu';

        if (!type || !category) {
            console.error('Error: Type or category is undefined');
            return;
        }

        replaceAllImages(type, category);
        observeNewImages(type, category);
    })
    .catch(error => {
        console.error('Error retrieving data from storage:', error);
    });