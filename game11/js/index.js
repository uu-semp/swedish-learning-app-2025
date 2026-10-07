// This file communication between the main page and the popup game.

// Wait until the HTML page has finished loading, then run this function
window.addEventListener('DOMContentLoaded', () => {

    window.vocabulary.load_game_data(11);


    const popupFrame = document.getElementById('popupFrame');
    const popupWrap = document.querySelector('.popup-frame-wrap');

    if (popupWrap) {
        popupWrap.classList.remove('is-endgame');
        popupWrap.style.pointerEvents = 'none';
    }


    /**
     * Enables or disables user interaction with the popup iframe.
     *
     * @param {boolean} on - Whether interaction with the iframe should be enabled.
     * @returns {void}
     */
    function setIframeInteractive(on) {
        const wrap = document.querySelector('.popup-frame-wrap');
        const frame = document.querySelector('.popup-frame');
        if (!wrap || !frame) return;
        wrap.style.pointerEvents = on ? 'auto' : 'none';
        frame.style.pointerEvents = on ? 'auto' : 'none';
        wrap.classList.toggle('is-endgame', on);
    }



    /**
     * Extracts a key from image path.
     * The key is based on the image filename and is used to identify shelf items.
     *
     * @param {string} p - The path to the image.
     * @returns {string|undefined} The lowercase filename without its extension.
     */
    const keyFromImgPath = (p) => {
        if (!p) return undefined;
        const base = p.split('/').pop() || '';
        return base.split('.')[0].toLowerCase();
    };



    /**
     * Converts the shopping list from the game state into a simplified word list.
     * It creates an ID and Swedish label for each item and removes items without a valid ID.
     *
     * @param {Object} gs - The current game state containing the shopping list.
     * @returns {Object[]} A list of words containing an ID and Swedish label.
     */
    function mapWordsFromState(gs) {
        const raw = Array.isArray(gs?.shoppingList)
            ? gs.shoppingList
            : [];
        const words = raw.map(item => {
            const idKey =
                keyFromImgPath(item?.img) ||
                (item?.id != null
                    ? String(item.id).toLowerCase()
                    : undefined) ||
                (item?.en
                    ? String(item.en).toLowerCase()
                    : undefined) ||
                (item?.sv
                    ? String(item.sv).toLowerCase()
                    : undefined);
            const svLabel = item?.sv ?? item?.en ?? '';
            return {
                id: idKey,
                sv: svLabel
            };
        }).filter(w => !!w.id);

        return words;
    }

    /**
     * Sends the selected item from the main game page to the popup iframe.
     * The item ID and label are sent using postMessage so the popup can check the player's selection.
     *
     * @param {string} idKey - The ID of the selected item.
     * @param {string} label - The label of the selected item.
     * @returns {void}
     */
    window.sendPickToPopup = function (idKey, label) {
        if (!popupFrame || !popupFrame.contentWindow) return;
        console.log('[parent] sending pick (key):', idKey);
        popupFrame.contentWindow.postMessage(
            {
                type: 'pick',
                id: String(idKey),
                label
            },
            '*'
        );
    };


    let popupIsReady = false;
    let initSent = false;



    /**
     * Checks whether the current game state contains a non-empty shopping list.
     * @returns {boolean} True if a shopping list exists and contains items, otherwise false.
     */
    function haveShoppingList() {
        const gs = window.__game11GameState;
        return !!(
            gs &&
            Array.isArray(gs.shoppingList) &&
            gs.shoppingList.length > 0
        );
    }



    /**
     * Initializes the popup with the current shopping-list words when the popup is ready.
     * It sends the initialization message only after both the popup and shopping list are available.
     *
     * @returns {boolean} True if initialization has already been sent, otherwise false.
     */
    function tryInitPopupOnce() {
        if (initSent) return true;
        if (!popupIsReady || !haveShoppingList()) {
            return false;
        }
        const gs = window.__game11GameState;
        const words = mapWordsFromState(gs);
        popupFrame?.contentWindow?.postMessage(
            {
                type: 'initWords',
                words,
                currentIndex: gs.currentIndex || 0 
            },
            '*'
        );
        return false;
    }



    /**
     * Handles messages received from the popup iframe.
     * It updates the game progress, initializes the popup when it is ready,
     * and enables or disables iframe interaction during the end-game screen.
     *
     * @param {MessageEvent} event - The message event received from the popup.
     */
    window.addEventListener('message', (event) => {
        const data = event.data || {};
        if (data.type === 'statusUpdate') {
            const s = data.status;
            if (!s) return;
            document.getElementById('progressPill').textContent = s.progress;
            document.getElementById('firstTryPill').textContent = s.firstTry;
            document.getElementById('mistakesPill').textContent = s.mistakes;
            document.getElementById('targetPill').textContent = s.target;

            if (
                typeof s.index === 'number' ||
                typeof s.index === 'string'
            ) {
                window.Game11UI?.highlightListIndex?.(s.index);

                // Updates and saves the current index in the storage.
                const gs = window.__game11GameState;
                if (gs) {
                    gs.currentIndex = Number(s.index);
                    save.set("game11", "game_state", gs);
                }
            }
        } else if (data.type === 'popupReady') {
            popupIsReady = true;
            tryInitPopupOnce();
        } else if (data.type === 'initDone') {
            initSent = true;
        }

        if (data.type === 'endgameOpen') {
            setIframeInteractive(true);
            return;
        }
        if (data.type === 'endgameClose') {
            setIframeInteractive(false);
            return;
        }
    });


    window.addEventListener('game11:ready', () => {
        tryInitPopupOnce();
    });


    popupFrame?.addEventListener('load', () => {
        tryInitPopupOnce();
    });


    let attempts = 0;

    /**
     * Repeatedly attempts to initialize the popup until initialization succeeds
     * or the maximum number of attempts is reached.
     *
     * @returns {void}
     */
    const timer = setInterval(() => {
        if (tryInitPopupOnce()) {
            clearInterval(timer);
        } else if (++attempts > 100) {
            clearInterval(timer);
        }
    }, 100);


    // MENU

    const menuBtn = document.getElementById('main-menu-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsBtn =
        document.getElementById('close-settings-btn');

    if (menuBtn && settingsModal && closeSettingsBtn) {

        menuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            settingsModal.classList.toggle('hidden');
        });

        closeSettingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            settingsModal.classList.add('hidden');
        });
    }



    // RESTART

    const restartBtn = document.getElementById('restart-btn');

    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            save.set("game11", "game_state", null);
            window.location.reload();
        });
    }


    // MODE 2
    const Mode2Btn = document.getElementById('mode2-btn');
    if (Mode2Btn) {
        Mode2Btn.addEventListener('click', () => {
            const state = window.__game11GameState;
            state.mode = 2;
            save.set("game11", "game_state", state);
            window.location.reload();
        });
    }

    const Mode3Btn = document.getElementById('mode3-btn');
    if (Mode3Btn) {
        Mode3Btn.addEventListener('click', () => {
            const state = window.__game11GameState;
            state.mode = 3;
            save.set("game11", "game_state", state);
            window.location.reload();
        });
    }

    // MODE 1
    const Mode1Btn = document.getElementById('mode1-btn');
    if (Mode1Btn) {
        Mode1Btn.addEventListener('click', () => {
            const state = window.__game11GameState;
            state.mode = 1;
            save.set("game11", "game_state", state);
            window.location.reload();
        });
    }


    // HIGH CONTRAST

    const toggleContrastBtn =
        document.getElementById('toggle-contrast-btn');

    if (toggleContrastBtn) {
        toggleContrastBtn.addEventListener('click', () => {

            document.body.classList.toggle('high-contrast-mode');

            const isActive =
                document.body.classList.contains('high-contrast-mode');

            // NOTE: Needs to know the current langauge to work properly
            const languageBtn =
                document.getElementById('toggle-language-btn');

            if (languageBtn) {
                const isSwedish = languageBtn.textContent == "Engelska";
                toggleContrastBtn.textContent =
                    isSwedish 
                        ? isActive
                            ? 'PÅ'
                            : 'AV'
                        : isActive
                            ? 'ON'
                            : 'OFF';

                toggleContrastBtn.classList.toggle(
                    'active',
                    isActive
                );
            }
        });
    }


    // LANGUAGE

    const languageBtn =
        document.getElementById('toggle-language-btn');

    if (languageBtn) {
        languageBtn.addEventListener('click', async () => {
            // NOTE: This check is quite fragile to changes
            const isSwedish = languageBtn.textContent == "Engelska";
            const res = await fetch("assets/translations.json");
            if (!res.ok) {
                throw new Error("Failed to load translations.json");
            }
            const translationTable = new Map(Object.entries(await res.json()));
            if (translationTable.size == 0) {
                throw new Error("Failed to convert translations table to JSON");
            }

            translationTable.forEach((value, key) => {
                const currentElement = document.getElementById(key);
                if (!currentElement) {
                    console.error(`[parent] failed to translate ${key}`);
                }

                // NOTE: Needs to be handled seperatly because the text can change
                if (key == "toggle-contrast-btn") {
                    const isContrastOn =
                        document.body.classList.contains('high-contrast-mode');
                    currentElement.textContent = 
                        isSwedish 
                            ? isContrastOn
                                ? 'ON'
                                : 'OFF'
                            : isContrastOn
                                ? 'PÅ'
                                : 'AV';
                } else {
                    currentElement.innerHTML = isSwedish ? value.en : value.sv;
                }
            });
        });
    }

    // COPYRIGHT

    const copyrightBtn =
        document.getElementById('copyrightBtn');

    const copyright =
        document.getElementById('copyright');

    const closeCopyright =
        document.getElementById('close-copyright');

    if (copyrightBtn && copyright && closeCopyright) {

        copyrightBtn.addEventListener('click', () => {
            copyright.style.display = 'block';
        });

        closeCopyright.addEventListener('click', () => {
            copyright.style.display = 'none';
        });
    }

});

