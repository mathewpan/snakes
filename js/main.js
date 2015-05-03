$(document).ready(function(){
	
	// Ok grab the canvas
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var canvasWidth = $("#canvas").width();
	var canvasHeight = $("#canvas").height();
	
	var keepPlaying = false;
	
	// Width of the cells
	var cellWidth = 5;
	
	// Create collection of snakes
	var snakes = [];
	
	// Create the collection of occupied cells
	var occupiedCells = [];
	
	// Main function to start the game
	function start_game()
	{
	  // TODO have some setup logic, choose players etc
	  
	  // for now, just call init
	  init();
	}
	
	function end_game(winnerIndex)
	{
	  keepPlaying = false;
	  
	  if (winnerIndex !== undefined)
	  {
	    var snake = snakes[winnerIndex];
	    show_winning_message(snake.label);
	  }
	}
	
	function show_winning_message(label)
	{
	  // Draw some text here, with some kind of a timer on resuming the next game?
	  // Or wait for button combo? Probably just add a message.
	  ctx.fillStyle = "white";
		ctx.fillText("Winner is " + label, canvasWidth/2, canvasHeight - 15);
	}
	
	function reset() {
	  
	  // Just start the game again for now
	  start_game();
	}
	
	function init()
	{
	  keepPlaying = true;
	  
	  occupiedCells = [];
	  snakes = [];
	  
		snakes.push(create_snake("green", 1));
		snakes.push(create_snake("red", 2));
		snakes.push(create_snake("blue", 3));
		
		paint_init();
		
		// Moving the snakes with a timer, every 60ms
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		
		game_loop = setInterval(paint, 60);
	}
	
	function create_snake(colour, number)
	{
	  // Choose the starting direction
	  var directionRandom = Math.floor((Math.random() * 100) + 1);
	  
	  var direction = "right";
	  if (directionRandom < 25) direction = "up";
	  else if (directionRandom < 50) direction = "left";
	  else if (directionRandom < 75) direction = "down";
	  
	  var startingLocation = generate_starting_location();
	  
	  var snake = new Snake(colour, number, startingLocation.x, startingLocation.y, direction);
	  occupiedCells.push({x: startingLocation.x, y: startingLocation.y});
		
		return snake;
	}
	
	function generate_starting_location()
	{
	  var possibleX = Math.floor((Math.random() * 100) + 1);
	  var possibleY = Math.floor((Math.random() * 100) + 1);
	  
	  if (check_collision(possibleX, possibleY))
	  {
	    // Cell is already taken, regenerate
	    return generate_starting_location();
	  }
	  
	  return {x: possibleX, y: possibleY};
	}
	
	function paint_init()
	{
	  // As an optimisation, only draw the canvas once, this will save rerendering each snake trail
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);
		ctx.strokeStyle = "white";
		ctx.strokeRect(0, 0, canvasWidth, canvasHeight);
		
		// Now draw the labels for each snake
		for (var i = 0; i < snakes.length; i++)
		{
		  var snake = snakes[i];
		  
		  ctx.fillStyle = snake.colour;
		  ctx.fillText(snake.label, (50 * (i)) + 5, canvasHeight - 5);
		}
	}
	
	function check_whose_alive()
	{
	  var aliveSnakes = [];
	  
	  for (var i = 0; i < snakes.length; i++)
	  {
	    var snake = snakes[i];
	    
	    if (snake.alive)
	    {
	      aliveSnakes.push(i);
	    }
	  }
	  
	  if (aliveSnakes.length === 0)
	  {
	    end_game();
	  }
	  else if (aliveSnakes.length == 1)
	  {
	    end_game(aliveSnakes[0]);
	  }
	  
	  // More than one alive? Keep going!
	}
	
	// The main draw loop
	function paint()
	{
	  if (!keepPlaying)
	  {
	    return;
	  }
	  
	  check_whose_alive();
	  
		for (var i = 0; i < snakes.length; i++)
		{
		  var gap = Math.floor((Math.random() * 10) + 1);
		  var isGap = gap == 3;
		  
		  var snake = snakes[i];
		  
		  if (!snake.alive)
		  {
		    continue;
		  }
		  
		  // Get the current location of the snake
  		var nx = snake.x;
  		var ny = snake.y;
  		
  		// Now move it to its directed location
  		if(snake.direction == "right") nx++;
  		else if(snake.direction == "left") nx--;
  		else if(snake.direction == "up") ny--;
  		else if(snake.direction == "down") ny++;
  		
  		// Game over clauses.
  		// If the snake goes outside the box its finished.
  		// If it hits an existing trail its finished.
  		if(nx == -1 || nx == canvasWidth/cellWidth || ny == -1 || ny == canvasHeight/cellWidth || check_collision(nx, ny))
  		{
  			// TODO kill the snake
  			snake.kill();
  			
  			// for now, just reset
  			//end_game();
  			
  			return;
  		}
  		else
  		{
  		  // Add the cell to the occupied list, unless its a gap
  		  if (!isGap)
  		  {
  		    occupiedCells.push({x: nx, y: ny});
  		  }
  		  
  		  snake.x = nx;
  		  snake.y = ny;
  		}
  		
  		// Draw the cell, unless its a gap
  		if (!isGap)
		  {
		    paint_cell(snake.colour, snake.x, snake.y);
		  }
		}
	}
	
	//Lets first create a generic function to paint cells
	function paint_cell(fillColour, x, y)
	{
		ctx.fillStyle = fillColour;
		ctx.fillRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
	}
	
	// Checks if the input cells are in the occupied list
	function check_collision(x, y)
	{
		for(var i = 0; i < occupiedCells.length; i++)
		{
			if(occupiedCells[i].x == x && occupiedCells[i].y == y)
			 return true;
		}
		return false;
	}
	
	function get_direction(currentDirection, inputDirection)
	{
	  var direction = "";
	  
	  if (currentDirection == "up")
	  {
	    direction = inputDirection;
	  }
	  else if (currentDirection == "left")
	  {
	     direction = (inputDirection == "left") ? "down" : "up";
	  }
	  else if (currentDirection == "down")
	  {
	    direction = (inputDirection == "left") ? "right" : "left";
	  }
	  else if (currentDirection == "right")
	  {
	    direction = (inputDirection == "left") ? "up" : "down";
	  }
	  
	  return direction;
	}
	
	function handle_keypress(key)
	{
	  var direction = "";
	  
	  if (key == "13")
	  {
	    // Restart the game
	    reset();
	  }
	  
	  // The direction clause prevents going in reverse
		if(key == "37") direction = "left";
		else if(key == "39") direction = "right";
		
		if (direction !== "")
		{
		  set_direction(0, direction);
		  return;
		}
		
		if(key == "49") direction = "left";
		else if(key == "50") direction = "right";
		
		if (direction !== "")
		{
		  set_direction(1, direction);
		  return;
		}
		
		if(key == "86") direction = "left";
		else if(key == "66") direction = "right";
		
		if (direction !== "")
		{
		  set_direction(2, direction);
		  return;
		}
	}
	
	function set_direction(index, direction)
	{
	  var snake = snakes[index];
		snake.direction = get_direction(snake.direction, direction);
	}
	
	//Lets add the keyboard controls now
	$(document).keydown(function(e){
		var key = e.which;
	  handle_keypress(key);
	});
	
	// Begin the game
	start_game();

});
