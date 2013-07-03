var SubtleData = function(apiKey) {
    this.apiKey = apiKey;
    return this;
}

SubtleData.prototype = {
    /* Configs */

    baseUrl: "https://www.subtledata.com/API/M/1/",
    debug: false,

    /* SubtleData API methods */

    startup: function(success, error) {
	var _this = this;
	this.doCall('0000', 
		    [this.apiKey],
		    function(data) {
			var results = _this.parseResponse(data);
			_this.session = results[0][0][0];
			var returnObj = { sessionToken: _this.session };
			success();
		    },
		    function(data) {
			alert(data.status + " - " + data.statusText + ": " + data.responseText);
		    }
		    );
	return this;
    },

    authenticateUser: function(username, password, deviceGuid, success, error) {
	var _this = this;
	this.doCall('0111', 
		    [username, password, 0, 0, deviceGuid],
		    function(data) {
			var results = _this.parseResponse(data);
			var responseObj = {};
			if (results[0][0][0] > 0) {
			    _this.userId = results[0][0][0];
			    _this.deviceId = results[1][0][0];
			    responseObj.userId = _this.userId;
			    responseObj.deviceId = _this.deviceId;
			    responseObj.userGuid = results[2][0][0];
			    success(responseObj);
			} else {
			    responseObj.errorCode = results[1][0][0];
			    error(responseObj);
			}
		    }
		    );
	return this;
    },

    findLocations: function(success, error) {
	var _this = this;
	this.doCall('0310', 
		    ['100'],
		    function(data) {
			var results = _this.parseResponse(data);
			results = results[0];
			var locations = [];
			for (var i=0; i < results.length; i++) {
			    var result = results[i];
			    var location = {
				locationId: result[0]
				, name: result[1]
			    };
			    locations[i] = location;
			}
			success(locations);
		    }
		    );
	
	return this;
    },

    getRevenueCenters: function(success, error) {
	var _this = this;
	this.doCall('0330', 
		    [this.locationId],
		    function(data) {
			var results = _this.parseResponse(data);
			results = results[0];
			var revenueCenters = [];
			for (var i=0; i < results.length; i++) {
			    var result = results[i];
			    var revenueCenter = {
			        revenueCenterId: result[0]
				, name: result[1]
				, defaultCenter: result[2]
			    };
			    revenueCenters[i] = revenueCenter;
			}
			success(revenueCenters);
		    }
		    );
	
	return this;
    },

    listTables: function(success, error) {
	var _this = this;
	this.doCall('0331', 
		    [this.locationId, this.revenueCenterId],
		    function(data) {
			var results = _this.parseResponse(data);
			results = results[0];
			var tables = [];
			for (var i=0; i < results.length; i++) {
			    var result = results[i];
			    var table = {
			        tableId: result[0]
				, identifier: result[1]
				, name: result[2]
			    };
			    tables[i] = table;
			}
			success(tables);
		    }
		    );
	
	return this;
    },

    createTicketForDineIn: function(partySize, success, error) {
	var _this = this;
	this.doCall('0410', 
		    [
		     this.locationId, 
		     this.revenueCenterId,
		     this.userId,
		     this.deviceId,
		     this.tableId,
		     partySize,
		     0,
		     "Demo Ticket",
		     0,
		     0
		    ],
		    function(data) {
			var results = _this.parseResponse(data);
			var responseObj = {};
			if (results[0][0][0] > 0) {
			    _this.ticketId = results[0][0][0];
			    responseObj.ticketId = _this.ticketId;
			    success(responseObj);
			} else {
			    responseObj.errorCode = results[0][0][0];
			    error(responseObj);
			}
		    }
		    );
	
	return this;
    },

    getCategories: function(parentCategory, success, error) {
	var _this = this;
	this.doCall('0200', 
		    [this.locationId, parentCategory, 1, 0, 0],
		    function(data) {
			var results = _this.parseResponse(data);
			results = results[0];
			var categories = [];
			for (var i=0; i < results.length; i++) {
			    var result = results[i];
			    var category = {
			        categoryId: result[0]
				, name: result[1]
				, instructionalText: result[2]
				, hasItems: result[3]
				, hasSubcategories: result[4]
				, imageList: []
			    };
			    for (var j=0; j < result[5].length; j++) {
				var image = {
				    imageType: result[5][0]
				    , imageUrl: result[5][1]
				};
				category["imageList"][j] = image;
			    }
			    categories[i] = category;
			}
			success(categories);
		    }
		    );
	
	return this;
    },

    getItemsByCategory: function(categoryId, success, error) {
	var _this = this;
	this.doCall('0204', 
		    [this.locationId, categoryId],
		    function(data) {
			var results = _this.parseResponse(data);
			results = results[0];
			var items = [];
			for (var i=0; i < results.length; i++) {
			    var result = results[i];
			    var item = {
			        itemId: result[0]
				, name: result[1]
				, price: result[2]
				, imageList: []
			    };
			    for (var j=0; j < result[3].length; j++) {
				var image = {
				    imageType: result[3][0]
				    , imageUrl: result[3][1]
				};
				item["imageList"][j] = image;
			    }
			    items[i] = item;
			}
			success(items);
		    }
		    );
	
	return this;
    },

    getItemModifiers: function(itemId, success, error) {
	var _this = this;
	this.doCall('0220', 
		    [itemId],
		    function(data) {
			var results = _this.parseResponse(data, 5);
			results = results[0];
			var itemModifiers = [];
			for (var i=0; i < results.length; i++) {
			    var result = results[i];
			    var modifierCategory = {
			        categoryId: result[0]
				, name: result[1]
				, description: result[2]
				, minimumNumber: result[3]
				, maximumNumber: result[4]
				, modifierList: []
			    };
			    for (var j=0; j < result[5].length; j++) {
				var modifier = {
				    modifierId: result[5][j][0]
				    , name: result[5][j][1]
				    , description: result[5][j][2]
				    , price: result[5][j][3]
				};
				modifierCategory["modifierList"][j] = modifier;
			    }
			    itemModifiers[i] = modifierCategory;
			}
			success(itemModifiers);
		    }
		    );
	
	return this;
    },

    addItemToTicket: function(itemId, quantity, modifierIds, success, error) {
	var _this = this;
	var itemString = itemId + "^" + quantity + "^No+Instructions^" + modifierIds.join(String.fromCharCode(0x0B));
	this.doCall('0520', 
		    [this.ticketId, this.userId, itemString, 1, '""'],
		    function(data) {
			var results = _this.parseResponse(data);
			var responseObj = {};
                        if (results[0][0][0] > 0) {
			    responseObj.returnCode = results[0][0][0];
                            success(responseObj);
                        } else {
			    responseObj.errorCode = results[0][0][0];
                            error(responseObj);
                        }
		    }
		    );
	
	return this;
    },

    getTicketItems: function(success, error) {
	var _this = this;
	this.doCall('0500', 
		    [this.locationId, this.ticketId],
		    function(data) {
			var results = _this.parseResponse(data, 5);
			results = results[0];
			var orderList = [];
			for (var i=0; i < results.length; i++) {
			    if (results[i].length < 4) continue;
			    var result = results[i];
			    item = {
				itemId: result[0]
				, name: result[1]
				, quantity: result[2]
				, price: result[3]
				, availableForOrder: result[4]
			    };
			    var modifierList = [];
			    for (var j=0; j < result[5].length; j++) {
				var modifier = {
				    modifierId: result[5][j][0]
				    , name: result[5][j][1]
				};
				modifierList[j] = modifier;
			    }
			    item["modifierList"] = modifierList;
			    orderList[i] = item;
			}
                        success(orderList);
		    }
		    );
	
	return this;
    },

    getItemsToOrder: function(success, error) {
	var _this = this;
	this.doCall('0510', 
		    [this.locationId, this.ticketId],
		    function(data) {
			var results = _this.parseResponse(data, 5);
			results = results[0];
			var orderList = [];
			for (var i=0; i < results.length; i++) {
			    if (results[i].length < 4) continue;
			    var result = results[i];
			    item = {
				itemId: result[0]
				, name: result[1]
				, quantity: result[2]
			    };
			    var modifierList = [];
			    for (var j=0; j < result[3].length; j++) {
				var modifier = {
				    modifierId: result[3][j][0]
				    , name: result[3][j][1]
				};
				modifierList[j] = modifier;
			    }
			    item["modifierList"] = modifierList;
			    orderList[i] = item;
			}
                        success(orderList);
		    }
		    );
	
	return this;
    },

    placeCurrentOrder: function(success, error) {
	var _this = this;
	this.doCall('0511', 
		    [this.ticketId, this.userId, 0, 0],
		    function(data) {
			var results = _this.parseResponse(data);
			var responseObj = {};
			if (results[0][0][0] > 0) {
			    responseObj.responseCode = results[0][0][0];
			    responseObj.secondsToDisplayAd = results[1][0][0];
			    responseObj.adUrl = results[2][0][0];
			    success(responseObj);
			} else {
			    responseObj.errorCode = results[0][0][0];
			    error(responseObj);
			}
		    }
		    );
	return this;
    },

    addPaymentMethod: function(name, card, month, year, zip, success, error) {
	var _this = this;
	this.doCall('0121', 
		    [this.ticketId, name, card, month, year, zip, "Demo card", 0],
		    function(data) {
			var results = _this.parseResponse(data);
			var responseObj = {};
			if (results[0][0][0] > 0) {
			    responseObj.cardId = results[0][0][0];
			    success(responseObj);
			} else {
			    responseObj.errorCode = results[0][0][0];
			    error(responseObj);
			}
		    }
		    );
	return this;
    },

    addPaymentToTicket: function(cardId, amount, tip, cvv, success, error) {
	var _this = this;
	/*
	 * This is how the call would be done in a non-demo situation
	 *
	this.doCall('0620', 
		    [this.ticketId, this.userId, cardId, 0, amount, tip, cvv, 0],
		    function(data) {
			var results = _this.parseResponse(data);
			var responseObj = {};
			if (results[0][0][0] > 0) {
			    responseObj.returnCode = results[0][0][0];
			    if (results.length > 1) {
				responseObj.responseMessage = results[1][0][0];
			    }
			    success(responseObj);
			} else {
			    responseObj.errorCode = results[0][0][0];
			    if (results.length > 1) {
				responseObj.responseMessage = results[1][0][0];
			    }
			    error(responseObj);
			}
		    }
		    );

		    *
		    * End actual code
		    * Below is the code for this demo which simulates an actual payment
		    *
	*/
	var responseObj = {};
	success(responseObj);
	return this;
    },

    /* General utility functions */

    makeCommand: function(method, args) {
	var command = method;
	command += this.session ? this.session : "";
	command += "|";
	command += args.join("|");
	command =  "Q="  + escape(command);
	return command;
    },

    doCall: function(method, args, success, error) {
	var _this = this;
	var command = this.makeCommand(method, args);
	var url = this.baseUrl + "?" + command;

	var errorCallback = error ? error : function(data) {
	    _this.reportError(data);
	};

	if (this.debug) {
	    console.log(url);
	}

        $.ajax({
	       type: 'GET',
	       url: url,
	       dataType: 'text/plain',
	       success: success,
	       error: errorCallback
		    });
	return this;
    },

    parseResponse: function(response, depth) {
	if (this.debug) {
	    console.log(response);
	}

	var parseDepth = depth ? depth : 3;

	var results = response.split("|");
	results = results.slice(1);
	if (parseDepth > 1) {
	    for (var i=0; i < results.length; i++) {
	        var result = results[i];
  	        var subresults = result.split('~');
	        if (parseDepth > 2) {
	            for (var j=0; j < subresults.length; j++) {
	                var subresult = subresults[j];
  	                var subsubresults = subresult.split('^');
	                if (parseDepth > 3) {
   	                    for (var k=0; k < subsubresults.length; k++) {
	                        var subsubresult = subsubresults[k];
	                        var subsubsubresults = subsubresult.split(String.fromCharCode(0x0B));
    	                        if (parseDepth > 4) {
   	                            for (var l=0; l < subsubsubresults.length; l++) {
			                subsubsubresults[l] = subsubsubresults[l].split('`');
                                    }
                                }
			        subsubresults[k] = subsubsubresults;
			    }
			}
			subresults[j] = subsubresults;
	            }
	        }
	        results[i] = subresults;
	    }
        }
	return results;
    },

    reportError: function(data) {
	// TODO
    }
};
	
    

