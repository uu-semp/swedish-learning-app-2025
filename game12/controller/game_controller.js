import { GenerateQuestion } from '../model/services/question_generator'
import { GenerateBoard } from '../model/services/board_generator'
import { reactive } from 'vue'


//
//  GameController is responsible for tying the views together with the logic
//
export function GameController(difficulty) {
    const game = reactive({
        difficulty: difficulty,
        questions: [],
        boards: [],
        current_question_index: -1,
        remaining_questions: [],
        incorrect_questions: [],
        finished_questions: [],
        hint_used: false,
        selected_answer: null,
        answer_correct:  null,
        answer_locked: false,
        answer_in_round: 0,
        round_total: 0,
        is_finished: false
    })
    
    let feedback_timer = null

    let stopped = false

    function InitializeQuestions() {
        const question_count = 10

        for (let index = 0; index < question_count; index++) {
            const question = GenerateQuestion(game.difficulty)

            game.questions.push(question)
            game.boards.push(GenerateBoard(question))
            game.remaining_questions.push(index)
        }

        game.round_total = game.remaining_questions.length
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

    function NextRound() {

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

    
    InitializeQuestions()
    NextRound()

    return {
        game,
        NextRound,
        CheckAnswer,
        UseHint,
        StopGame
    }
}

