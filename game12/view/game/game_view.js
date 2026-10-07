import { createApp, reactive, computed, watch } from 'vue'
import { GameController } from '../../controller/game_controller.js'

// Read the difficulty selected in the menu.
const parameters = new URLSearchParams(window.location.search)
let difficulty = Number(parameters.get('difficulty'))

if (difficulty !== 1 && difficulty !== 2 && difficulty !== 3) {
    difficulty = 1
}

const controller = await GameController(difficulty)

createApp({
    setup() {
        //controller.Initialize_Controller(difficulty)
        const game = controller.game
        
        const difficulty3Selection = reactive({
        house: null,
        transport: null
        })

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
                transportOptions: currentQuestion.value.transportOptions || [],
                showTranslation: display.showTranslation,
                englishSentence: currentQuestion.value.promptEnglish,
                promptWords: display.promptWords
            }
        })

        function SelectHouse(house) {
    if (game.answer_locked || game.is_finished) {
        return
    }

    // Difficulty 1 and 2 work as before:
    // clicking a house immediately submits the answer.
    if (game.difficulty !== 3) {
        controller.CheckAnswer(
            game.current_question_index,
            house
        )
        return
    }

    if (difficulty3Selection.house?.id === house.id) {
        difficulty3Selection.house = null
    } else {
        difficulty3Selection.house = house
    }

    
    if (
        difficulty3Selection.house !== null &&
        difficulty3Selection.transport !== null
    ) {
        controller.CheckAnswer(
            game.current_question_index,
            difficulty3Selection.house,
            difficulty3Selection.transport
        )
    }
}
        

        function isSelected(house) {
            if (game.difficulty === 3) {
                return difficulty3Selection.house?.id === house.id
            }

            return game.selected_answer !== null &&
                game.selected_answer.street === house.street &&
                game.selected_answer.houseNumber === house.houseNumber
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

        function SelectTransport(transport) {
    if (game.difficulty !== 3 || game.answer_locked || game.is_finished) {
        return
    }

    if (difficulty3Selection.transport?.sv === transport.sv) {
        difficulty3Selection.transport = null
    } else {
        difficulty3Selection.transport = transport
    }

    if (
        difficulty3Selection.house !== null &&
        difficulty3Selection.transport !== null
    ) {
        controller.CheckAnswer(
            game.current_question_index,
            difficulty3Selection.house,
            difficulty3Selection.transport
        )
    }
}

        function isTransportSelected(transport) {
            return difficulty3Selection.transport !== null &&
                difficulty3Selection.transport.sv === transport.sv
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
            [function () { 
                return game.current_question_index}, 
                function () { 
                    return game.difficulty === 2 ? game.answer_locked : null }
            ],
            function () {
                difficulty3Selection.house = null
                difficulty3Selection.transport = null

                if ( game.difficulty !== 2 || (!game.answer_locked && !game.is_finished)) {
                    PrepareQuestionDisplay()
                }
            },
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
            isTransportSelected,
            SelectHouse,
            SelectTransport,
            translateWord,
            toggleTranslation,
            BackToMenu
        }
    }
}).mount('#app')

document.getElementById('loading')?.remove()