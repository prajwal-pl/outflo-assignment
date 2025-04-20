import { Groq } from "groq-sdk";

interface PersonalizedMessage {
  firstName: string;
  lastName: string;
  summary: string;
  company: string;
  location: string;
}

export const generatedMessage = async ({
  firstName,
  lastName,
  summary,
  company,
  location,
}: PersonalizedMessage) => {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY!,
  });

  const prompt = `Generate a personalized message for LinkedIn outreach based on the following information:
    - First Name: ${firstName}
    - Last Name: ${lastName}
    - Summary: ${summary}
    - Company: ${company}
    - Location: ${location}

    The message should be friendly, professional, and relevant to the recipient's background and current role. It should also include a call to action for connecting or networking. Also the message must consist of Outflo's product features and benefits.

    For example:

    {
    "message": "Hey John, I see you are working as a Software Engineer at TechCorp. Outflo can help automate your outreach to increase meetings & sales. Let's connect!"
    }

    Do not add anything else other than the message, just output the message directly

    `;

  try {
    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
    });

    console.log(response.choices[0].message.content);
    return response.choices[0].message.content;
  } catch (error) {
    console.log(error);
  }
};
