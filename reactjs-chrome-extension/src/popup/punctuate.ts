// export const punctuate = async (searchParam: string): Promise<string> => {
//     const apiKey: string = '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'; // Replace with your ChatGPT API key
//     const endpoint: string = 'https://api.openai.com/v1/chat/completions';
  
//     // Prepare the request payload
//     const payload = {
//       model: 'gpt-3.5-turbo',
//       messages: [
//         { role: 'system', content: `ChatGPT's Grammar and Punctuation Review Service` },
//         { role: 'user', content: `${searchParam}` },
//       ],
//       max_tokens: 100,
//       temperature: 0.7,
//       n: 1,
//       stop: '\n',
//     };
  
//     // Make the API request to ChatGPT API
//     try {
//       const response = await fetch(endpoint, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${apiKey}`,
//         },
//         body: JSON.stringify(payload),
//       });
  
//       // Parse the response
//       const data = await response.json();
//       const generatedSentence = data.choices[0].message.content;
  
//       return generatedSentence;
//     } catch (error) {
//       console.error('Error translating text:', error);
//       throw error;
//     }
//   };
  