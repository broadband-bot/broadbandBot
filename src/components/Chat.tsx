// src/components/Chat.tsx
import '../App.css';
import '../index.css';

import React, { useEffect, useState } from "react";
import { TextField, Button, Container, Grid, CircularProgress, LinearProgress } from "@mui/material";
import Message from "./Message";
import OpenAI from "openai";
import { MessageDto } from "./models/MessageDto";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';




const Chat: React.FC = () => {
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<MessageDto>>(new Array<MessageDto>());
  const [input, setInput] = useState<string>("");
  const [assistant, setAssistant] = useState<any>(null);
  const [thread, setThread] = useState<any>(null);
  const [openai, setOpenai] = useState<any>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 600);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    initChatBot();
  }, []);

  useEffect(() => {
    setMessages([
      {
        content: "Hello 👋 I’m the Faircount Chatbot.  \n\n I can help you with questions about receiving discounted internet services through the Affordable Connectivity Program. \n\n I can also help walk you through the application process itself. If you would like to fill out an application to receive discounted interent services text \"WIFI\" so we can get started!",
        isUser: false,
      },
    ]);
  }, [assistant]);

  const initChatBot = async () => {
    const openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });


      

    // Upload a file with an "assistants" purpose

    // Create an assistant
    const assistant = await openai.beta.assistants.create({
      name: "Expert On the Affordable Connectivity Program",
      instructions: "UTILIZE MARKDOWN TO BOLD YOUR HEADERS. You are an expert on helping sign people up for Federal Broadand Access, specifically, throught the FCC's Affordable Connectivity Program. Some of the users that will interact with you may come from low-literacy backgrounds, so be concise and give easy-to-read responses. You need to be personable so include a friendly emoji at the end of your messages. If the first messase they send is \"WIFI\" walk them through applying for the Affordable Connectivity Program step by step. Emphasis personability, trying to be as conversational as possible while maintaining accuracy of information. ",
      model: "gpt-4-1106-preview",
    });

    // Create a thread
    const thread = await openai.beta.threads.create();

    setOpenai(openai);
    setAssistant(assistant);
    setThread(thread);
  };

  const createNewMessage = (content: string, isUser: boolean) => {
    const newMessage = new MessageDto(isUser, content);
    return newMessage;
  };

  const handleSendMessage = async () => {
    messages.push(createNewMessage(input, true));
    setMessages([...messages]);
    setInput("");

    // Send a message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: input,
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });

    // Create a response
    let response = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    // Wait for the response to be ready
    while (response.status === "in_progress" || response.status === "queued") {
      console.log("waiting...");
      setIsWaiting(true);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      response = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    setIsWaiting(false);

    // Get the messages for the thread
    const messageList = await openai.beta.threads.messages.list(thread.id);

    // Find the last message for the current run
    const lastMessage = messageList.data
      .filter((message: any) => message.run_id === run.id && message.role === "assistant")
      .pop();

    // Print the last message coming from the assistant
    if (lastMessage) {
      console.log(lastMessage.content[0]["text"].value);
      setMessages([...messages, createNewMessage(lastMessage.content[0]["text"].value, false)]);
    }
  };

  // detect enter key and send message
  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Container>
      <Grid container direction="column" spacing={2} paddingBottom={5}>
        {messages.map((message, index) => (
          <Grid item alignSelf={message.isUser ? "flex-end" : "flex-start"} key={index}>
            <Message key={index} message={message} />
          </Grid>
        ))} 
        <Grid item >
        <div className={isSmallScreen ? "grid grid-cols-1 gap-2" : "grid grid-cols-2 gap-2"}>
                        <button id="suggestion1" 
                                onClick={() => setInput("What is the ACP?")}
                                className=" flex text-sm h-15 bg-purple-600 text-white rounded-lg p-2 hover:bg-purple-700 transition duration-150 ease-in-out">
                            <div className = "flex flex-col items-start">
                                <h2 className = "font-bold">What is the ACP?</h2>
                                <h4 className = "text-grey">Learn about the Affordable Connectivity Program</h4>
                            </div>
                        </button>
                        <button id="suggestion2"
                                onClick={() => setInput("What documents do I need?")}
                                className="hide-on-small-screen flex text-sm h-15 bg-purple-600 text-white rounded-lg p-3 hover:bg-purple-700 transition duration-150 ease-in-out">
                            <div className = "flex flex-col items-start">
                                <h2 className = "font-bold">What documents do I need?</h2>
                                <h4 className = "text-grey">Get help accessing documents to prepare for registration</h4>
                            </div>  
                        </button>
                        <button id="suggestion3" 
                                onClick={() => setInput("How do I qualify for the ACP?")}
                                className="hide-on-medium-screen flex text-sm h-15 bg-purple-600 text-white rounded-lg p-3 hover:bg-purple-700 transition duration-150 ease-in-out">
                            <div className = "flex flex-col items-start">
                                <h2 className = "font-bold">How do I qualify for the ACP?</h2>
                                <h4 className = "text-grey">Get information on how to qualify for the ACP</h4>
                            </div>
                        </button>
                        <button id="suggestion4" 
                                onClick={() => setInput("Can you walk me through the application?")}
                                className="hide-on-medium-screen flex text-sm h-15 bg-purple-600 text-white rounded-lg p-3 hover:bg-purple-700 transition duration-150 ease-in-out">
                            <div className = "flex flex-col items-start">
                                <h2 className = "font-bold">Can you walk me through the application?</h2>
                                <h4 className = "text-grey">Step-by-step assistance to apply</h4>
                            </div>
                        </button>
                    </div> 
        </Grid>
        <Grid item>
          <TextField
            label="Type your message"
            variant="outlined"
            disabled={isWaiting}
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          {isWaiting && <LinearProgress color="secondary" />}
        </Grid>
        {!isWaiting && (
          <Grid item>
            <Button variant="contained" color="secondary" onClick={handleSendMessage} disabled={isWaiting}>
                <FontAwesomeIcon icon={faPaperPlane} />
            </Button>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Chat;