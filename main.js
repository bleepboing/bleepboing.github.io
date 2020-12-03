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
	/*if (t) {
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
	}*/
};

var get_data = function() {
	data[++i] = pos;
}

const id = "hello";
//declare the Async-call callback function on the global scope
function myAsyncJSONPCallback(data){
    //clean up 
    var e = document.getElementById(id);
    if (e) e.parentNode.removeChild(e);
    clearTimeout(timeout);

    if (data && data.error){
        //handle errors & TIMEOUTS
        //...
        return;
    }

    //use data
    //...
}
function doTheThing() {
	var serverUrl          = "https://shekter.dev/api/data"
	  , params = { param1  : "value of param 1"      //I assume this value to be passed
				 , param2  : "value of param 2"      //here I just declare it...
				 , callback: "myAsyncJSONPCallback" 
				 }
	  , clientUtilityUrl   = "https://bleepboing.github.io/postResponse.html"
	  //, id     = "some-unique-id"// unique Request ID. You can generate it your own way
	  , div    = document.createElement("DIV")       //this is where the actual work start!
	  , HTML   = [ "<IFRAME name='ifr_",id,"'></IFRAME>"  
				 , "<form target='ifr_",id,"' method='POST' action='",serverUrl 
				 , "' id='frm_",id,"' enctype='multipart/form-data'>"
				 ]
	  , each, pval, timeout;

	//augment utility func to make the array a "StringBuffer" - see usage bellow
	HTML.add = function(){
				  for (var i =0; i < arguments.length; i++) 
					  this[this.length] = arguments[i];
			   }

	//add rurl to the params object - part of infrastructure work
	params.rurl = clientUtilityUrl //ABSOLUTE URL to the utility page must be on
								   //the SAME DOMAIN as page that makes the request

	//add all params to composed string of FORM and IFRAME inside the FORM tag  
	for(each in params){
		pval = params[each].toString().replace(/\"/g,"&quot;");//assure: that " mark will not break
		HTML.add("<input name='",each,"' value='",pval,"'/>"); //        the composed string      
	}
	//close FORM tag in composed string and put all parts together
	HTML.add("</form>");
	HTML = HTML.join("");   //Now the composed HTML string ready :)

	//prepare the DIV
	div.id = id; // this ID is used to clean-up once the response has come, or timeout is detected
	div.style.display = "none"; //assure the DIV will not influence UI

	//TRICKY: append the DIV to the DOM and *ONLY THEN* inject the HTML in it
	//        for some reason it works in all browsers only this way. Injecting the DIV as part 
	//        of a composed string did not always work for me
	document.body.appendChild(div);
	div.innerHTML = HTML;

	//TRICKY: note that myAsyncJSONPCallback must see the 'timeout' variable
	timeout = setTimeout("myAsyncJSONPCallback({error:'TIMEOUT'})",4000);
	document.getElementById("frm_"+id+).submit();
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
		doTheThing();
		/*jQuery.ajax({
		 type: "GET",
		 url: 'https://shekter.dev/api/data',
		 dataType: "jsonp",
		 data: [pos],
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
		});*/
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
		
		/*jQuery.ajax({
		 type: "GET",
		 url: 'https://shekter.dev/api/connect',
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
		
		$.ajax({
			type: 'POST',
			url: 'https://shekter.dev/api/connect',
			crossDomain: true,
			data: '{"some":"json"}',
			dataType: 'json',
			success: function(responseData, textStatus, jqXHR) {
				//var value = responseData.someKey;
			},
			error: function (responseData, textStatus, errorThrown) {
				alert('POST failed.');
			}
		});
		
		req.open('POST', 'https://shekter.dev/api/data');
		req.setRequestHeader('X-PINGOTHER', 'pingpong');
		req.setRequestHeader('content-type', 'application/json;charset=UTF-8');
		req.send(JSON.stringify(data.slice(0, i + 1)));
		i = -1;*/
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
     },
     error: function (XMLHttpRequest, textStatus, errorThrown) {
         alert("error");
     }
	});
}, false);