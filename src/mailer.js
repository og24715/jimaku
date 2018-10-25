const inbox = require('inbox');
const { simpleParser } = require('mailparser');

const isSendingFromYouTube = ({ from, subject }) => {
  if (from !== 'YouTube <noreply@youtube.com>') {
    return false;
  }
  if (!subject.includes('just uploaded a video')) {
    return false;
  }
  return true;
};

const config = {
  port: 993,
  host: 'imap.gmail.com',
  options: {
    secureConnection: true,
    auth: {
      user: 'hirakawaryouga@gmail.com',
      pass: '1996129aquarius',
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

  console.log('From: ', mail.from.text);
  console.log('To: ', mail.to.text);
  console.log('Subject: ', mail.subject);
  console.log('Body: ', mail.html);

  const isFromYouTube = isSendingFromYouTube({
    from: mail.from.text,
    subject: mail.subject,
  });

  if (isFromYouTube) {
    console.log('This mail is form YouTube.');
    const re = /(http:\/\/www\.youtube\.com\/watch\?v=.*)\&/gm;
    const result = re.exec(mail.html)[1].replace('3D', '');

    console.log('URL: ', result);
  }
});

client.connect();
