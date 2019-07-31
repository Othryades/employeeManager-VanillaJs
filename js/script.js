//dragable function from JQuery UI
$(function () {
    var tabs = $("#tabs").tabs();
    tabs.find(".ui-tabs-nav").sortable({
        axis: "x",
        stop: function () {
            tabs.tabs("refresh");
        }
    });
});

//Submit form and RegExp validation and create new employee
$(function () {
    var list = employeeManager.getEmployeeArrayFromToLocalStorage();
    var dialog, form,
        number = $("#number"),
        name = $("#name"),
        idE = $("#idE"),
        birthday = $("#birthday"),
        gender = $(".service").change(function () {
            gender = $(this).val();
        }),
        allFields = $([]).add(number).add(name).add(idE).add(birthday).add(gender),
        tabCounter = 0,
        tabTemplate = "<li><a href='#{href}'>#{label}</a></li>",
        // tabContent = $("#tab_content"),
        tips = $(".validateTips");
    var tabs = $("#tabs").tabs();

    //show an error message if not valid
    function updateTips(t) {
        tips
            .text(t)
            .addClass("ui-state-highlight");
        setTimeout(function () {
            tips.removeClass("ui-state-highlight", 1500);
        }, 500);
    }

    function checkLength(o, n, min, max) {
        if (o.val().length > max || o.val().length < min) {
            o.addClass("ui-state-error");
            updateTips("Length of " + n + " must be between " +
                min + " and " + max + ".");
            return false;
        } else {
            return true;
        }
    }

    //check age of the employee (must be over 18 y/o)
    function checkAge(date) {
        var month = date.slice(5, 7);
        var day = date.substr(8, 9);
        var year = date.substr(0, 4);
        var age = 18;
        var mydate = new Date();
        mydate.setFullYear(year, month - 1, day);

        var currdate = new Date();
        currdate.setFullYear(currdate.getFullYear() - age);
        if ((currdate - mydate) < 0) {
            $('.validateTips').text("Sorry, only persons over the age of " + age + " may enter this site");
            return false;
        } else return true;
    }

    function checkRegexp(o, regexp, n) {
        if (!(regexp.test(o.val()))) {
            o.addClass("ui-state-error");
            updateTips(n);
            return false;
        } else {
            return true;
        }
    }

    //first iteration of the employee if they exist in LocalStorage
    addTab(list);


    //create new tab using Jquery UI
    function addTab(list) {
        if (list) {
            for (var i = 0; i < list.length; i++) {

                var label = list[tabCounter].name || "Tab " + tabCounter,
                    id = "tabs-" + tabCounter,
                    li = $(tabTemplate.replace(/#\{href\}/g, "#" + id).replace(/#\{label\}/g, label));

                tabContentHtml =
                    '<div id="users-contain" class="ui-widget">' +
                    '<table id="users" class="ui-widget ui-widget-content">' +
                    '<tr>' +
                    '<th>Employee Number :</th>' +
                    '<td>' + list[tabCounter].number + '</td>' +
                    '<tr>' +

                    '<tr>' +
                    '<th>Employee Name :</th>' +
                    '<td>' + list[tabCounter].name + '</td>' +
                    '<tr>' +

                    '<tr>' +
                    '<th>Employee Id :</th>' +
                    '<td>' + list[tabCounter].idE + '</td>' +
                    '<tr>' +

                    '<tr>' +
                    '<th>Employee birthday :</th>' +
                    '<td>' + list[tabCounter].birthday + '</td>' +
                    '<tr>' +

                    '<tr>' +
                    '<th>Employee gender :</th>' +
                    '<td>' + list[tabCounter].radioValue + '</td>' +
                    '<tr>' +

                    '</tr>' +
                    '</table>' +
                    '</div>';

                tabs.find(".ui-tabs-nav").append(li);
                tabs.append("<div id='" + id + "'><p>" + tabContentHtml + "</p></div>");
                tabs.tabs("refresh");
                tabCounter++;
            }
        }
    }


    //create new employee and save them ib LocalStorage
    function addUser() {
        var valid = true;
        allFields.removeClass("ui-state-error");

        valid = valid && checkLength(number, "number", 4, 8);
        valid = valid && checkLength(name, "name", 1, 15);
        valid = valid && checkLength(idE, "idE", 1, 15);
        valid = valid && checkLength(birthday, "birthday", 5, 16);

        valid = valid && checkRegexp(number, /^([0-9])+$/, "Password field only allow : a-z 0-9");
        valid = valid && checkRegexp(name, /^[a-z]([a-z_\s])+$/i, "Username may consist of a-z, 0-9, underscores, spaces and must begin with a letter.");
        valid = valid && checkRegexp(idE, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9");
        var date = birthday.val();
        valid = checkAge(date);

        if (valid) {
            var data = {
                'number': number.val(),
                'name': name.val(),
                'idE': idE.val(),
                'birthday': birthday.val(),
                'radioValue': gender,
            };
            employeeManager.addToEmployeeArrayAndSaveToLocalStorage(data);
            dialog.dialog("close");
            var list = employeeManager.getEmployeeArrayFromToLocalStorage();
            addTab(list);
        }
        return valid;
    }

    dialog = $("#dialog-form").dialog({
        autoOpen: false,
        height: 400,
        width: 350,
        modal: true,
        buttons: {
            "Add Employee": addUser
        },
        close: function () {
            form[0].reset();
            allFields.removeClass("ui-state-error");
        }
    });

    form = dialog.find("form").on("submit", function (event) {
        event.preventDefault();
        addUser();
    });

    $("#create-user").button().on("click", function () {
        dialog.dialog("open");
    });
});


//Object who manage localstorage of new and existing employee in LocalStorage 
var employeeManager = {

    // employees: [],

    addToEmployeeArrayAndSaveToLocalStorage: function (item) {
        var oldItems = JSON.parse(localStorage.getItem('employeesList')) || [];
        var newItem = item;
        oldItems.push(newItem);
        localStorage.setItem('employeesList', JSON.stringify(oldItems));
    },

    getEmployeeArrayFromToLocalStorage: function () {
        var list = localStorage.getItem('employeesList');
        var objList = JSON.parse(list);
        console.log(objList);
        return objList;
    }
}