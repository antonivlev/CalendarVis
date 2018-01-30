/*
calendar_data = [
  {
    SUMMARY: "Meeting about the thing",
    DTSTART: Date,
    DTEND: Date,
    NOTES: "Agenda: 1. Talk about the thing  2. Drink tea  3....."
    ATTENDEE: ["Smith, Paul", "BeGoode, Johnny", ...]
  },
  ...
]
*/

let eng = [
  'Shad Gilmour',
  'Rodolfo Hwang',
  'Riley Wentz',
  'Beau Vendetti',
  'Lyman Rippe',
  'Hector Brathwaite',
  'Keenan Carberry',
  'Tommie Vorce'
]

let boss = [
  'Demetrius Garica',
  'Loren Wilkinson',
  'Jon Black'
]

let ops = [
  'Jonas Stainbrook',
  'Vince Olberding',
  'Treena Shumake',
  'Waldo Sinkfield',
  'Clifford Landwehr',
  'Omar Pazos',
  'Elmer Toman'
]

let roles = {
  'Shad Gilmour': 'programmer',
  'Rodolfo Hwang': 'programmer',
  'Riley Wentz': 'machine learning engineer',
  'Beau Vendetti': 'UI designer',
  'Lyman Rippe': 'network engineer',
  'Hector Brathwaite': 'machine learning engineer',
  'Keenan Carberry': 'UI developer',
  'Tommie Vorce': 'UI developer',

  'Demetrius Garica': 'board member',
  'Loren Wilkinson': 'CEO',
  'Jon Black': 'PR officer',

  'Jonas Stainbrook': 'operations lead',
  'Vince Olberding': 'system administrator',
  'Treena Shumake': 'infrastructure lead',
  'Waldo Sinkfield': 'system administrator',
  'Clifford Landwehr': 'market analyst',
  'Omar Pazos': 'market analyst',
  'Elmer Toman': 'market analyst'
}


var calendar_data = [
    {
      "SUMMARY":"Blueberry project regular update",
      "DTSTART":new Date(Date.UTC(2012, 11, 22, 3, 0, 0)),
      "DTEND":null,
      "DUE":"",
      "NOTES":"Agenda: 1. Issue with nav bar   2. Neural net status    3. Alpha version feedback",
      "ATTENDEE":[
        eng[0],
        eng[1],
        eng[2],
        eng[3],
        ops[0],
        ops[1],
        boss[0],
        boss[1]
      ],
      "LOCATION":"Meeting room 3",
      "PRIORITY":"5",
      "URL":""
    },
    {
      "SUMMARY":"Data processing approaches",
      "DTSTART":new Date(Date.UTC(2012, 11, 20, 3, 0, 0)),
      "DTEND":null,
      "DUE":"",
      "NOTES":"Agenda: 1. Neual net alternatives  2. Genetic algorithms optimisation  3. Cloud deployment options",
      "ATTENDEE":[
        eng[4],
        eng[5],
        eng[2],
        eng[3]
      ],
      "LOCATION":"Meeting room 2",
      "PRIORITY":"5",
      "URL":""
    },
    {
      "SUMMARY":"Build #3 next steps",
      "DTSTART":new Date(Date.UTC(2012, 11, 19, 3, 0, 0)),
      "DTEND":null,
      "DUE":"",
      "NOTES":"Agenda: 1. Visual overview   2. Milestones    3. Quuestions",
      "ATTENDEE": eng,
      "LOCATION":"Meeting room 1",
      "PRIORITY":"5",
      "URL":""
    },
    {
      "SUMMARY":"Machine learning from customer data",
      "DTSTART":new Date(Date.UTC(2012, 11, 20, 3, 0, 0)),
      "DTEND":null,
      "DUE":"",
      "NOTES":"Agenda: 1. Neural net issues",
      "ATTENDEE": [
        eng[4],
        eng[5],
        eng[2]
      ],
      "LOCATION":"Meeting room 1",
      "PRIORITY":"5",
      "URL":""
    },


    {
      "SUMMARY":"Customer feedback session 3",
      "DTSTART":new Date(Date.UTC(2012, 11, 20, 3, 0, 0)),
      "DTEND":null,
      "DUE":"",
      "NOTES":"Agenda: 1. Review previous session   2. Book room   3. Assign roles",
      "ATTENDEE": ops.concat([boss[2], boss[1]]),
      "LOCATION":"Meeting room 1",
      "PRIORITY":"5",
      "URL":""
    },
    {
      "SUMMARY":"Cloud providers issues",
      "DTSTART":new Date(Date.UTC(2012, 11, 21, 3, 0, 0)),
      "DTEND":null,
      "DUE":"",
      "NOTES":"Agenda: 1. AWS cost concerns   2. Azure communications",
      "ATTENDEE": [
        boss[1],
        ops[0],
        ops[1],
        ops[2],
        ops[3]
      ],
      "LOCATION":"Meeting room 1",
      "PRIORITY":"5",
      "URL":""
    }
];

console.log('made data');
