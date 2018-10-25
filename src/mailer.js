const inbox = require('inbox');
const { simpleParser } = require('mailparser');

const config = {
  port: 993,
  host: 'imap.gmail.com',
  options: {
    secureConnection: true,
    auth: {
      user: 'kumakura.intern@gmail.com',
      pass: 'internyupiteruplus',
    },
  },
};

const client = inbox.createConnection(
  config.port,
  config.host,
  config.options,
);

client.on('connect', () => {
  console.log('connected');
  client.openMailbox('INBOX', (error) => {
    if (error) throw error;
  });
});

client.on('new', async (message) => {
  const stream = client.createMessageStream(message.UID);
  const mail = await simpleParser(stream);

  // console.log(mail.from);
  // console.log(mail.to);
  // console.log(mail.subject);
  // console.log(mail.text);

  let startPosition;
  let urlYoutube;
  if (mail.from.value[0].address == "noreply@youtube.com") {
    startPosition = mail.text.indexOf("https://www.youtube.com/");
    if (startPosition) {
      urlYoutube = mail.text.slice(startPosition, startPosition + 42);
      console.log(urlYoutube);
    }
  }
});

client.connect();
