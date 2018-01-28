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
var calendar_data = [
   {
      "SUMMARY":"Some Project",
      "DTSTART":null,
      "DTEND":null,
      "DUE":"",
      "NOTES":"Discuss tea drinking ",
      "ATTENDEE":[
         "Bob, John",
         "Smith, Samuel",
         "DiCaprio, Dave"
      ],
      "LOCATION":"Meeting room 3",
      "PRIORITY":"5",
      "URL":""
   },
   {
      "SUMMARY":"Planning plan #45",
      "DTSTART":null,
      "DTEND":null,
      "DUE":"",
      "NOTES":"Hello everyone, we should do things.",
      "ATTENDEE":[
         "Bob, John",
         "Smith, Samuel",
         "Scott, Michael"
      ],
      "LOCATION":"Meeting room 2",
      "PRIORITY":"5",
      "URL":""
   },
      {
      "SUMMARY":"Star Wars Sequel",
      "DTSTART":null,
      "DTEND":null,
      "DUE":"",
      "NOTES":"Empire did nothing wrong.",
      "ATTENDEE":[
         "Scott, Michael",
         "Skywalker, Luke"
      ],
      "LOCATION":"Meeting room 1",
      "PRIORITY":"5",
      "URL":""
   }
];

let names = _.range(1, 100).map( function(num) {
  return 'smith'+num+', '+'john';
});

let summaries = _.range(1, 50).map( function(num) {
  return 'meeting about this and also that'+num;
});

// calendar_data = summaries.map( function(summ, i) {
//   let num_attendees = _.sample( [2, 3, 4, 5, 6] );
//   let attendees = [];
//   let boss_chance = _.sample( [0, 1] );
//   if (i < 20) {
//     attendees = _.sample(names.slice(0, 15), num_attendees);
//     attendees.concat( _.sample(names.slice(15, 50), boss_chance) );
//   }
//
//   if (20 < i && i < 40) {
//     attendees = _.sample(names.slice(15, 30), num_attendees);
//     attendees.concat( _.sample(names.slice(30, 50), boss_chance) );
//   }
//
//   if (40 < i) {
//     attendees = _.sample(names.slice(30, 50), num_attendees);
//     attendees.concat( _.sample(names.slice(0, 30), boss_chance) );
//   }
//
//   return {
//     'SUMMARY': summ,
//     'DTSTART': new Date(),
//     'DTSTART': new Date(),
//     'NOTES': 'bla bla bla bla bla blab lba lab alb abl bl',
//     'ATTENDEE': attendees
//   }
// });

console.log('made data');
