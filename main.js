var is_touched = false;
var is_mouse = false;
var height = 0;
var width = 0;
var pos = 0;
var data = new Array(1000);
var i = -1;
var get_timer;
var send_timer;
var update_touched = function(t, e) {
	var body = document.body,
		html = document.documentElement;
		
	height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
	width = Math.max( body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth );
	is_touched = t;
	document.getElementById("touch_status").innerText = t;
	document.getElementById("line").style.visibility = t ? "visible" : "hidden";
	send_pos(e);
	if (t) {
		get_timer = setInterval(get_data, 1);
		send_timer = setInterval(send_data, 100);
	} else {
		i = -1;
		send_data();
		clearInterval(get_timer);
		clearInterval(send_timer);
		var highestTimeoutId = setTimeout(";");
		for (var i = 0 ; i < highestTimeoutId ; i++) {
			clearTimeout(i); 
		}
	}
};

var get_data = function() {
	data[++i] = pos;
}

var send_pos = function(e) {
	if (e.pageY > 0 && e.pageY < height) {
		document.getElementById("line").style.top = e.pageY + "px";
		document.getElementById("line").width = width;
		if (e.pageY > height * 0.9) {
			pos = 0
		} else {
			pos = Math.floor(255*(1 - (e.pageY / height)/0.9));
		}
		console.log(pos);
	}
};

var send_data = function() {
	if (i != -1) {
		var req = new XMLHttpRequest();
		req.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("conn_status").innerText = "good";
				i = -1;
			} else {
				document.getElementById("conn_status").innerText = "waiting";
			}
		}
		
		req.open('POST', 'http://192.168.1.181/api/data');
		req.setRequestHeader('content-type', 'application/json;charset=UTF-8');
		req.send(JSON.stringify(data.slice(0, i + 1)));
		i = -1;
	}
};

document.addEventListener("mousedown", e => {
	update_touched(true, e);
	is_mouse = true;
});

document.addEventListener("dblclick", e => {
	update_touched(true, e);
	is_mouse = true;
});

document.addEventListener("mouseup", e => {
	update_touched(false, e);
});

document.addEventListener("mousemove", e => {
	if (is_touched && is_mouse) {
		send_pos(e);
	}
});

document.addEventListener("touchstart", e => {
	update_touched(true, e);
});

document.addEventListener("touchend", e => {
	update_touched(false, e);
});
document.addEventListener("touchcancel", e => {
	update_touched(false, e);
});


document.addEventListener("touchmove", e => {
	if (is_touched && !is_mouse) {
		send_pos(e);
	}
});

window.addEventListener("beforeunload", function(e){
	var req = new XMLHttpRequest();
	req.open('GET', 'http://192.168.1.181/api/disconnect');
	req.send();
}, false);

window.addEventListener("load", function(e){
	var req = new XMLHttpRequest();
	req.open('GET', 'http://192.168.1.181/api/connect');
	req.send();
	console.log("Loaded");
}, false);