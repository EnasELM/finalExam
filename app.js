const getTodosAPI = `http://localhost:3000/todos`

const searchForm = document.querySelector('.search--form')
const inputField = document.querySelector('.search--form__input')
const todoContainer = document.querySelector('.todo--list__container')
const buttonSubmit = document.querySelector('.search--form__submit')
buttonSubmit.onClick = addNewTodo()

class State {
    constructor() {
        this._todos = []
    }

    get todos() {
        return this._todos
    }

    set todos(todos) {
        this._todos = todos
    }
}

const state = new State()

function renderTodos(todos) {
    const todosInnerHTML = todos
        .map((todo) => {
            console.log(todo.title, 'todo.title loop')
            return `<article class="todo">
            <input id='todo__title' name='todo__title'   disabled value=${todo.title} innerHTML=${todo.title} maxlength='100'> 
            <button onclick="formUpdateTodos(${todo.id})" class="toggle__button"> <i class='fa fa-edit'></i></button>
        <button onclick="handleDelete(${todo.id})" class="btn"><i class="fa fa-trash"></i></button>
       
    </article>`

        })
        .join('')

    todoContainer.innerHTML = todosInnerHTML
}

/* GET TODOS */
function setUpSearchEvent() {
    fetch(getTodosAPI)
        .then((res) => res.json())
        .then((data) => {
            state.todos = data
            renderTodos(state.todos)
        })
}

/*POST TODO*/
function addNewTodo() {
    searchForm.addEventListener('submit', (e) => {

        e.preventDefault()
        const todoTitle = inputField.value

        fetch(getTodosAPI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: todoTitle, completed: false }),
            })
            .then((res) => res.json())
            .then((data) => {


                state.todos = [...state.todos, data]
                inputField.value = ''

                renderTodos(state.todos)
            })
    })

}

/*update TODO*/
function formUpdateTodos(id) {
    console.log('up')
    const index = state.todos.findIndex((object) => {
        return object.id === id
    })
    const val = document.querySelector(`input[value=${state.todos[index].title}]`)
    if (state.todos[index].completed !== true) {
        val.style.display = "inline"
        val.type = "text";
        val.disabled = false
        state.todos[index].completed = true

    } else {
        fetch(getTodosAPI + "/" + id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: val.value, completed: false }),
            })
            .then((res) => res.json())
            .then((data) => {
                state.todos[index].completed = false
                state.todos[index].title = `${data.title}`
                renderTodos(state.todos)
            })
    }

}

// DELETE TODO

function handleDelete(id) {
    fetch(getTodosAPI + "/" + id, { method: 'DELETE' }).then(() => {
        const temp = [...state.todos].filter((todo) => todo.id !== id)
        state.todos = temp
        renderTodos(state.todos)
    })
}




(() => {
    setUpSearchEvent()
})()