$(document).ready(function(){
	
	// Ok grab the canvas
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var canvasWidth = $("#canvas").width();
	var canvasHeight = $("#canvas").height();
	
	// Width of the cells
	var cellWidth = 5;
	
	// Create collection of snakes
	var snakes = [];
	
	// Main function to start the game
	function start_game()
	{
	  // TODO have some setup logic, choose players etc
	  
	  // for now, just call init
	  init();
	}
	
	function reset() {
	  snakes = [];
	  
	  start_game();
	}
	
	function init()
	{
		snakes.push(create_snake("green", 1, 1));
		//snakes.push(create_snake("red", 100, 100));
		
		paint_init();
		
		//Lets move the snake now using a timer which will trigger the paint function
		//every 60ms
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		
		game_loop = setInterval(paint, 60);
	}
	
	function create_snake(colour, startX, startY)
	{
	  var snake = new Snake(colour, 1);
		var length = 5; //Length of the snake
		
		for(var i = length-1; i>=0; i--)
		{
			//This will create a horizontal snake starting from the top left
			snake.array.push({x: startX + i, y: startY});
		}
		
		return snake;
	}
	
	function paint_init()
	{
	  //To avoid the snake trail we need to paint the BG on every frame
		//Lets paint the canvas now
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);
		ctx.strokeStyle = "white";
		ctx.strokeRect(0, 0, canvasWidth, canvasHeight);
		
		for (var i = 0; i < snakes.length; i++)
		{
		  var snake = snakes[i];
		  
		  ctx.fillStyle = snake.colour;
		  ctx.fillText(snake.label, 10 * (i+1), canvasHeight - 5);
		}
	}
	
	// The main draw loop,
	function paint()
	{
		for (var i = 0; i < snakes.length; i++)
		{
		  var snake = snakes[i];
		  
		  //The movement code for the snake to come here.
  		//The logic is simple
  		//Pop out the tail cell and place it infront of the head cell
  		var nx = snake.array[0].x;
  		var ny = snake.array[0].y;
  		//These were the position of the head cell.
  		//We will increment it to get the new head position
  		//Lets add proper direction based movement now
  		if(snake.direction == "right") nx++;
  		else if(snake.direction == "left") nx--;
  		else if(snake.direction == "up") ny--;
  		else if(snake.direction == "down") ny++;
  		
  		//Lets add the game over clauses now
  		//This will restart the game if the snake hits the wall
  		//Lets add the code for body collision
  		//Now if the head of the snake bumps into its body, the game will restart
  		if(nx == -1 || nx == canvasWidth/cellWidth || ny == -1 || ny == canvasHeight/cellWidth || check_collision(nx, ny, snake.array))
  		{
  			//restart game
  			reset();
  			//Lets organize the code a bit now.
  			return;
  		}
  		
  		// Take the rearmost cell, update the position, and add it to the front
  		var tail = snake.array.pop(); //pops out the last cell
  	  tail.x = nx; tail.y = ny;
  		
  		snake.array.unshift(tail); //puts back the tail as the first cell
  		
  		for(var j = 0; j < snake.array.length; j++)
  		{
  			var c = snake.array[j];
  			//Lets paint 10px wide cells
  			paint_cell(snake.colour, c.x, c.y);
  		}
		}
	}
	
	//Lets first create a generic function to paint cells
	function paint_cell(fillColour, x, y)
	{
		ctx.fillStyle = fillColour;
		ctx.fillRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
	}
	
	function check_collision(x, y, array)
	{
		//This function will check if the provided x/y coordinates exist
		//in an array of cells or not
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}
	
	function getDirection(currentDirection, inputDirection)
	{
	  if (currentDirection == "up")
	  {
	    return inputDirection;
	  }
	  else if (currentDirection == "left")
	  {
	    return (inputDirection == "left") ? "down" : "up";
	  }
	  else if (currentDirection == "down")
	  {
	    return (inputDirection == "left") ? "right" : "left";
	  }
	  else if (currentDirection == "right")
	  {
	    return (inputDirection == "left") ? "up" : "down";
	  }
	}
	
	function updateDirection(key)
	{
	  var direction = "";
	  
	  // The direction clause prevents going in reverse
		if(key == "37" && direction != "right") direction = "left";
		else if(key == "39" && direction != "left") direction = "right";
		
		if (direction !== "")
		{
		  //The snake is now keyboard controllable
  		for (var i = 0; i < snakes.length; i++)
  		{
  		  var snake = snakes[i];
  		  snake.direction = getDirection(snake.direction, direction);
  		}
		}
	}
	
	//Lets add the keyboard controls now
	$(document).keydown(function(e){
		var key = e.which;
	  updateDirection(key);
	});
	
	// Begin the game
	start_game();

});
