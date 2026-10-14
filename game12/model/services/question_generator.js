let available_transports = [] 
let available_directions = []

function NextDirectionIndex(){
  if (available_directions.length === 0){
    available_directions = [0,1,2]
  }
  const position = Math.floor(Math.random()*available_directions.length)
  return available_directions.splice(position,1)[0]
}

export function GenerateQuestion(difficulty, board, number_words, directions, transports) {
  let config = {
    correctNumber: null,
    correctStreet: null,
  };

  let target_indexes = [2, 6, 5]

  if (difficulty === 1) {
    const random_index = Math.floor(Math.random() * 12)
    const all_houses = board.BuildingsHorizontal.concat(board.BuildingsVertical)

    const correct_house = all_houses[random_index]
    config.correctNumber = correct_house.houseNumber
    config.correctStreet = correct_house.street

    const number_word = number_words[correct_house.houseNumber] ?? correct_house.houseNumber

    config.promptSwedish = `Jag bor på ${correct_house.street} ${number_word.sv}.`
    config.promptEnglish = `I live at ${correct_house.street} ${number_word.en}.`

  }
   else if (difficulty === 2) {
    const random_index = NextDirectionIndex()
    
    const correct_house = board.BuildingsHorizontal[target_indexes[random_index]]
    const direction = directions[random_index]
    const landmark = board.Landmark

    config.correctNumber = correct_house.houseNumber
    config.correctStreet = correct_house.street

    config.promptSwedish = `Jag bor i huset ${direction.sv} ${landmark.nameSwedish}.`
    config.promptEnglish = `I live in the house ${direction.en} ${landmark.nameEnglish}.`
  }
   else if (difficulty === 3) {

    // Logic for making sure every transport is used before repeating
    if (available_transports.length === 0) {
        available_transports = transports.slice()
    }

    const random_index_transport = Math.floor(Math.random() * available_transports.length)
    const transport = available_transports.splice(random_index_transport, 1)[0]

    const random_index_direction = NextDirectionIndex()
    const direction = directions[random_index_direction]

    const correct_house = board.BuildingsHorizontal[target_indexes[random_index_direction]]
    const landmark = board.Landmark

    config.correctNumber = correct_house.houseNumber
    config.correctStreet = correct_house.street

    // Needed for the Difficulty 3 transport buttons
    config.transportOptions = transports.filter(
        (transport, index, array) =>
            array.findIndex(
                item => item.type === transport.type
            ) === index
    )
    config.correctTransport = transport

    config.promptSwedish = `Jag ${transport.sv} till huset som ligger ${direction.sv} ${landmark.nameSwedish}.`

    config.promptEnglish = `I ${transport.en} to the house, which is ${direction.en} ${landmark.nameEnglish}.`
}

return config}
