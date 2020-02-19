var todoListController = (function () {
    var todoList = function (id, description, edit) {
        this.id = id;
        this.description = description;
    }

    //stores all the todoList tasks
    var data = [];

    return {

        addItem: function (des) {
            var newItem, ID;
            //creating ID
            if (data.length > 0) {
                ID = data[data.length - 1].id + 1;
            }
            else {
                ID = 0;
            }

            //creating new item and adding to the data array
            newItem = new todoList(ID, des)
            data.push(newItem);
            console.log(data);
            return newItem;
        },

        deleteItem: function (id) {
            var index, ids;

            ids = data.map(function (current) {
                return current.id;
            });
            //finding the index using id and delete from the data array
            index = ids.indexOf(id);
            data.splice(index, 1);
            console.log(data);
        },
        getTaskCount: function () {
            return data.length;
        }
    }


})();

var UIController = (function () {
    var DOMStrings = {
        description: '.input-type',
        addButton: '.add-button',
        checkBox: '.check-box',
        editButton: '.edit-btn',
        deleteButton: '.delete-btn',
        container: '.todo-list-area',
        dateField: '.date-field',
        taskNum: '.task-num',
        plusButton: '.plus-button',
        headingEdtBtn: '.heading-edt-btn',
        headingEdtTxt: '.heading-edt-txt',
        headingEditInp: '.heading-edit-inp'
    };

    return {
        getDOMStrings: function () {
            return DOMStrings;
        },
        getInput: function () {
            return {
                inputData: document.querySelector(DOMStrings.description).value,

            };


        },
        addListItem: function (obj) {
            var html, newHtml, element;

            //creating html strings with placeholder
            element = DOMStrings.container;

            html = '<div id="item-div-%id%" class="list-item"><input type="checkbox" id="check-%id%" class="check-box"> \
            <input id="input-%id%" class="hide-btn" value="%description%" type="text"><div id="input-div-%id%" \class="todo-div">%description%</div><div id="icon-div-%id%" class="icon-pack"><button id="edit-btn-%id%"  \class="edit-btn icon-small"><ion-icon name="create-outline"></ion-icon></button><button id="cancel-btn-%id%" \class="cancel-btn hide-btn icon-small"><ion-icon name="close-circle-outline"></ion-icon></button><button \ id="delete-btn-%id%" class="delete-btn icon-small"><ion-icon name="trash-outline"></ion-icon></button></div></ \ div>';

            //replacing placeholder with actual data
            newHtml = html.replace(/%id%/g, obj.id);
            newHtml = newHtml.replace(/%description%/g, obj.description);

            //inserting html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        deleteListItem: function (selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        editListItem: function (ID) {
            var curInputElement, curDescElement, editBtnElement, canBtnElement;
            //removing division 
            curDescElement = document.getElementById('input-div-' + ID);
            curDescElement.classList.remove('todo-div');
            curDescElement.classList.add('hide-btn');

            //adding textinput section
            curInputElement = document.getElementById('input-' + ID);
            curInputElement.classList.remove('hide-btn');
            curInputElement.classList.add('todo-input');
            curInputElement.value = curDescElement.textContent;
            curInputElement.focus();

            //hiding edit button
            editBtnElement = document.getElementById('edit-btn-' + ID);
            editBtnElement.classList.add('hide-btn');

            //displaying cancel button
            canBtnElement = document.getElementById('cancel-btn-' + ID)
            canBtnElement.classList.remove('hide-btn');

        },
        cancelListItem: function (ID) {
            var curInputElement, curDescElement, editBtnElement, canBtnElement;
            curDescElement = document.getElementById('input-div-' + ID);
            curInputElement = document.getElementById('input-' + ID);
            editBtnElement = document.getElementById('edit-btn-' + ID);
            canBtnElement = document.getElementById('cancel-btn-' + ID)

            canBtnElement.classList.add('hide-btn');
            editBtnElement.classList.remove('hide-btn');

            curInputElement.classList.add('hide-btn');
            curInputElement.classList.remove('todo-input');
            curDescElement.classList.remove('hide-btn');
            curDescElement.classList.add('todo-div');
        },

        displayDate: function () {
            var date, day, days, today;
            date = new Date();
            day = date.getDay();
            today = date.getDate();
            days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            document.querySelector(DOMStrings.dateField).textContent = `${days[day]} ${today}th`;
        },

        clearFields: function () {
            document.querySelector(DOMStrings.description).value = '';
        }
    }

})();

