// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoDescription = document.querySelector("#description-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const editDescription = document.querySelector("#edit-description-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;
let oldDescriptionValue;

// Funções
const saveTodo = (text, description, done = 0, save = 1) => {
    const todo = document.createElement("div");
    todo.classList.add("todo");
  
    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);
  
    const todoDescription = document.createElement("p");
    todoDescription.innerText = description; 
    todo.appendChild(todoDescription);
  
    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);
  
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);
  
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    todo.appendChild(deleteBtn);
  
    // Utilizando dados da localStorage
    if (done) {
      todo.classList.add("done");
    }
  
    if (save) {
      saveTodoLocalStorage({ text, description, done: 0 });
    }
  
    todoList.appendChild(todo);
  
    todoInput.value = "";
  };
  

  const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
  
    if (!editForm.classList.contains("hide")) {
      const todos = document.querySelectorAll(".todo");
      todos.forEach((todo) => {
        if (todo.classList.contains("selected")) {
          const title = todo.querySelector("h3").innerText;
          const description = todo.querySelector("p").innerText;
          editInput.value = title;
          editDescription.value = description;
        }
      });
    }
  };

  const updateTodo = (text, description) => {
    const todos = document.querySelectorAll(".todo");
  
    todos.forEach((todo) => {
      const todoTitle = todo.querySelector("h3").innerText;
  
      if (todoTitle === oldInputValue) {
        todo.querySelector("h3").innerText = text;
        todo.querySelector("p").innerText = description;
        updateTodoLocalStorage(oldInputValue, text, description);
      }
    });
  };

const getSearchedTodos = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    const todoTitle = todo.querySelector("h3").innerText.toLowerCase();

    todo.style.display = "flex";

    console.log(todoTitle);

    if (!todoTitle.includes(search)) {
      todo.style.display = "none";
    }
  });
};

const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));

      break;

    case "done":
      todos.forEach((todo) =>
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );

      break;

    case "todo":
      todos.forEach((todo) =>
        !todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );

      break;

    default:
      break;
  }
};

// Eventos
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;
  const descriptionValue = todoDescription.value;

  if (inputValue) {
    saveTodo(inputValue, descriptionValue);
  }
});

document.addEventListener("click", (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest(".todo");
    
    if (targetEl.classList.contains("edit-todo")) {
        toggleForms();
        
        if (parentEl) {
            const title = parentEl.querySelector("h3").innerText;
            const description = parentEl.querySelector("p").innerText;
            
            editInput.value = title;
            editDescription.value = description;
            oldInputValue = title;
            oldDescriptionValue = description;
        }
    } else if (targetEl.classList.contains("finish-todo")) {
        if (parentEl) {
            parentEl.classList.toggle("done");
            const title = parentEl.querySelector("h3").innerText;
            updateTodoStatusLocalStorage(title);
        }
    } else if (targetEl.classList.contains("remove-todo")) {
        if (parentEl) {
            const title = parentEl.querySelector("h3").innerText;
            parentEl.remove();
            removeTodoLocalStorage(title);
        }
    }
});
cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
    e.preventDefault();
  
    const editInputValue = editInput.value;
    const editDescriptionValue = editDescription.value; 
  
    if (editInputValue || editDescriptionValue) {
      updateTodo(editInputValue, editDescriptionValue);
    }
  
    toggleForms();
  });
  

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;

  getSearchedTodos(search);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();

  searchInput.value = "";

  searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;

  filterTodos(filterValue);
});

// Local Storage
const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  return todos;
};

const loadTodos = () => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    saveTodo(todo.text,todo.description, todo.done, 0);
  });
};

const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();

  todos.push(todo);

  localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  const filteredTodos = todos.filter((todo) => todo.text != todoText);

  localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

const updateTodoStatusLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoText ? (todo.done = !todo.done) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

const updateTodoLocalStorage = (oldText, newText, newDescription) => {
    const todos = getTodosLocalStorage();
  
    todos.forEach((todo) => {
      if (todo.text === oldText) {
        todo.text = newText;
        todo.description = newDescription;
      }
    });
  
    localStorage.setItem("todos", JSON.stringify(todos));
  };

const handleInputPlaceholder = (input) => {
    const originalPlaceholder = input.getAttribute("placeholder");

    input.addEventListener("focus", () => {
        input.removeAttribute("placeholder");
    });

    input.addEventListener("blur", () => {
        if (input.value === "") {
            input.setAttribute("placeholder", originalPlaceholder);
        }
    });
};

handleInputPlaceholder(todoInput);
handleInputPlaceholder(todoDescription);
handleInputPlaceholder(editInput);
handleInputPlaceholder(editDescription);

loadTodos();