import React, { useState, useRef, useEffect} from 'react';
import './App.css'; // Or the relevant CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import OpenAI from 'openai';

let memory = []
const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true
})

const TypingEffect = ({ text, onTypingDone }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);
  
    useEffect(() => {
      if (index < text.length) {
        const timer = setTimeout(() => {
          setDisplayedText((prev) => prev + text[index]);
          setIndex((prev) => prev + 1);
        }, 50); // Adjust the speed as needed
  
        return () => clearTimeout(timer);
      } else {
        onTypingDone && onTypingDone();
      }
    }, [index, text, onTypingDone]);
  
    return <p>{displayedText}</p>;
  };




  
const BroadbandSignup = () => {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [areSuggestionsVisible, setSuggestionsVisible] = useState(true);
    const messagesEndRef = useRef(null);

    const handleTypingDone = (messageIndex) => {
        setMessages(currentMessages =>
            currentMessages.map((msg, index) =>
                index === messageIndex ? { ...msg, typing: false } : msg
            )
        );
    };
    
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };


    const handleSendClick = async () => {
        if (inputValue.trim() !== '') {
            const newMessages = [...messages, { text: inputValue, type: 'user' }];
            setMessages(newMessages);
            setInputValue('');
            try {
                memory.push(inputValue)
                const aiResponse = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [{"role": "assistant", "content": memory.join(' ')},
                               {"role": "user", "content": inputValue}
                              ],
                    
                  });
                memory.push(aiResponse.choices[0].message.content)
                 setMessages([...newMessages, { type: 'ai', text: aiResponse.choices[0].message.content, typing: true}]);
                   
            } catch (error) {
              console.error('Error calling OpenAI:', error);
              // Handle the error (e.g., show an error message)
            }
          }
        setSuggestionsVisible(false);
    };

    const handleSuggestionClick = (suggestionText) => {
        setInputValue(suggestionText); // Set the inputValue state
    
        // Simulate sending the message
        // Using setTimeout to ensure state is updated before sending
        setTimeout(() => {
            handleSendClick();
        }, 0);
    };
    

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="bg-white flex flex-col h-screen">
            <div className="responsive-width mx-auto flex-1">
                <div className="text-3xl font-semibold text-center mb-4">
                    Broadband4All
                </div>

                <div className="p-6">
                    {areSuggestionsVisible && (
                    <h2 className="text-3xl font-semibold text-center mb-4">
                        Commonly Asked
                    </h2>)}
                    {areSuggestionsVisible && (
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button id="suggestion1" onClick={() => handleSuggestionClick("How do I Qualify?")} className="bg-purple-600 text-white rounded-lg p-3">
                                How do I Qualify?
                            </button>
                            <button id="suggestion2" onClick={() => handleSuggestionClick("Is there a deadline?")} className="bg-purple-600 text-white rounded-lg p-3">
                                Is there a deadline?
                            </button>
                            <button id="suggestion3" onClick={() => handleSuggestionClick("What Documents Do I Need?")} className="bg-purple-600 text-white rounded-lg p-3">
                                What Documents Do I Need?
                            </button>
                            <button id="suggestion4" onClick={() => handleSuggestionClick("Can you walk me through an application?")} className="bg-purple-600 text-white rounded-lg p-3">
                                Can you walk me through an application?
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="fixed-bottom p-6 bg-white">
                <div className="flex items-center bg-purple-600 text-white rounded-lg p-3 justify-center">
                    <input
                        className="bg-transparent flex-1 outline-none"
                        placeholder="Enter a question here..."
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    <button onClick={handleSendClick} className="text-white">
                         <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </div>

                <div className="image-container">
                    <img src="/faircount.avif"/>
                    <img src="/govlab.png" height={50}/>
                </div>
            </div>
            <div className="messages-container">
                  {messages.map((message, index) => (
                     <div key={index} className={`message-bubble ${message.type === 'ai' ? 'ai-message' : 'user-message'}`}>
                         {message.type === 'ai' && message.typing
                            ? <TypingEffect text={message.text} onTypingDone={() => handleTypingDone(index)} />
                            : <p>{message.text}</p>
                         }
                     </div>
                    ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default BroadbandSignup;
