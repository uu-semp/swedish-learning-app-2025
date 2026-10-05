import { GenerateBoard } from "./board_generator.js"
import { GenerateQuestion } from "./question_generator.js"


let feedback_timer = null
let stopped = false

let all_streets = [
    "Ringgatan",
    "Sysslomansgatan",
    "Drottninggatan",
    "Kungsgatan",
    "Svartbäcksgatan"
]

let all_ranges = [
    [1, 10],
    [11, 21],
    [22, 32],
    [33, 43],
    [44, 54],
    [55, 65],
    [66, 76],
    [87, 97],
    [89, 99]
]

let available_ranges = []

export function Initialize(difficulty, game) {
    available_ranges = all_ranges

    if (difficulty === 1) {
        game.difficulty = 1
        for (let index = 0; index < 10; index++) {
            let board = GenerateBoard(all_streets, available_ranges, difficulty)

            console.log(board)

            all_ranges = all_ranges.filter(par => par[0] !== board.ChosenRange[0])

            game.boards[index] = board

            game.questions[index] = GenerateQuestion(1, board)
        }
    }

    game.remaining_questions = game.questions.map((_, i) => i)
    game.round_total = game.questions.length

}

function StartRepetitionRound() {
    while (game.incorrect_questions.length > 0) {
        const random_index = Math.floor(Math.random() * game.incorrect_questions.length)

        const question_index = game.incorrect_questions[random_index]

        game.remaining_questions.push(question_index)

        game.incorrect_questions.splice(random_index, 1)
    }

    game.answered_in_round = 0
    game.round_total = game.remaining_questions.length

}

export function NextRound_GM(game) {

    if (stopped || game.is_finished) {
        return
    }


    if (feedback_timer !== null) {
        return
    }

    if (game.current_question_index !== -1 && !game.answer_locked) {
        return
    }

    if (game.remaining_questions.length === 0) {
        if (game.incorrect_questions.length > 0) {
            StartRepetitionRound()
        } else {
            FinishGame()
            return
        }
    }

    game.current_question_index = game.remaining_questions.shift()

    game.hint_used = false
    game.selected_answer = null
    game.answer_correct = null
    game.answer_locked = false
}

function CheckAnswer(question_index, answer) {
    if (stopped || game.is_finished || game.answer_locked) {
        return
    }

    if (question_index !== game.current_question_index) {
        return
    }

    const board = game.boards[question_index]

    game.answer_locked = true
    game.selected_answer = answer
    game.answer_correct = board.correct_answer_building_id === answer

    if (game.answer_correct && !game.hint_used) {
        game.finished_questions.push(question_index)
    }

    else {
        game.incorrect_questions.push(question_index)
    }

    game.answered_in_round += 1

    feedback_timer = setTimeout(function () {
        feedback_timer = null
        NextRound()
    }, 2000)
}

function UseHint() {
    if (stopped || game.is_finished || game.answer_locked) {
        return
    }

    game.hint_used = true
}

function FinishGame() {
    game.is_finished = true

    window.save.set(
        'game12',
        'stage_completed_' + game.difficulty,
        true
    )
}

function StopGame() {
    stopped = true
    clearTimeout(feedback_timer)
    feedback_timer = null
}