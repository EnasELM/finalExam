const getTodosAPI = () =>
    `http://localhost:3000/todos`;



const searchForm = document.querySelector(".search--form");
const inputField = document.querySelector(".search--form__input");
const todoContainer = document.querySelector(".todo--list__container");
const todoUpdate = document.querySelector(".todo--list__Update");
const buttonSubmit = document.querySelector(".search--form__submit");
buttonSubmit.onClick = addNewTodo()

class State {
    constructor() {
        this._todos = []
    }

    get todos() {
        return this._todos;
    }

    set todos(todos) {
        this._todos = todos;
    }
}

const state = new State();







function renderTodos(todos) {
    const todosInnerHTML = todos
        .map((todo) => {
            return `<article class="todo">
       
        <div class="todo__title">${todo.title}</div>
       
        <button onclick="handleDelete(${todo.id})">Delete</button>
        <button onclick="formUpdateTodos(${todo.id})">Update</button>
    </article>`;
        })
        .join("");

    todoContainer.innerHTML = todosInnerHTML;
}


/* GET TODOS */
function setUpSearchEvent() {

    fetch(getTodosAPI())
        .then((res) => res.json())
        .then((data) => {
            state.todos = data;

            console.log(data)
            renderTodos(state.todos);

        });

}

/*POST TODO*/
function addNewTodo() {
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const todoTitle = inputField.value;
        const bodyObject = { title: todoTitle, completed: false }

        fetch(getTodosAPI(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: todoTitle, completed: false }),
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(' state.todos1', state.todos);
                // state.todos = state.todos.push(data);
                state.todos = [...state.todos, data]
                console.log('Success:', data);
                console.log(' state.todos', state.todos);

                renderTodos(state.todos);

            });
    });
}

/*PUT TODO*/
function formUpdateTodos(id) {
    const inputFiel = `<input  type="search" placeholder="enter you update title class="searrch--update">`
        // const searchFor = `<button onclick="onClikForm" class="searrch--update__button">submit</button>`
    const todosInnerHTML =
        `<article class="todo">
         ${inputFiel}
    
    </article>`;



    todoUpdate.innerHTML = todosInnerHTML;


    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const todoTitle = inputField.value;
        const bodyObject = { title: todoTitle, completed: true }

        fetch(`http://localhost:3000/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: todoTitle, completed: false }),
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(' state.todos1', state.todos);

                state.todos = [...state.todos, data]
                console.log('Success:', data);
                console.log(' state.todos', state.todos);

                renderTodos(state.todos);

            });
    });

}
///DELETE TODO
function handleDelete(id) {

    fetch(`http://localhost:3000/todos/${id}`, { method: 'DELETE' })
        .then(() => {
            const temp = [...state.todos].filter(todo => todo.id !== id);
            state.todos = temp;
            renderTodos(state.todos);
        });

}

// //initiate our app
(() => {
    setUpSearchEvent()
})()