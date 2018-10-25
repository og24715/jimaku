const assParser = require('ass-parser');

module.exports = (ass) => {
  const [scriptInfo, style, events] = assParser(ass);

  events.body.shift();

  const filter = events => events.body.map(({ value }) => ({
    start: value.Start,
    end: value.End,
    text: value.Text,
  }));

  return filter(events);
};
