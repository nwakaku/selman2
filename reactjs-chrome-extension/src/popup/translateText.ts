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
      'X-RapidAPI-Key': 'ce47871234msha1c35e5dc69ca52p117ba4jsn1dc1a0fa24c6',
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
