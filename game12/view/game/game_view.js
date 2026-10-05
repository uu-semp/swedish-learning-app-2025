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
            showTranslation: false,
            promptWords: []
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
            const selectedHouse = visibleHouses.value.find(function (house) {
                return house.id === game.selected_answer
            })

            return {
                progress: game.answered_in_round,
                progressMax: game.round_total,
                roadType: currentBoard.value.type,
                horizontalStreet: currentBoard.value.horizontalStreet,
                verticalStreet: currentBoard.value.verticalStreet,
                selectedHouse: selectedHouse || null,
                showTranslation: display.showTranslation,
                englishSentence: currentQuestion.value.promptEnglish,
                promptWords: display.promptWords
            }
        })

        function SelectHouse(house) {
            controller.CheckAnswer(
                game.current_question_index,
                house.id
            )
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

            // Should translation of invididual wordscount as a hint??? -Oskar
            controller.UseHint()
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
            game,
            view,
            visibleHouses,
            progressPercentage,
            SelectHouse,
            translateWord,
            toggleTranslation,
            BackToMenu
        }
    }
}).mount('#app')