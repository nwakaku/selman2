export const translateText = async (inputLanguage, text, targetLanguage) => {
  const url = 'https://text-translator2.p.rapidapi.com/translate';
  const formData = new URLSearchParams();
  formData.set('source_language', inputLanguage);
  formData.set('target_language', targetLanguage);
  formData.set('text', text);

  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': '560e6753b3mshe9ff157f5c0df1cp1536bfjsn9e213086347f',
      'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com',
    },
    body: formData,
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
    return data;

  } catch (error) {
    console.error('Error translating text:', error);
    throw error;
  }
};
