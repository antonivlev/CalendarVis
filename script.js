//Index up to which calendar_data is parsed. Reduce for less data and quicker visualisation
UPTO = 50;

//These two are populated by populateNodesEdges() and used to generate network in visualise
//--Contains node objects {id: ..., label: ..., ...}
var node_list = [];
//--Contains edges {from: ..., to: ..., ...}
var edge_list = [];

//Reference to nodes' representation in visjs network. Used when highlighting nodes.
var nodes = new vis.DataSet();











/**
* Attached to document. Enables searching with ctrl+f
* @param {Event} e - keyboard event
*/
function processKeyDown(e) {
  if (e.key === 'f' && e.ctrlKey) {
    e.preventDefault();
    document.getElementById('search-bar-input').focus();
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
    if (list_obj['id'] === obj['id']) isit = true;
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
      id: meeting['SUMMARY'],
      label: meeting['SUMMARY'].slice(0, 20),

      shape: 'box',
      shapeProperties: {
        borderRadius: 0
      },
      borderWidth: 0,
      color: '#D0D0D0',
      font: {
        color: '#343434'
      },

      notes: meeting['NOTES'],
      type:'meeting',
      attendees: meeting['ATTENDEE'],
      date: meeting['DTSTART']
    };
    //Avoid repetition
    if (!isObjectInList(meeting_node, node_list)) node_list.push(meeting_node);

    //Now add name nodes for each attendee of the meeting
    if (meeting['ATTENDEE'] !== undefined) {
      meeting['ATTENDEE'].map(function(name) {
        //Parsing attendee names. Need to improve this.
        // var surname = name.split(',')[0];
        // if (surname === '') surname = name;
        // surname = surname.slice(0, 10);

        //A name node has redundant attributes 'notes' and 'attendees'
        //to avoid 'undefined' errors, when the netwok is manipulated. Definitely need to improve this.
        var name_node = {
          id: name,
          label: name,

          borderWidth: 0,
          color: '#FFDAB9',
          font: {
            color: '#343434'
          },

          type: 'person',
          notes:'',
          attendees: [],
          role: roles[name]
        };
        if (!isObjectInList(name_node, node_list)) node_list.push(name_node);

        //Add an edge from the meeting to the attendee
        edge_list.push({from: meeting['SUMMARY'], to: name, length: 1});
      });
    }
  });

  console.log('num nodes: '+node_list.length);
  console.log('num edges: '+edge_list.length);
  console.log(calendar_data);
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
      improvedLayout: true
    }
  };

  //Add the search bar
  document.getElementById('search-bar-input').setAttribute('style', 'display: block');
  document.addEventListener('keydown', processKeyDown, false);

  //initialize your network
  var network = new vis.Network(container, data, options);
  vis.fit({
    nodes: data.nodes,
    animation: false
  });
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

  if (val !== '') {
    nodes.get().map(function(node) {
      if (ids.indexOf(node.id) !== -1) {
        highlightNode(node);
      } else unhighlightNode(node);

      nodes.update(node);
    });
  } else {
    //highlights everything if nothing in search bar
    nodes.get().map(function(node) {
      highlightNode(node);
      nodes.update(node);
    });
  }
}

function highlightNode(node) {
  if (node.type === 'meeting') {
    node.color = '#D0D0D0';
    node.font.color = '#343434';
  } else {
    node.color = '#FFDAB9';
    node.font.color = '#343434';
  }
}

function unhighlightNode(node) {
  if (node.type === 'person') {
    node.color = '#FFDAB954';
    node.font.color = '#34343454';
  } else {
    node.color = '#D0D0D054';
    node.font.color = '#34343454';
  }
}

/**
* Displays node notes and id in console when hovered over. Called in visjs options object.
*/
function displayNodeProperties(values, id, selected, hovering) {
  if (hovering) {
    // console.clear();
    // console.log('%c '+id, 'background: dodgerblue;');
    // console.log(nodes.get(id).notes);

    document.getElementById('node-id').textContent = id;

    if (nodes.get(id).date != null) document.getElementById('node-date').textContent = nodes.get(id).date.toLocaleDateString('en-GB');
    else  document.getElementById('node-date').textContent = '';

    if (nodes.get(id).role != null) document.getElementById('node-role').textContent = nodes.get(id).role;
    else  document.getElementById('node-role').textContent = '';

    document.getElementById('node-notes').textContent = nodes.get(id).notes;
  }

  // document.getElementById('node-id').textContent = '';
  // document.getElementById('node-notes').textContent = '';
}










//Attaching listeners
populateNodesEdges(UPTO);
visualise();
