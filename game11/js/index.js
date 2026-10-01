window.addEventListener('DOMContentLoaded', () => {

    window.vocabulary.load_game_data(11);


    const popupFrame = document.getElementById('popupFrame');
    const popupWrap = document.querySelector('.popup-frame-wrap');

    if (popupWrap) {
        popupWrap.classList.remove('is-endgame');
        popupWrap.style.pointerEvents = 'none';
    }


    function setIframeInteractive(on) {
        const wrap = document.querySelector('.popup-frame-wrap');
        const frame = document.querySelector('.popup-frame');

        if (!wrap || !frame) return;

        wrap.style.pointerEvents = on ? 'auto' : 'none';
        frame.style.pointerEvents = on ? 'auto' : 'none';
        wrap.classList.toggle('is-endgame', on);
    }


    const keyFromImgPath = (p) => {
        if (!p) return undefined;

        const base = p.split('/').pop() || '';
        return base.split('.')[0].toLowerCase();
    };


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


    function haveShoppingList() {
        const gs = window.__game11GameState;

        return !!(
            gs &&
            Array.isArray(gs.shoppingList) &&
            gs.shoppingList.length > 0
        );
    }


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
                words
            },
            '*'
        );

        return false;
    }


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
            settingsModal.classList.remove('hidden');
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
            localStorage.removeItem('game11_game_state');
            window.location.reload();
        });
    }


    // MODE 2

    const Mode2Btn = document.getElementById('mode2-btn');

    if (Mode2Btn) {
        Mode2Btn.addEventListener('click', () => {

            const state = window.__game11GameState;

            if (state.mode == 1) {
                state.mode = 2;
            } else {
                state.mode = 1;
            }

            localStorage.setItem(
                'game11_game_state',
                JSON.stringify(state)
            );

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

            toggleContrastBtn.textContent =
                isActive ? 'PÅ' : 'AV';

            toggleContrastBtn.classList.toggle(
                'active',
                isActive
            );
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


window.addEventListener('message', (event) => {

    const data = event.data || {};

    if (
        data.type === 'pickResult' &&
        typeof data.id === 'string'
    ) {
        if (data.ok) {
            window.Game11UI?.placeItemInCart?.(data.id);
        }
    }
});

window.addEventListener('message', (event) => {
    if (event.data?.type !== 'playAgain') return;

    console.log('[parent] playAgain');

    localStorage.removeItem('game11_game_state');
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