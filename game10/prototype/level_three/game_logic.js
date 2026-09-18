console.log("✅ game_logic.js loaded");
window.game_logic = {
    async getRandomWordSet(no_of_words=10) {
        return new Promise((resolve) => {
            window.vocabulary.when_ready(() => {
                const word_ids = window.vocabulary.get_category('food');
                const word_set = word_ids.map(id => window.vocabulary.get_vocab(id));
                console.log('Loaded', word_set.length, 'words for category food');
                console.log(word_set);
            const random_words = [];
            while (random_words.length < no_of_words) {
                const random_index = Math.floor(Math.random() * word_set.length);
                if (!random_words.includes(word_set[random_index])) {
                    random_words.push(word_set[random_index]);
                }
            }
            console.log('Selected random words:', random_words);
            resolve(random_words);
            });
        });
    }
}