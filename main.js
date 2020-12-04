var is_touched = false;
var is_mouse = false;
var height = 0;
var width = 0;
var pos = 0;
var data = new Uint8Array(500);
var i = 0;
var get_timer;
var send_timer;
var last_pos = -1;
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
		//get_timer = setInterval(get_data, 20);
		//send_timer = setInterval(send_data, 250);
		send_timer = setInterval(send_data, 100);
	} else {
		i = 0;
		send_data();
		//clearInterval(get_timer);
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
    if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
        var touch = e.touches[0] || e.changedTouches[0];
        //x = touch.pageX;
        y = touch.pageY;
    } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
        //x = e.clientX;
        y = e.clientY;
    }

	if (y > 0 && y < height) {
		document.getElementById("line").style.top = y + "px";
		document.getElementById("line").width = width;
		if (y > height * 0.9) {
			pos = 0
		} else {
			pos = Math.floor(255*(1 - (y / height)/0.9));
		}
	}
};

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

var send_data = function() {
	if (last_pos == pos) {
		return;
	}
	//if (i != 0) {
		//data[0] = i;
		jQuery.ajax({
		 type: "GET",
		 //url: 'https://shekter.dev/api/data/' + buf2hex(data.slice(0, i).buffer),
		 url: 'https://shekter.dev/api/output/' + pos,
		 dataType: "jsonp",
		 jsonpCallback: 'callback',
		 cache: false,
		 crossDomain: true,
		 processData: true,
		 success: function (data) {
			 //alert(JSON.stringify(data));
		 },
		 error: function (XMLHttpRequest, textStatus, errorThrown) {
			 //alert("error");
		 }
		});
		last_pos = pos;
		//i = 0;
	//}
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
	jQuery.ajax({
     type: "GET",
     url: 'https://shekter.dev/api/disconnect',
     dataType: "jsonp",
	 jsonpCallback: 'callback',
     cache: false,
     crossDomain: true,
     processData: true,
     success: function (data) {
         //alert(JSON.stringify(data));
     },
     error: function (XMLHttpRequest, textStatus, errorThrown) {
         alert("error");
     }
	});
}, false);


window.addEventListener("load", function(e){
	jQuery.ajax({
     type: "GET",
     url: 'https://shekter.dev/api/connect',
     dataType: "jsonp",
	 jsonpCallback: 'callback',
     cache: false,
     crossDomain: true,
     processData: true,
     success: function (data) {
         //alert(JSON.stringify(data));
		 document.getElementById("conn_status").innerText = "connected";
     },
     error: function (XMLHttpRequest, textStatus, errorThrown) {
         alert("error");
     }
	});
}, false);