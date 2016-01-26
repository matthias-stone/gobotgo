//var gameRoot = "http://localhost:8100/api/v1/game/"
var gameRoot = "http://gobotgo.bellstone.ca/api/v1/game/";
var startGame = gameRoot + "start/";
var size = 19;

var receiveState;
var waitForServer;
var playerColor;
var lastBoard;
var sendMove;
var playRoot;
var gameID;

// initialize some sample data and draw the table containing it
function init() {
    createTable(size);
    $.get(startGame, setUpGame).fail(connectError);
}

function setUpGame(data, status) {
    console.log("Game started. Your Color: " + data["color"] + "The game ID: " + data["ID"]);

    gameID = data["ID"];
    playerColor = data["color"];
    playRoot = gameRoot + "play/" + gameID + "/";
    sendMove = playRoot + "move/";
    waitForServer = playRoot + "wait/";
    receiveState = playRoot + "state/";

    showToast("Game started. ID: " + gameID + " Your color: " + playerColor, 3000);
    $.get(receiveState, boardRefresh).fail(connectError);
}

// Add the player's new move to the board, wait on a new move from opponent
function getState(data, success) {
    $.get(receiveState, boardRefresh).fail(connectError);
    waitForMove();
}

// Notify that wait is in progress, send the request off to server.
function waitForMove(){
    showToast("Waiting for move", 2000);
    $.get(waitForServer, moveReceived).fail(connectError);
}

// Notify on move received. Refresh the board.
function moveReceived(){
    showToast("Move recieved", 2000);
    $.get(receiveState, boardRefresh).fail(connectError);
}

function boardRefresh(data, status) {
    var color;
    console.log("data", data);
    console.log(status);
    for ( var i = 0; i < data["board"].length; i++ ) {

        for ( var j = 0; j < data["board"].length; j++ ) {

            if ( data["board"][i][j] == "None") {
                color = "img/null.png"
            }       
            else if ( data["board"][i][j] == "Black" ) {
                color = "img/black.png"
            }  
            else if ( data["board"][i][j] == "White" ) {
                color = "img/white.png"
            }

            $('#GameBoard tr').eq(j+1).find('td').eq(i+1).find('img').attr('src', color);
        }
    }
}

function connectError(err){
    console.log(err);
    showToast("Server Error. Check console.", 2000);
}

$('#GameBoard').on('click', 'td', function(_evt) {
    console.log("Clicked", this, _evt);
    $.post(sendMove, JSON.stringify([_evt.currentTarget.cellIndex-1, _evt.currentTarget.parentElement.rowIndex-1]), getState).fail(connectError);
});

// Mouseover event for gameboard elements
$('#GameBoard').on('mouseenter', 'td', function(_evt) {
    $('.feedbackBox').text("X: " + _evt.currentTarget.cellIndex + ", Y: " + String.fromCharCode(65+_evt.currentTarget.parentElement.rowIndex-1));
    if ( _evt.currentTarget.cellIndex > 0 ) {
        _evt.currentTarget.style.backgroundColor = "green";
    }
});

// Mouseout event for gameboard elements
$('#GameBoard').on('mouseleave', 'td', function(_evt) {
    $('.feedbackBox').text("");
    _evt.currentTarget.style.backgroundColor = "transparent";
});

// Force request a new board from the server
$('.refresh').click(function () {
    $.get(receiveState, boardRefresh).fail(connectError);
});

// Send a 'pass' move (empty) to the server.
$('.pass').click(function () {
    $.post(sendMove, "[]", showToast("Send okay", 2000)).fail(connectError);
});

// Activate the temporary notification 'toast' for _time ms with _message
function showToast(_message, _time) {
    $('.error').text(_message);
    $('.error').stop().fadeIn(400).delay(_time).fadeOut(400);
}

// Render the board
function createTable(size) {

    // Create numbers across top
    var header = $("<tr>")    
    $("#GameBoard").append(header);

    for (var i = 0; i < size+1; i++) {
        header.append("<th>" + i + "</th>");
    }

    header.append("</tr>");

    // Create rows
    $("GameBoard").append("<tr>");

    for (var i = 0; i < size; i++) {   
        var row = $("<tr />")
        $("#GameBoard").append(row);

        row.append($("<td>" + String.fromCharCode(65+i) + "</td>")); // add the letters on the left

        for (var j = 0; j < size; j++) {
            row.append($("<td>" + "<img src=img/null.png>" + "</td>"));
        }
    }
}
