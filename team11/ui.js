const shelf_items = document.querySelector('.shelf_items');
const shopping_list = document.querySelector('.shopping_list')

export function displayShelf(shelf) {
    shelf.forEach(url => {
        const img = document.createElement('img');
        img.src = "../" + url.img;
        console.log(img.src);
        shelf_items.appendChild(img);
    });
    console.log("Displaying shelf");
}

export function displayShoppingList(list) {
    const ul = document.createElement('ul');
    ul.className = 'shopping-list';
    list.forEach(item => {
        const li = document.createElement('li');
        // Om item är ett objekt med t.ex. namn eller label
        li.textContent = item.sv
        ul.appendChild(li);
    });
    shopping_list.appendChild(ul);
    console.log("Displaying shopping list");
}