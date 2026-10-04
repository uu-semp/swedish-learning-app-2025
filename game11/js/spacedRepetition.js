import {
    enableSpacedRepetition,
    disableSpacedRepetition,
    hasSpacedRepetitionConsent,
    giveSpacedRepetitionConsent,
    deleteSpacedRepetitionMemory
} from './state.js';


async function loadSpacedRepetitionHTML() {
    const response = await fetch('./html/spacedRepetition.html');

    if (!response.ok) {
        throw new Error(
            `Could not load spacedRepetition.html: ${response.status}`
        );
    }

    const html = await response.text();

    document.body.insertAdjacentHTML('beforeend', html);
}


window.addEventListener('DOMContentLoaded', async () => {

    try {
        await loadSpacedRepetitionHTML();
    } catch (error) {
        console.error('[SR] Could not load popup HTML:', error);
        return;
    }


    const srEnableBtn =
        document.getElementById('sr-enable-btn');

    const srDisableBtn =
        document.getElementById('sr-disable-btn');

    const srDeleteBtn =
        document.getElementById('sr-delete-btn');


    const srInfoModal =
        document.getElementById('sr-info-modal');

    const srAcceptBtn =
        document.getElementById('sr-accept-btn');

    const srInfoCancelBtn =
        document.getElementById('sr-info-cancel-btn');


    const srDeleteModal =
        document.getElementById('sr-delete-modal');

    const srDeleteConfirmBtn =
        document.getElementById('sr-delete-confirm-btn');

    const srDeleteCancelBtn =
        document.getElementById('sr-delete-cancel-btn');


    // ACTIVATE

    srEnableBtn?.addEventListener('click', () => {

        if (hasSpacedRepetitionConsent()) {
            enableSpacedRepetition();
            return;
        }

        srInfoModal?.classList.remove('hidden');
    });


    // ACCEPT

    srAcceptBtn?.addEventListener('click', () => {

        giveSpacedRepetitionConsent();
        enableSpacedRepetition();

        srInfoModal?.classList.add('hidden');
    });


    // CANCEL INFO

    srInfoCancelBtn?.addEventListener('click', () => {

        srInfoModal?.classList.add('hidden');
    });


    // DEACTIVATE

    srDisableBtn?.addEventListener('click', () => {

        disableSpacedRepetition();
    });


    // DELETE

    srDeleteBtn?.addEventListener('click', () => {

        srDeleteModal?.classList.remove('hidden');
    });


    // CONFIRM DELETE

    srDeleteConfirmBtn?.addEventListener('click', () => {

        deleteSpacedRepetitionMemory();

        srDeleteModal?.classList.add('hidden');
    });


    // CANCEL DELETE

    srDeleteCancelBtn?.addEventListener('click', () => {

        srDeleteModal?.classList.add('hidden');
    });

});