//Index up to which calendar_data is parsed. Reduce for less data and quicker visualisation
const UPTO = 10;

/**
* Reads the files and starts visualisation. Handler, currently attached to <input type=file ...>, executed on event evt.
* @param {Event} evt - the event specified in addEventListener
*/
var parseFilesAndVisualise = function(evt) {
	evt.stopPropagation();
	evt.preventDefault();

	//FileList object
	var files = evt.target.files;

	for (var i=0; i<files.length; i++) {
		//Go through every dropped file, read its contents with a FileReader()
		var file = files[i];

		//Each file has a reader which er reads it
		var reader = new FileReader();
		reader.readAsText(file);
		//Indices for keeping track of when the last file is loaded
		reader.current_file_name = file.name;
		reader.current_file_index = i;
		reader.last_index = files.length - 1;

		//Gets executed when the reader finishes loading in the file's content
		reader.onloadend = function(e) {
			//Convert file name to person name
			var name_list = this.current_file_name.split(".")[0].split("#");
			var name = name_list[1]+", "+name_list[0];
			//Parse file text into an array of structured js objects (calendar_data)
			populateCalendarData(name, this.result);

			if (this.current_file_index === this.last_index) {
				console.log("all files loaded");
				populateNodesEdges(UPTO);
				visualise();
			}
		}
	}
}

/**
* Parses csv file contents into calendar_data. Does minimal data cleaning.
* @param {string} name - Name of the person's calendar e.g. "Smith, John"
* @param {string} date_string - Csv file contents as string
*/
function populateCalendarData(name, data_string) {
	var parser = d3.dsvFormat(",");
	//An array of the csv file rows
	var calendar = parser.parse(data_string);

	calendar.map(function(row) {
		if (row["ATTENDEE"] !== undefined) {
			//Push every attendee to the array of names to visualise
			var name_list = row["ATTENDEE"].split(";").map(function(name){
				return name.trim();
			});

			//Ensures there are no repetitions in the array of names
			if (name_list.indexOf(name) === -1) {
				name_list.push(name);
			}
			row["ATTENDEE"] = name_list;
			row["DTSTART"] = parseDate(row["DTSTART"]);
			row["DTEND"] = parseDate(row["DTEND"]);

			//There is a meeting in UK EnExG called football which many people are signed up for,
			//clutters the visualisation, so it's excluded
			if (!row["SUMMARY"].includes("Footy")
				&& !row["SUMMARY"].includes("Football")
				&& row["ATTENDEE"].indexOf("EnExGroup (UK only)") === -1
			) { calendar_data.push(row); }
		}
	});
}

/**
* Converts raw date from csv file to JavaScript Date. Does not do it properly.
* @param {string} date_string - The DATE column value from calendar csv file
* @returns {Date} - JavaScript Date object
*/
function parseDate(date_string) {
	var cest_parser = d3.timeParse("%Y-%m-%d %H:%M %p CEST");
	var est_parser = d3.timeParse("%Y-%m-%d %H:%M %p EST");
	if (cest_parser(date_string) !== null) return cest_parser(date_string);
	else return est_parser(date_string);
}

/**
* Attached to document. Enables searching with ctrl+f
* @param {Event} e - keyboard event
*/
function processKeyDown(e) {
	if (e.key === "f" && e.ctrlKey) {
		e.preventDefault();
		document.getElementById("search-bar-input").focus();
	}
}

/**
* Checks if a particular object is in list by comparing ids
* @param {Object} obj - object to check
* @param {Object[]} list - list of objects
* @returns {Boolean} - whether obj is in list
*/
function isObjectInList(obj, list) {
	var isit = false;
	list.map(function(list_obj){
		if (list_obj["id"] === obj["id"]) isit = true;
	});
	return isit;
}

