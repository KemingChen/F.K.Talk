app.controller('ChatCtrl', function($scope, $stateParams, $window, HostManager, FriendManager, Notification, DBManager){
	HostManager.checkLogin();
	var phone = $stateParams.phone;
	var friends = FriendManager.getFriends(function(){
		console.log("ChatCtrl Scope Apply");
		$scope.$apply();
	});
	$scope.friend = FriendManager.friends[phone];
	// DBManager.listMsg(phone, function(maxSenderMsgId){
	HostManager.getChats($scope.friend, function(maxSenderMsgId){
		var hasReadMsgId = $scope.friend.hasReadMsgId;
		console.log("hasReadMsgId: " + hasReadMsgId + ", maxSenderMsgId: " + maxSenderMsgId);
		if(hasReadMsgId < maxSenderMsgId){
			// 表示有未讀訊息
			console.log("Send Read Msg: " + maxSenderMsgId + ", to " + phone);
			FriendManager.readMsg(phone, maxSenderMsgId);
			$scope.friend.hasReadMsgId = maxSenderMsgId;
		}
	});
    $scope.predicate = '-messageId';
    $scope.reverse = false;

	$scope.back = function(){
		$window.history.back();
	}

	$scope.inputSaver = function(key, value){
		console.log("INPUT: " + value);
		$scope[key] = value;
	}

	$scope.send = function(){
		var message = $scope.message;
		FriendManager.sendMsg(phone, message);
		document.getElementById("message").value = "";
	}

	// $scope.isRead = function(chat){
	// 	if(chat.sender == $scope.friend.phone)
	// 		return false;
	// 	// console.log(chat.timestamp);
	// 	// console.log($scope.friend.readTime);
	// 	return chat.messageId <= $scope.friend.hasReadMsgId;
	// }

	$scope.toTypeMessage = function(){
		console.log("Type Message!!!");
		Notification.prompt('Chat With ' + $scope.friend.name,
			function(answer){
				console.log(JSON.stringify(answer));
				if (answer.buttonIndex === 1) {
					// 取消
				}
				else {
					// 送出
					var message = answer.input1;
					if(message.trim() != ""){
						FriendManager.sendMsg($scope.friend.phone, message);
					}
				}
			},
			'輸入訊息',
			['取消','送出']
		);
	}
});