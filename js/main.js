import ToDoList from "./todolist.js";
import ToDoItem from "./todoitem.js";

const toDoList = new ToDoList();

//Launch App
document.addEventListener("readystatechange", (event) => {
    if (event.target.readyState === "complete") {
        initApp();
    }
});

const initApp = () => {
    //Add listners
    const itemEntryForm = document.getElementById("itementryform");
    itemEntryForm.addEventListener("submit", (event) => {
        event.preventDefault();
        processSubmission();
    });

    const clearItems = document.getElementById("clearbutton");
    clearItems.addEventListener("click", (event) => {
        const list = toDoList.getList();
        if (list.length) {
            const confirmed = confirm("Do you really want to clear the entire List?");

            if (confirmed) {
                toDoList.clearList();
                updatepersistentData(toDoList.getList());
                refreshThePage();
            }
        }
    });

    loadListObject();

    refreshThePage();
};

const loadListObject = () => {
    const storedList = localStorage.getItem("myTodoList");
    if (typeof (storedList) !== "string") return;
    const parsedList = JSON.parse(storedList);
    parsedList.forEach(itemObj => {
        const newTodoItem = createNewItem(itemObj._id, itemObj._item);
        toDoList.addItemToList(newTodoItem);
    });
};

const refreshThePage = () => {
    clearListDisplay();
    renderList();
    clearItemEntryField();
    setFocusOnItemEntry();
};

const clearListDisplay = () => {
    const parentElement = document.getElementById("listitems");
    deleteContents(parentElement);
};

const deleteContents = (parentElement) => {
    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
};

const renderList = () => {
    const list = toDoList.getList();
    list.forEach(item => {
        buildListItem(item);
    });

};

const buildListItem = (item) => {
    const div = document.createElement("div");
    div.className = "item";
    const check = document.createElement("input");
    check.type = "checkbox";
    check.id = item.getId();
    check.tabIndex = 0;
    addClickListnerToCheckbox(check);
    const label = document.createElement("label");
    label.htmlFor = item.getId();
    label.textContent = item.getItem();
    div.appendChild(check);
    div.appendChild(label);
    const container = document.getElementById("listitems");
    container.appendChild(div);
};

const addClickListnerToCheckbox = (checkbox) => {
    checkbox.addEventListener("click", (event) => {
        toDoList.removeItemFromList(checkbox.id);
        updatepersistentData(toDoList.getList());
        const removedText=getLableText(checkbox.id);
        updateScreenReaderConfirmation(removedText,"removed from the list");
        setTimeout(() => {
            refreshThePage();
        }, 1000);
    });

};

const getLableText=(checkboxId)=>{
    return document.getElementById(checkboxId).nextElementSibling.textContent;
}


const clearItemEntryField = () => {
    document.getElementById("newitem").value = "";
};

const setFocusOnItemEntry = () => {
    document.getElementById("newitem").focus();
};

const processSubmission = () => {
    const newEntryText = getNewEntry();
    if (!newEntryText.length) {
        return;
    }
    const nextItemId = calcNextItemId();
    const toDoItem = createNewItem(nextItemId, newEntryText);
    toDoList.addItemToList(toDoItem);
    updateScreenReaderConfirmation(newEntryText,"added");
    updatepersistentData(toDoList.getList());
    refreshThePage();
};
const getNewEntry = () => {
    return document.getElementById("newitem").value.trim();
};

const calcNextItemId = () => {
    let nextItemId = 1;
    const list = toDoList.getList();
    if (list.length > 0) {
        nextItemId = list[list.length - 1].getId() + 1;
    }
    return nextItemId;
};

const createNewItem = (itemId, itemText) => {
    const toDo = new ToDoItem();
    toDo.setId(itemId);
    toDo.setItem(itemText);
    return toDo;

};

const updatepersistentData = (listArrey) => {
    localStorage.setItem("myTodoList", JSON.stringify(listArrey));
};

const updateScreenReaderConfirmation=(newEntryText,acrionVerb)=>{
    document.getElementById("confirmation").textContent=`${newEntryText} ${acrionVerb}.`;
}
