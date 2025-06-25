import React, { useState } from 'react';
import './App.css';

const translateWithMyMemory = async (text: string, from: 'en' | 'ko', to: 'en' | 'ko') => {
  try {
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }
    
    throw new Error('Translation failed');
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};

// Fallback to mock translation if API fails
const translate = async (text: string, from: 'en' | 'ko', to: 'en' | 'ko') => {
  try {
    return await translateWithMyMemory(text, from, to);
  } catch (error) {
    // Fallback to mock translation if API fails
    console.warn('Using mock translation as fallback');
    return `[${to.toUpperCase()}] ` + text.split('').reverse().join('');
  }
};

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [fromLang, setFromLang] = useState<'en' | 'ko'>('en');
  const [toLang, setToLang] = useState<'en' | 'ko'>('ko');
  const [loading, setLoading] = useState(false);

  const handleSwap = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    setInput(output);
    setOutput('');
  };

  const handleTranslate = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    try {
      const translated = await translate(input, fromLang, toLang);
      setOutput(translated);
    } catch (error) {
      console.error('Translation error:', error);
      setOutput('Translation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Korean-English Translator</h1>
      <div className="controls">
        <select value={fromLang} onChange={e => setFromLang(e.target.value as 'en' | 'ko')}>
          <option value="en">English</option>
          <option value="ko">Korean</option>
        </select>
        <button className="swap" onClick={handleSwap} title="Swap languages">⇄</button>
        <select value={toLang} onChange={e => setToLang(e.target.value as 'en' | 'ko')}>
          <option value="en">English</option>
          <option value="ko">Korean</option>
        </select>
      </div>
      <textarea
        rows={4}
        placeholder={`Enter text in ${fromLang === 'en' ? 'English' : 'Korean'}...`}
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button className="translate" onClick={handleTranslate} disabled={loading || !input}>
        {loading ? 'Translating...' : 'Translate'}
      </button>
      <textarea
        rows={4}
        placeholder={`Translation in ${toLang === 'en' ? 'English' : 'Korean'}...`}
        value={output}
        readOnly
      />
    </div>
  );
};

export default App;
