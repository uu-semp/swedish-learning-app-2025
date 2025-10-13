# Important information for the next developer, from group 11.

# BUGS
1. The play again button does not reset the game. It may look like it, however, the game does not refresh/rerender. This means that regardless of what the user might choose (correct/incorrect), everything is marked as incorrect and the game cant be won. This button would need to restart the game.

2. The drag and drop (DnD) functionality does not mark the correct word as correct. It understand what is correct/incorrect sinve only the correct object  stays in the shoppingcart. However, it does not add to the games counter/threshold. When clicking on the item, this works. So this functionality needs to be refined to work in a similar way.

# IMAGE CREDIT
Bilder: Papunets bildbank, papunet.net, Elina Vanninen, Sergio Palao / ARASAAC och Sclera.

# STRUCTURE
Much of the code is spread across different files as it was developed in parallell. It would benefit to be strucutred better in the html/css files. Especially to separate all gamelogic from the html files and put it in the correct js file. This is all things we wanted to fix but didn't have time to prioritize.