// Handle the result of an item selection from the popup.
// If the selection is correct, place the item in the cart.
window.addEventListener('message', (event) => {
    const data = event.data || {};

    if (
        data.type === 'pickResult' &&
        data.ok &&
        typeof data.id === 'string'
    ) {
        window.Game11UI?.placeItemInCart?.(data.id);

        const gs = window.__game11GameState;
        if (gs) {
            if (!gs.pickedIds) gs.pickedIds = [];
            if (!gs.pickedIds.includes(data.id)) {
                gs.pickedIds.push(data.id);
            }
            save.set("game11", "game_state", gs);
        }
    }
});

// Update stats when game is won
window.addEventListener('message', (event) => {
    const data = event.data || {};

    if (data.type === 'gameEnded') {
        if (data.won) {
            save.stats.incrementWin("game11");
        }
    }
});

window.addEventListener('message', (event) => {
    if (event.data?.type !== 'playAgain') return;

    console.log('[parent] playAgain');

    save.set("game11", "game_state", null);
    sessionStorage.removeItem('game11_end_stats');

    const popupWrap = document.querySelector('.popup-frame-wrap');
    const popupFrame = document.getElementById('popupFrame');

    if (popupWrap) {
        popupWrap.classList.remove('is-endgame');
        popupWrap.style.pointerEvents = 'none';
    }

    if (popupFrame) {
        popupFrame.style.pointerEvents = 'none';
        popupFrame.src = './html/popup.html';
    }

    setTimeout(() => {
        window.location.reload();
    }, 100);
});

window.addEventListener('message', (event) => {
    if (event.data.type === 'wrongAnswer') {
        showWrongAnswer();
    }
});

function showWrongAnswer() {
    const wrongAnswer = document.getElementById('wrongAnswer');

    wrongAnswer.style.display = 'block';

    setTimeout(() => {
        wrongAnswer.style.display = 'none';
    }, 800);
}
