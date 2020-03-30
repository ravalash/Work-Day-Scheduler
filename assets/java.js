// Initial variables
var startTime = 9;
var endTime = 17;
var date = moment().format('MM-DD-YYYY');
var dateRaw = moment().format('YYYY-MM-DD');

// Function to build rows in schedule
function buildRows(startHour, endHour) {
    $("#schedule").empty();
    // Cycles through hours. Formats hour text based on digit length with am pm. Converts interval to formatted time and back for no good reason.
    for (x = startHour; x < endHour + 1; x++) {
        if (x < 10) {
            var hourText = moment(dateRaw + "T0" + x).format("ha");
            var rowText = moment(dateRaw + "T0" + x).format("H");
        }
        else {
            var hourText = moment(dateRaw + "T" + x).format("ha");
            var rowText = moment(dateRaw + "T" + x).format("H");
        }
        // sets IDs for columns based on time
        var timeRow = $("<div class='row timerow time-block no-gutters' id='" + rowText + "'></div>");
        var hourCol = $("<div class='col-md-1 hour pt-3'></div>");

        hourCol.text(hourText);
        timeRow.append(hourCol);
        var desCol = $("<div class='col-md-10 description'><textarea id='des" + rowText + "' rows='3'></textarea></div>");

        timeRow.append(desCol);
        var saveCol = $("<div class='col-md-1 saveBtn'><button class='btn btn-block scheduleButton mt-3'> &#x1F4BE</button> </div>");
        timeRow.attr("style", "text-align: center")
        timeRow.append(saveCol);
        $("#schedule").append(timeRow);
    }
}

// Updates colors of rows based on time
function updateSlots(mod) {
    var i = 0;
    while (x) {
        var currentRow = $("#schedule").children(".row").eq(i);
        var currentDescription = currentRow.children(".description");
        // Cycles until empty element returned
        if (currentRow.length == 0) {
            return;
        }
        var rowTime = currentRow.attr("id");
        var rowLoad = "WD" + moment().format("MMDDYYYY") + rowTime;
        // Checks parsed time against current time
        if (parseInt(rowTime) < parseInt(moment().format("H"))) {
            currentDescription.attr("class", "col-md-10 description past");
        }
        else if (parseInt(rowTime) > parseInt(moment().format("H"))) {
            currentDescription.attr("class", "col-md-10 description future");
        }
        else {
            currentDescription.attr("class", "col-md-10 description present");
        }
        // Checks for existing saved events. Flag allows updating of just colors without modifying text
        if (localStorage.getItem(rowLoad) != null && mod != false) {
            currentDescription.children("textarea").text(localStorage.getItem(rowLoad));
        }
        i++
    }
}

// Listener for start time button set. Rebuilds rows, sets colors, resets listener.
$('#setStartTime').on('click', function () {
    startTime = parseInt($("#startTimer").val());
    buildRows(startTime, endTime);
    updateSlots();
    schedListener();
});

// Listener for end time button set. Rebuilds rows, sets colors, resets listener.
$('#setEndTime').on('click', function () {
    endTime = parseInt($("#endTimer").val());
    buildRows(startTime, endTime);
    updateSlots();
    schedListener();
});

// Listener for reset button. Erases all save events from memory if they exist
$('.resetSchedule').on('click', function () {
    var resetConfirm = confirm("This will reset all saved events for the day. Proceed?");
    if (resetConfirm != true) {
        return
    }
    else {
        for (i = 4; i < 20; i++) {
            var resetHolder = "WD" + moment().format("MMDDYYYY") + i;
            if (localStorage.getItem(resetHolder) != null) {
                localStorage.setItem(resetHolder, "");
            }
        }
        buildRows(startTime, endTime);
        updateSlots();
        schedListener();
    }
});

// Sets listener for save button. Callable for when rows are rebuilt
function schedListener() {
    $(".scheduleButton").on("click", function () {
        var schedText = $(this).parent().parent().children(".description").children("textarea").val();
        var schedId = $(this).parent().parent().attr("id");
        // Creates record reference based on current date and row time
        schedId = "WD" + moment().format("MMDDYYYY") + schedId;
        localStorage.setItem(schedId, schedText);
    })
}

setInterval(function () {
    updateSlots(false);
}, 30000);

$("#currentDay").text(date);
buildRows(startTime, endTime);
updateSlots();
schedListener();
