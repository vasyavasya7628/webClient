var video=document.querySelector("#videoElement");
		
		navigator.getUserMedia=navigator.getUserMedia || 
			navigator.webkitGetUserMedia || 
			navigator.mozGetUserMedia || 
			navigator.msGetUserMedia || 
			navigator.oGetUserMedia;
		
		if(navigator.getUserMedia)
		{
			navigator.getUserMedia({video:true},handleVideo,videoError);
		}
		
		function sendMessage() 
		{
			var nickname = document.getElementById("inputNick").value;
			var msg = document.getElementById("inputText").value;
			
			//var msg = "0x00, <строка в кодировке UTF-8>, 0xFF;
			
			var strToSend = nickname + ": " + msg;
			if ( websocket != null )
			{
				document.getElementById("inputText").value = "";
				websocket.send( strToSend );
				console.log( "string sent :", '"'+strToSend+'"' );
				debug(strToSend);
			}
		}
		
		function handleVideo(stream)
		{
			video.srcObject = stream;
			video.play();
		}
		
		function videoError(e)
		{ 
			debug(e);
		}
		
		var debugTextArea = document.getElementById("Status");
		
		function debug(message) 
		{
			debugTextArea.value = message;
		}
		var websocket = null;
		function initWebSocket() 
		{
			try 
			{
				if (typeof MozWebSocket == 'function')
					WebSocket = MozWebSocket;
					
				if ( websocket && websocket.readyState == 1 )
					websocket.close();
					
				var wsUri = "ws://" + document.getElementById("webSocketHost").value;
				
				websocket = new WebSocket( wsUri );
				websocket.onopen = function (evt) 
				{
					debug("CONNECTED");
					document.getElementById("disconnectButton").disabled = false;
					document.getElementById("sendButton").disabled = false;
				};
				websocket.onclose = function (evt) 
				{
					debug("DISCONNECTED");
					document.getElementById("disconnectButton").disabled = true;
					document.getElementById("sendButton").disabled = true;
				};
				websocket.onmessage = function (evt) 		
				{
					console.log( "Message received :", evt.data );
					debug( evt.data );
				};
				websocket.onerror = function (evt) 
				{
					debug('ERROR: ' + evt.data);
				};
			}
			catch (exception) 
			{
				debug('ERROR: ' + exception);
			}
		}
		function stopWebSocket() 
		{
			if (websocket)
			websocket.close();
		}
		function checkSocket() 
		{
			if (websocket != null) 
			{
				var stateStr;
				switch (websocket.readyState) 
				{
				case 0: 
				{
					stateStr = "CONNECTING";
					break;
				}
				case 1: 
				{
					stateStr = "OPEN";
					break;
				}
				case 2: 
				{
					stateStr = "CLOSING";
					break;
				}
				case 3: 
				{
					stateStr = "CLOSED";
					break;
				}
				default: 
				{
					stateStr = "UNKNOW";
					break;
				}
				}
				debug("WebSocket state = " + websocket.readyState + " ( " + stateStr + " )");
            } 
			else 
			{
				debug("WebSocket is null");
			}
		}