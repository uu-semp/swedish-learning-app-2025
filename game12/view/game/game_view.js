import { createApp, reactive, computed, watch } from 'vue'
import { GameController } from '../../controller/game_controller.js'

createApp({
    setup() {
        // Read the difficulty selected in the menu.
        const parameters = new URLSearchParams(window.location.search)
        let difficulty = Number(parameters.get('difficulty'))

        if (difficulty !== 1 && difficulty !== 2 && difficulty !== 3) {
            difficulty = 1
        }

        const controller = GameController(difficulty)
        //controller.Initialize_Controller(difficulty)
        const game = controller.game

        // Traslation display state 
        const display = reactive({
            language: localStorage.getItem("game12Language") || "sv",
            showTranslation: false,
            promptWords: []
        })

        function setLanguage(language) {
            display.language = language
            localStorage.setItem("game12Language", language)
            document.documentElement.lang = language

            document.title = language === "en"
                ? "Find the right house"
                : "Hitta rätt hus"
        }

        function useEnglish() {
            setLanguage("en")
        }

        function useSwedish() {
            setLanguage("sv")
        }

        const englishButton = window.parent.document.getElementById("lang-eng")
        const swedishButton = window.parent.document.getElementById("lang-sv")

        englishButton.addEventListener("click", useEnglish)
        swedishButton.addEventListener("click", useSwedish)

        setLanguage(display.language)

        window.addEventListener("pagehide", function () {
            englishButton.removeEventListener("click", useEnglish)
            swedishButton.removeEventListener("click", useSwedish)
        })

        const currentQuestion = computed(function () {
            return game.questions[game.current_question_index]
        })

        const currentBoard = computed(function () {
            return game.boards[game.current_question_index]
        })

        const visibleHouses = computed(function () {
            if (game.difficulty === 1) {
                return currentBoard.value.BuildingsHorizontal.concat(currentBoard.value.BuildingsVertical)
            }
            else {
                return currentBoard.value.BuildingsHorizontal
            }
        })

        const progressPercentage = computed(function () {
            if (game.round_total === 0) {
                return "0%"
            }

            return (
                game.answered_in_round / game.round_total
            ) * 100 + "%"
        })

        // Values displayed by game.html
        const view = computed(function () {
            const selectedHouse = visibleHouses.value.find(isSelected)

            return {
                progress: game.answered_in_round,
                progressMax: game.round_total,
                roadType: currentBoard.value.type,
                horizontalStreet: currentBoard.value.HorizontalStreet,
                verticalStreet: currentBoard.value.VerticalStreet,
                selectedHouse: selectedHouse || null,
                showTranslation: display.showTranslation,
                englishSentence: currentQuestion.value.promptEnglish,
                promptWords: display.promptWords
            }
        })

        function SelectHouse(house) {
            controller.CheckAnswer(
                game.current_question_index,
                house
            )
        }

        function isSelected(house){
            return game.selected_answer !== null && game.selected_answer.street === house.street && game.selected_answer.houseNumber === house.houseNumber
        }

        function toggleTranslation() {
            if (game.answer_locked || game.is_finished) {
                return
            }

            display.showTranslation = !display.showTranslation

            if (display.showTranslation) {
                controller.UseHint()
            }
        }

        function translateWord(word) {
            if (!word.canTranslate || game.answer_locked || game.is_finished) {
                return
            }

            word.translated = !word.translated

        }

        function BackToMenu() {
            controller.StopGame()
            window.location.href = "../menu/index.html"
        }

        function PrepareQuestionDisplay() {
            display.showTranslation = false
            display.promptWords = []

            const question = currentQuestion.value

            // Optional matching word pairs supplied by the model.
            if (question.wordPairs) {
                for (const pair of question.wordPairs) {
                    display.promptWords.push({
                        sv: pair.sv,
                        en: pair.en,
                        canTranslate: Boolean(pair.en) && pair.en !== pair.sv,
                        translated: false
                    })
                }
            } else {
                // Display the real question even without individual translations.
                for (const word of question.promptSwedish.split(" ")) {
                    display.promptWords.push({
                        sv: word,
                        en: "",
                        canTranslate: false,
                        translated: false
                    })
                }
            }
        }

        // Reset display settings when the controller changes questions.
        watch(
            function () {
                return game.current_question_index
            },
            PrepareQuestionDisplay,
            { immediate: true }
        )

        // The controller finishes after the final feedback delay.
        watch(
            function () {
                return game.is_finished
            },
            function (finished) {
                if (finished) {
                    window.location.href = "../end_screen/end_screen.html?difficulty=" + difficulty
                }
            }
        )

        return {
            display,
            game,
            view,
            visibleHouses,
            progressPercentage,
            isSelected,
            SelectHouse,
            translateWord,
            toggleTranslation,
            BackToMenu
        }
    }
}).mount('#app')