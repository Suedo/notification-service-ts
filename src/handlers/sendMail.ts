import "source-map-support/register";
import { SES } from "aws-sdk";
import { SendEmailRequest } from "aws-sdk/clients/ses";

const ses = new SES({ region: "ap-south-1" });

export const sendMail = async (event, _context) => {
  // get records from SQS. For now, get just one record
  const record = event.Records[0];
  const { subject, body, recipient } = JSON.parse(record.body);
  console.log("Record obtained: " + JSON.stringify(record));

  const params: SendEmailRequest = {
    Source: "somjitnag192@gmail.com",
    Destination: {
      ToAddresses: [recipient],
    },
    Message: {
      Body: {
        Text: {
          Data: body,
        },
      },
      Subject: {
        Data: subject,
      },
    },
  };

  console.log("Params: " + JSON.stringify(params));

  try {
    const result = await ses.sendEmail(params).promise();
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const handler = sendMail;

// send a manual test email from `SQS > Queue Options > Send a Message`
// {"subject":"Test Mail using AWS SQS","body":"Test Body","recipient":"<youremail>@gmail.com"}
