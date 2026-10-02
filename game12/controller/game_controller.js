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
        finished_questions: []
    })
      
    function NextRound() {
        game.current_question_index += 1
        const question = GenerateQuestion(difficulty)
        game.questions[game.current_question_index] = question
        game.boards[game.current_question_index] = GenerateBoard(question)
    }
    
    function CheckAnswer(question_index, answer) {
        if(board[question_index].correct_answer_building_id == answer) {
            //logic for correct answer
        }
        else {
            //logic for incorrect answer
        }
    }

    // initialize the first question
    NextRound()

    // return data that the view can use to display the board and question
    return { game, NextRound, CheckAnswer }
}