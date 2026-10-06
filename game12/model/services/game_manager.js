import { GenerateBoard } from "./board_generator.js"
import { GenerateQuestion } from "./question_generator.js"
import { get_vocab, get_category, loaddb } from "../../../scripts/vocabulary_await.js"

let feedback_timer = null
let stopped = false

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

export async function Initialize(difficulty) {
    // Load db and fetch streets and numbers. Add directions, buildnings and transports
    await loaddb();
    const street_ids = get_category("street");
    const number_ids = get_category("number");

    const streets = street_ids.map(id => get_vocab(id)?.sv).filter(Boolean)
    const numbers = number_ids.map(id => get_vocab(id)?.sv).filter(Boolean)


    let game = {
        difficulty: difficulty,
        questions: [],
        boards: [],
        current_question_index: -1,
        remaining_questions: [],
        incorrect_questions: [],
        finished_questions: [],
        hint_used: false,
        selected_answer: null,
        answer_correct: null,
        answer_locked: false,
        answered_in_round: 0,
        round_total: 0,
        is_finished: false
    }

    available_ranges = all_ranges.slice()

    if (difficulty === 1) {
        game.difficulty = 1
        for (let index = 0; index < 10; index++) {
            let board = GenerateBoard(streets, available_ranges, difficulty)

            available_ranges = available_ranges.filter(par => par[0] !== board.ChosenRange[0])
            if(available_ranges.length === 0) {
                // reset ranges
                available_ranges = all_ranges.slice()
            }

            game.boards[index] = board

            game.questions[index] = GenerateQuestion(1, board, numbers)
        }
    }

    game.remaining_questions = game.questions.map((_, i) => i)
    game.round_total = game.questions.length

    NextRound_GM(game)

    return game
}



function StartRepetitionRound(game) {
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
            StartRepetitionRound(game)
        } else {
            FinishGame(game)
            return
        }
    }

    game.current_question_index = game.remaining_questions.shift()

    game.hint_used = false
    game.selected_answer = null
    game.answer_correct = null
    game.answer_locked = false
}

export function CheckAnswer_GM(question_index, house, game) {
    if (stopped || game.is_finished || game.answer_locked) {
        return
    }

    if (question_index !== game.current_question_index) {
        return
    }

    const question = game.questions[question_index]

    game.answer_locked = true
    game.selected_answer = { street: house.street, houseNumber: house.houseNumber }
    game.answer_correct = house.street === question.correctStreet && house.houseNumber === question.correctNumber

    if (game.answer_correct && !game.hint_used) {
        game.finished_questions.push(question_index)
    }

    else {
        game.incorrect_questions.push(question_index)
    }

    game.answered_in_round += 1


    feedback_timer = setTimeout(function () {
        feedback_timer = null
        NextRound_GM(game)
    }, 2000)
}

export function UseHint_GM(game) {
    if (stopped || game.is_finished || game.answer_locked) {
        return
    }

    game.hint_used = true
}

function FinishGame(game) {
    game.is_finished = true

    window.save.set(
        'game12',
        'stage_completed_' + game.difficulty,
        true
    )
}

export function StopGame_GM(game) {
    stopped = true
    clearTimeout(feedback_timer)
    feedback_timer = null
}