var globalController = (function (todoListCtrl, UICtrl) {

    var DOM = UICtrl.getDOMStrings();

    var setUpEventListeners = function () {

        document.querySelector(DOM.addButton).addEventListener('click', ctrlAddItem);
        document.querySelector(DOM.plusButton).addEventListener('click', ctrlAddItem);
        document.querySelector(DOM.description).addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
                document.querySelector(DOM.description).focus();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlOperations);
        document.querySelector(DOM.container).addEventListener('keypress', () => {
            if (event.target.getAttribute('class').includes('input') && event.keyCode === 13) {
                //fetch the new desciption
                getNewDescription(event);
            }
        });
        //Click event for editing the heading
        document.querySelector(DOM.headingEdtBtn).addEventListener('click', () => {
            document.querySelector(DOM.headingEdtTxt).classList.add('hide-btn');
            document.querySelector(DOM.headingEditInp).classList.remove('hide-btn');
            document.querySelector(DOM.headingEditInp).focus();
            document.querySelector(DOM.headingEdtBtn).classList.add('hide-btn');
        });

        //Entering the new heading
        document.querySelector(DOM.headingEditInp).addEventListener('keypress', () => {
            if (event.keyCode === 13 || event.which === 13) {
                let newValue;
                newValue = event.target.value;
                document.querySelector(DOM.headingEditInp).classList.add('hide-btn');
                document.querySelector(DOM.headingEdtTxt).classList.remove('hide-btn');
                document.querySelector(DOM.headingEdtTxt).textContent = newValue;
                document.querySelector(DOM.headingEdtBtn).classList.remove('hide-btn');
            }
        });
    };

    //Get the field input data
    var ctrlAddItem = function () {
        var input, newItem;

        // get the data from the input field
        input = UICtrl.getInput();

        if (input.inputData.trim()) {
            console.log(input.inputData.trim())
            //add the item to the todoList controller
            newItem = todoListCtrl.addItem(input.inputData);

            //add the item to the UI
            UICtrl.addListItem(newItem);

            //displaying task count
            displayTaskCount();

            //clear the input fields
            UICtrl.clearFields();
        }
    };

    var getNewDescription = function (event) {
        let newValue, splitID, ID;
        newValue = event.target.value;
        splitID = event.target.id.split('-');
        ID = splitID[1];
        // document.getElementById('input-' + ID).value = '';
        document.getElementById('input-' + ID).classList.add('hide-btn');
        document.getElementById('input-div-' + ID).classList.remove('hide-btn');
        document.getElementById('input-div-' + ID).classList.add('todo-div');
        console.log(newValue);
        document.getElementById('input-div-' + ID).textContent = newValue;
        UICtrl.cancelListItem(ID);
        console.log(newValue);

    };

    var ctrlOperations = function (event) {
        var itemID, splitID, ID, deleteButton, editButton, cancelButton, enterButton;


        //For Delete operation
        itemID = event.target.parentNode.parentNode.parentNode.id;
        deleteButton = event.target.parentNode.getAttribute('class').includes('delete');
        if (itemID && deleteButton) {
            splitID = itemID.split('-');
            ID = parseInt(splitID[2]);
            //delete the item from the data structure
            todoListCtrl.deleteItem(ID);
            //deleting the element from the UI
            UICtrl.deleteListItem(itemID);
            //displaying taskcount
            displayTaskCount();
        }

        //For marking the completed task
        if (event.target.type == "checkbox") {
            itemID = event.target.parentNode.id;
            if (itemID) {
                splitID = itemID.split('-');
                ID = parseInt(splitID[2]);
                //striking the completed task
                document.getElementById('input-div-' + ID).classList.toggle('strike');
            }
        }

        //For editing the description
        editButton = event.target.parentNode.getAttribute('class').includes('edit');
        if (itemID && editButton) {
            splitID = itemID.split('-');
            ID = parseInt(splitID[2]);
            //Updating UI
            UICtrl.editListItem(ID);
        }

        // For cancel operation
        cancelButton = event.target.parentNode.getAttribute('class').includes('cancel');
        if (itemID && cancelButton) {
            splitID = itemID.split('-');
            ID = parseInt(splitID[2]);
            //Updating UI
            UICtrl.cancelListItem(ID);
        }
    }

    var displayTaskCount = function () {
        var taskCount = todoListCtrl.getTaskCount();
        document.querySelector(DOM.taskNum).innerHTML = taskCount + ' Tasks';
    }
    return {
        init: function () {
            console.log(`Application starts`)
            UICtrl.displayDate();
            displayTaskCount();
            setUpEventListeners();
        }
    }

})(todoListController, UIController);

globalController.init();