/**
* Goes through calendar_data, fills in node_list, edge_list
* @param {integer} upto - index up to which to parse data. Reduce if visualisation is slow.
*/
function populateNodesEdges(upto) {
	calendar_data = calendar_data.slice(0, upto);

	calendar_data.map(function(meeting) {
		//Convert each meeting to a node. More attributes (such as dates) will be included later
		var meeting_node = {
			id: meeting["SUMMARY"],
			label: meeting["SUMMARY"].slice(0, 20),
			shape: "box",
			notes: meeting["NOTES"],
			type:"meeting",
			color: "#D2E5FF",
			attendees: meeting["ATTENDEE"]
		};
		//Avoid repetition
		if (!isObjectInList(meeting_node, node_list)) node_list.push(meeting_node);

		//Now add name nodes for each attendee of the meeting
		if (meeting["ATTENDEE"] !== undefined) {
			meeting["ATTENDEE"].map(function(name) {
				//Parsing attendee names. Need to improve this.
				var surname = name.split(",")[0];
				if (surname === "") surname = name;
				surname = surname.slice(0, 10);

				//A name node has redundant attributes "notes" and "attendees"
				//to avoid "undefined" errors, when the netwok is manipulated. Definitely need to improve this.
				var name_node = {
					id: name,
					label: surname,
					color: "#FFDAB9",
					type: "person",
					notes:"",
					attendees: []
				};
				if (!isObjectInList(name_node, node_list)) node_list.push(name_node);

				//Add an edge from the meeting to the attendee
				edge_list.push({from: meeting["SUMMARY"], to: name, length: 1});
			});
		}
	});

	console.log("num nodes: "+node_list.length);
	console.log("num edges: "+edge_list.length);
}

/**
* Draw the network using node_list and edge_list
*/
function visualise() {
	//create an array with nodes
	nodes = new vis.DataSet(node_list);

	//create an array with edges
	edges = new vis.DataSet(edge_list);

	//create a network
	var container = document.getElementById('mynetwork');

	//provide the data in the vis format
	var data = {
		nodes: nodes,
		edges: edges
	};
	//Configure network
	var options = {
		interaction: {
			hover: true
		},
		nodes: {
			chosen: {node: displayNodeProperties}
		},
		edges: {
			smooth : {
				enabled: false
			}
		},
		physics: {
			barnesHut: {
				gravitationalConstant: -10000,
				centralGravity: 0,
				springLength: 4000,
				springConstant: 0.01,
				damping: 1,
				avoidOverlap: 0
			}
		},
		layout: {
			improvedLayout: false
		}
	};

	//initialize your network
	var network = new vis.Network(container, data, options);

	//Add the search bar
	document.getElementById("search-bar-input").setAttribute("style", "display: block");
	document.addEventListener('keydown', processKeyDown, false);
}

/**
* Returns list of node ids whose agendas or summaries contain val, and the people node ids connected to them
* Very inefficient right now, goes through all of the nodes everytime a new key is pressed. Index the nodes?
* @param {string} val - string to be matched
* @returns {string[]} - an array of matched node ids
*/
function getIdsContaining(val) {
	val = val.toLowerCase();
	var ids = [];
	node_list.map(function(obj, i) {
		if (obj.notes.toLowerCase().includes(val) || obj.id.toLowerCase().includes(val)) {
			ids.push(obj.id);
			obj.attendees.map(function(p) {
				ids.push(p);
			});
		}
	});
	return ids;
}

/**
* Highlight nodes matching string in search bar. Called from index.html file
* Also inefficient, goes through nodes, which is network's node representation
* @param {string} val - the value to match
*/
function highlightNetwork(val) {
	var ids = getIdsContaining(val);

	if (val !== "") {
		nodes.get().map(function(node) {
			if (ids.indexOf(node.id) !== -1) {
				highlightNode(node);
			} else unhighlightNode(node);

			nodes.update(node);
		});
	} else {
		//Unhighlights everything if nothing in search bar
		nodes.get().map(function(node) {
			unhighlightNode(node);
			nodes.update(node);
		});
	}
}

function highlightNode(node) {
	if (node.type === "meeting") node.color = "#2B7CE9";
	else node.color = "#F08080";
}

function unhighlightNode(node) {
	if (node.type === "person") node.color = "#FFDAB9";
	else node.color = "#D2E5FF";
}

/**
* Displays node notes and id in console when hovered over. Called in visjs options object.
*/
function displayNodeProperties(values, id, selected, hovering) {
	if (hovering) {
		console.clear();
		console.log("%c "+id, "background: dodgerblue;");
		console.log(nodes.get(id).notes);
	};
}


/*
calendar_data = [
	{
		SUMMARRY: "Meeting about the thing",
		DTSTART: Date,
		DTEND: Date,
		NOTES: "Agenda: 1. Talk about the thing  2. Drink tea  3....."
		ATTENDEE: ["Smith, Paul", "BeGoode, Johnny", ...]
	},
	...
]
*/
var calendar_data = [];

//These two are populated by populateNodesEdges() and used to generate network in visualise
//--Contains node objects {id: ..., label: ..., ...}
var node_list = [];
//--Contains edges {from: ..., to: ..., ...}
var edge_list = [];

//Reference to nodes' representation in visjs network. Used when highlighting nodes.
var nodes = new vis.DataSet();

//Attaching listeners
document.getElementById('files').addEventListener('change', parseFilesAndVisualise, false);
