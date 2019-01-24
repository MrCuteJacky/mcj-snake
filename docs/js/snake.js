$(document).ready(function() {
	reset();
	var id = null;
	$('input[name=start]').click(function() {
		reset();
		$('input[name=start]').hide();
		$('input[name=stop]').show();
		start();
	});
	$('input[name=stop]').click(function() {
		$('input[name=stop]').hide();
		$('input[name=restart]').show();
		stop();
	});
	$('input[name=restart]').click(function() {
		$('input[name=stop]').show();
		$('input[name=restart]').hide();
		start();
	});
	$('body').keydown(function() {
		chgDirection(window.event.keyCode);
	});
});

function start() {
	var level = parseInt($('input[name=level]').val());
	var rate = parseInt($('input[name=rate]').val()) - level * 50;
	rate = rate <= 0 ? rate + 50 : rate;
	id = window.setInterval(action, rate);
}

function stop() {
	window.clearInterval(id);
}

function reset() {
	$('input[name=stop]').hide();
	$('input[name=restart]').hide();
	$('input[name=direction]').val('R');
	$('input[name=point]').val('');
	$('input[name=snake]').val(',0.0,');
	$('input[name=score]').val('0');
	$('input[name=level]').val('0');
	action();
}

function initMap(size) {
	$('table.map').remove();
	var html = '';
	html += '<table cellspacing=1 cellpadding=0 class=map>';
	for(var i = 0 ; i < size ; i++) {
		html += '<tr>';
		for(var j = 0 ; j < size ; j++) {
			html += '<td class=n></td>';
		}
		html += '</tr>';
	}
	html += '</table>';
	$('div.map').css('width', size * 11 + 1);
	$('div.map').css('height', size * 11 + 1);
	$('div.map').append(html);
	$('div.score').css('width', size * 11 + 1);
}

function action() {
	initMap(parseInt($('input[name=size]').val()));
	newPoint();
	chgSnake();
}

function chgDirection(keyCode) {
	var direction = $('input[name=direction]').val();
	switch(keyCode) {
		case 37:
			direction = direction != 'R' ? 'L' : direction;
			break;
		case 38:
			direction = direction != 'D' ? 'U' : direction;
			break;
		case 39:
			direction = direction != 'L' ? 'R' : direction;
			break;
		case 40:
			direction = direction != 'U' ? 'D' : direction;
			break;
	}
	$('input[name=direction]').val(direction);
}

function chgSnake() {
	var direction = $('input[name=direction]').val();
	var snake = $('input[name=snake]').val().substring(1, $('input[name=snake]').val().length - 1).split(',');
	var end = snake[snake.length - 1];
	for(var i = snake.length - 1 ; i > 0 ; i--) {
		snake[i] = snake[i - 1];
	}
	var x = parseInt(snake[0].split('.')[0]);
	var y = parseInt(snake[0].split('.')[1]);
	switch(direction) {
		case 'U':
			y--;
			break;
		case 'D':
			y++;
			break;
		case 'L':
			x--;
			break;
		case 'R':
			x++;
			break;
	}
	if(gameover(x, y)) {
		snakeValue = $('input[name=snake]').val();
	} else {
		snake[0] = x + '.' + y;
		var snakeValue = ',';
		for(var i = 0 ; i < snake.length ; i++) {
			snakeValue += snake[i] + ',';
		}
	}
	if($('input[name=point]').val() == x + '.' + y) {
		snakeValue += end + ',';
		$('input[name=score]').val(parseInt($('input[name=score]').val()) + snake.length);
		$('input[name=level]').val(Math.floor(snake.length / 5));
		stop();
		start();
		$('input[name=point]').val('');
		newPoint();
	}
	$('input[name=snake]').val(snakeValue);
	drawSnake();
}

function drawSnake() {
	var map = $('table.map');
	var snake = $('input[name=snake]').val().substring(1, $('input[name=snake]').val().length - 1).split(',');
	for(var i = 0 ; i < snake.length ; i++) {
		var x = parseInt(snake[i].split('.')[0]);
		var y = parseInt(snake[i].split('.')[1]);
		var td = map.find('tr').eq(y).find('td').eq(x);
		td.attr('class', 'y');
	}
}

function newPoint() {
	var point = $('input[name=point]').val();
	if(point == null || point == '') {
		var x = Math.ceil(Math.random() * (parseInt($('input[name=size]').val()) - 1));
		var y = Math.ceil(Math.random() * (parseInt($('input[name=size]').val()) - 1));
		while($('input[name=snake]').val().indexOf(',' + x + '.' + y + ',') != -1) {
			var x = Math.ceil(Math.random() * (parseInt($('input[name=size]').val()) - 1));
			var y = Math.ceil(Math.random() * (parseInt($('input[name=size]').val()) - 1));
		}
		$('input[name=point]').val(x + '.' + y);
	}
	drawPoint();
}

function drawPoint() {
	var x = $('input[name=point]').val().split('.')[0];
	var y = $('input[name=point]').val().split('.')[1];
	var td = $('table.map').find('tr').eq(y).find('td').eq(x);
	td.attr('class', 'p');
}

function gameover(x, y) {
	if(x < 0
		|| x > parseInt($('input[name=size]').val()) - 1
		|| y < 0
		|| y > parseInt($('input[name=size]').val()) - 1
		|| $('input[name=snake]').val().indexOf(',' + x + '.' + y + ',') != -1) {
		$('input[name=start]').show();
		$('input[name=restart]').hide();
		$('input[name=stop]').hide();
		stop();
		return true;
	}
}