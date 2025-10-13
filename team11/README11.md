# Important information for the next developer, from group 11.

# BUGS
1. The play again button does not reset the game. It may look like it, however, the game does not refresh/rerender. This means that regardless of what the user might choose (correct/incorrect), everything is marked as incorrect and the game cant be won. This button would need to restart the game.

2. The drag and drop (Dnd) functionality does not mark the correct word as correct. It understand what is correct/incorrect sinve only the correct object  stays in the shoppingcart. However, it does not add to the games counter/threshold. When clicking on the item, this works. So this functionality needs to be refined to work in a similar way.