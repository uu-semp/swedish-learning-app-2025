import { GenerateQuestion } from '../model/services/question_generator.js'
import { GenerateBoard } from '../model/services/board_generator.js'
import { reactive } from 'vue'
import { Initialize, NextRound_GM, CheckAnswer_GM, UseHint_GM, StopGame_GM } from '../model/services/game_manager.js'

//
//  GameController is responsible for tying the views together with the logic
//
export async function GameController(difficulty) {
    let raw_game =  await Initialize(difficulty)
    let game = reactive(raw_game)

    let feedback_timer = null
    let stopped = false

    function NextRound() {
        NextRound_GM(game)
    }

    function CheckAnswer(question_index, answer) {
        CheckAnswer_GM(question_index, answer, game)
    }

    function UseHint() {
        UseHint_GM(game)
    }

    function StopGame() {
        StopGame_GM(game)
    }

    return {
        game,
        NextRound,
        CheckAnswer,
        UseHint,
        StopGame
    }
}