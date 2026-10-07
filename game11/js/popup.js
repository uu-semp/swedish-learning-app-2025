// This file contains the logic for the game

(function () {
    const TARGET_TOTAL = 10; // only used as a fallback
    const WIN_THRESHOLD = n => Math.ceil(n * 0.8);

    // Announce to parent that popup can receive initWords.
    // Repeated until the parent answers with initWords: a single announcement can
    // be lost if the iframe script runs before the parent installs its listener,
    // which left the popup running the fallback bank (wrong target words).
    const isEmbedded = window.parent && window.parent !== window;
    let initedFromParent = false;
    let readyTimer = null;

    // Tell the parent page that the popup is ready to receive the word list.
    function announceReady() {
        if (!isEmbedded) return;
        try { window.parent.postMessage({ type: 'popupReady' }, '*'); } catch (_) { }
    }

    // Fallback bank (kept, but we'll usually get real words from parent)
    const FOOD_BANK = [
        { id: 'apple', sv: 'äpple' }, { id: 'banana', sv: 'banan' }, { id: 'bread', sv: 'bröd' },
        { id: 'milk', sv: 'mjölk' }, { id: 'flour', sv: 'mjöl' }, { id: 'cheese', sv: 'ost' },
        { id: 'coffee', sv: 'kaffe' }, { id: 'candy', sv: 'godis' }, { id: 'yoghurt', sv: 'yoghurt' },
        { id: 'egg', sv: 'ägg' }, { id: 'orange', sv: 'apelsin' }, { id: 'pear', sv: 'päron' },
        { id: 'tomato', sv: 'tomat' }, { id: 'cucumber', sv: 'gurka' }, { id: 'water', sv: 'vatten' },
        { id: 'tea', sv: 'te' }, { id: 'chocolate', sv: 'choklad' }, { id: 'meat', sv: 'kött' },
        { id: 'fish', sv: 'fisk' }, { id: 'rice', sv: 'ris' }
    ];

    let game = null;

    const toastsEl = document.getElementById('toasts');
    const endModal = document.getElementById('endModal');
    const endMsg = document.getElementById('endMsg');
    const endClose = document.getElementById('endClose');

    // Track active toast
    let currentToast = null;
    let currentToastTimer = null;


    // Send the current game status and progress to the parent page.
    function renderStatus() {
        if (window.parent && window.parent !== window && game) {
            const cur = game.words[game.orderIndex] || null;
            window.parent.postMessage({
                type: 'statusUpdate',
                status: {
                    progress: `${game.completed} / ${game.total} klara`,
                    firstTry: `Rätt: ${game.firstTryCorrectCount}`,
                    mistakes: `Misstag: ${game.mistakes}`,
                    target: `Tröskel: ${game.winThreshold} / ${game.total}`,
                    index: game.orderIndex,
                    currentId: cur ? String(cur.id) : null,
                    currentSv: cur ? cur.sv : null
                }
            }, '*');
        }
    }



    /**
     * Displays a temporary message to the player and removes any existing message.
     *
     * @param {string} html - The message content to display.
     * @param {string} type - The type of message, such as success or error.
     * @param {number} duration - The time in milliseconds before the message is removed.
     * @returns {void}
     */
    function toast(html, type = 'success', duration = 4000) {
        if (currentToast) {
            try { currentToast.classList.add('is-hiding'); } catch (e) { }
            try { currentToast.remove(); } catch (e) { }
            if (currentToastTimer) clearTimeout(currentToastTimer);
            currentToast = null;
            currentToastTimer = null;
        }

        const el = document.createElement('div');
        el.className = 'toast bubble ' + (type === 'error' ? 'error' : 'success');
        el.innerHTML = `<div class="content"><span>${html}</span></div><button class="x" type="button" aria-label="Stäng">×</button>`;
        toastsEl.replaceChildren(el);

        currentToast = el;

        const x = el.querySelector('.x');
        const close = () => {
            if (!el.isConnected) return;
            el.classList.add('is-hiding');
            el.addEventListener('transitionend', () => { try { el.remove(); } catch (e) { } }, { once: true });
            if (currentToast === el) { currentToast = null; currentToastTimer = null; }
        };

        currentToastTimer = setTimeout(close, duration);
        x.onclick = () => { if (currentToastTimer) clearTimeout(currentToastTimer); close(); };
    }


    /**
     * Updates the end-game icon based on whether the player won or lost.
     * It removes the existing icon and replaces it with the corresponding SVG icon.
     *
     * @param {boolean} win - Whether the player completed the game successfully.
     * @returns {void}
     */
    function setEndIcon(win) {
        const icon = document.getElementById('endIcon');
        while (icon.firstChild) icon.removeChild(icon.firstChild);
        if (win) {
            icon.insertAdjacentHTML('beforeend', `<circle cx="24" cy="24" r="22" fill="#38bdf8" stroke="#0f172a" stroke-width="4"/><path d="M16 24l6 6 10-12" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`);
        } else {
            icon.insertAdjacentHTML('beforeend', `<circle cx="24" cy="24" r="22" fill="#e5e7eb" stroke="#0f172a" stroke-width="4"/><path d="M16 32 L32 16" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/><path d="M16 16 L32 32" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>`);
        }
    }


    /**
     * Opens the end-game modal and displays the given title and message.
     * It also sets up the close button and allows the modal to be closed with Escape.
     *
     * @param {string} title - The title displayed in the end-game modal.
     * @param {string} message - The message displayed in the end-game modal.
     */
    function openEndModal(title, message) {
        document.getElementById('endTitle').textContent = title;
        endMsg.innerHTML = message;
        endModal.classList.add('open');
        document.getElementById('btnPlayAgain').focus();
        endClose.onclick = closeEndModal;
        document.addEventListener('keydown', esc);
        function esc(e) { if (e.key === 'Escape') closeEndModal(); }
        endModal._esc = esc;
    }
    function closeEndModal() { endModal.classList.remove('open'); if (endModal._esc) { document.removeEventListener('keydown', endModal._esc); endModal._esc = null; } }



    /**
     * Initializes or resets the internal game state.
     * It creates the progress data and resets the counters for a new game.
     *
     * @param {Object[]} words - The words used in the game.
     */
   function initWithWords(words, startIndex = 0) {
        const total = words.length;
        game = {
            words: words.slice(),            
            total,
            winThreshold: WIN_THRESHOLD(total),
            orderIndex: startIndex, 
            perItemState: words.map((w, idx) => ({
                id: w.id,
                firstTry: true,
                done: idx < startIndex, 
                mistakes: 0
            })), 
            firstTryCorrectCount: startIndex,
            mistakes: 0,
            completed: startIndex
        };
        renderStatus();
    }

    /** Fallback random start (used only if parent doesn't init us) */
    function startFallback() {
        const picked = FOOD_BANK.slice(0, TARGET_TOTAL);
        initWithWords(picked);
    }

    /**
     * Checks the selected item against the current target item and updates the game state.
     * It notifies the parent page of the result, displays feedback, and updates the player's progress.
     *
     * @param {string} id - The ID of the selected item.
     * @param {string} label - The label of the selected item used in the feedback message.
     */

    function pick(id, label) {
        if (!game) return;
        const ix = game.orderIndex;
        const cur = game.words[ix];
        const st = game.perItemState[ix];

        const ok = String(id) === String(cur.id); // ids now both like "banana"

        // Tell parent whether this pick was correct (enables "stick in cart")
        try {
            if (window.parent && window.parent !== window) {
                window.parent.postMessage({
                    type: 'pickResult',
                    id: String(id),
                    ok: !!ok,
                    mistakes: st.mistakes
                }, '*');
            }
        } catch (_) { }

        console.log('[popup] pick:', id, 'target:', cur?.id, 'ok?', ok);

        if (ok) {
            toast(`Bra jobbat, du hittade <strong>${cur.sv}</strong>`);
            if (st.firstTry) game.firstTryCorrectCount++;
            st.done = true;
            game.completed++;
            nextItem();
        } else {
            toast(`Fel, <strong>${label || id}</strong> är inte <strong>${cur.sv}</strong>. Försök igen!`, 'error');
            window.parent.postMessage({ type: 'wrongAnswer' }, '*');

            st.mistakes++;
            game.mistakes++;

            if (st.firstTry) {
                st.firstTry = false;
            }
        }
        renderStatus();
    }

    /**
     * Moves the game to the next unfinished item.
     * When all items are completed, it saves the results and opens the end-game screen.
     */
    function nextItem() {
        if (game.completed >= game.total) {
            const win = game.firstTryCorrectCount >= game.winThreshold;

            // Save results for the end screen (endgame.html already reads this)
            const payload = {
                total: game.total,
                correct: game.firstTryCorrectCount,
                mistakes: game.mistakes,
                threshold: game.winThreshold,
                won: win,
                timestamp: Date.now()
            };
            try { sessionStorage.setItem('game11_end_stats', JSON.stringify(payload)); } catch (_) { }

            // Tell parent to make the iframe clickable while end screen is shown
            try { window.parent.postMessage({ type: 'endgameOpen' }, '*'); } catch (_) { }

            // NEW: Tell parent that the game has ended and if it was won, so the stats API updates
            try {
                window.parent.postMessage({
                    type: 'gameEnded',
                    won: win
                }, '*');
            } catch (_) { }

            // Navigate **inside this iframe** to the end screen (NO full-page redirect)
            window.location.href = './endGame.html';

            return;
        }

        let n = game.orderIndex + 1;
        while (n < game.total && game.perItemState[n].done) n++;
        if (n >= game.total) n = game.perItemState.findIndex(s => !s.done);
        game.orderIndex = n;
    }

    function reset() {
        // If the parent previously initialized us, restart with that same order
        if (game && Array.isArray(game.words) && game.words.length) {
            initWithWords(game.words);
        } else {
            startFallback();
        }
    }

    // Expose for debugging if needed
    window.Game = { pick, reset, toast, state: () => game, initWithWords };


    // Handles communication with the parent page and initializes the popup game.
    window.addEventListener('message', function (event) {
        const data = event.data || {};
        if (!data.type) return;

        if (data.type === 'initWords' && Array.isArray(data.words) && data.words.length) {
            initedFromParent = true;
            if (readyTimer) { clearInterval(readyTimer); readyTimer = null; }
            initWithWords(data.words, data.currentIndex || 0); 
            try { window.parent.postMessage({ type: 'initDone' }, '*'); } catch (_) { }
            return;
        }

        if (data.type === 'pick' && typeof data.id === 'string') {
            pick(data.id, data.label);
            return;
        }

        // Old demo hooks kept for compatibility (optional)
        if (data.type === 'demoCorrect') {
            const cur = (game && game.words && game.words[game.orderIndex]) ? game.words[game.orderIndex] : null;
            if (cur) pick(cur.id);
        } else if (data.type === 'demoWrong') {
            toast('Försök igen!', 'error');
            const st = game?.perItemState?.[game.orderIndex];
            if (st) {
                if (st.firstTry) { st.firstTry = false; game.mistakes++; } else game.mistakes++;
                renderStatus();
            }
        } else if (data.type === 'demoReset') {
            reset();
        }
    });

    // Ask the parent for the real word list; only fall back to FOOD_BANK when
    // embedded standalone or when the parent never answers.
    if (!isEmbedded) {
        startFallback();
    } else {
        announceReady();
        let tries = 0;
        readyTimer = setInterval(() => {
            if (initedFromParent) { clearInterval(readyTimer); readyTimer = null; return; }
            announceReady();
            if (++tries > 20) {                 // ~5 s
                clearInterval(readyTimer); readyTimer = null;
                console.warn('[popup] no initWords from parent, using fallback bank');
                startFallback();
            }
        }, 250);
    }
})();