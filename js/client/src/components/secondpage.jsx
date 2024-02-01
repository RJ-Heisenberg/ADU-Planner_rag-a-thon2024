import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import NavigationBar from './../navigationbar.js'; // Import your navigation bar component
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// import About component

// const SecondP'./NavigationBar'; // Assuming you have a NavigationBar component

var location = window.location.toString().split('?')[0];
if (location.at(location.length - 1) !== '/') {
  location += '/';
}

const queryString = window.location.search;
const queryParams = new URLSearchParams(queryString);
const conversation_id = queryParams.get('id');
var socket = null;


const sendMessage = () => {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value;
  if (message.trim() !== '' && socket !== null) {
    socket.send(message);
    messageInput.value = '';
  }
};

const getMessages = async (conversation_id) => {
  const uri = `http://localhost:9999/conversation/${conversation_id}`;
  const response = await fetch(uri);
  const conversation = await response.json();
  return conversation;
};

const getConversationIds = async () => {
  const uri = `http://localhost:9999/conversation`;
  const response = await fetch(uri);
  const conversationIds = await response.json();
  return conversationIds;
}

const startConversation = async () => {
  const uri = `http://localhost:9999/conversation`;
  const response = await fetch(uri, {method: "POST"});
  const conversation = await response.json();
  return conversation["id"];
};

const listen = () => {
  socket = new WebSocket(`ws://localhost:9999/conversation/${conversation_id}`);
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    displayMessage(`${message.sender}: ${message.body}`);
  });
  // const statusDisplay = document.getElementById('statusDisplay');
  // statusDisplay.textContent = 'Connected';
}

const displayMessage = (message) => {
  const messageDisplay = document.getElementById('messageDisplay');
  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  messageDisplay.appendChild(messageElement);
  messageDisplay.scrollTop = messageDisplay.scrollHeight;
}

const SecondPage = () => {
  const [threads, setThreads] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  React.useEffect(() => {
    //const unsubscribe = navigation.addListener('state', () => {
      // do something
      getConversationIds().then(conversationsIds => {
      setThreads(conversationsIds.map(id => ({id: id,
      userId: id,
      content: '<TODO.>'})));

      console.log("hello world");
      })
      getMessages(conversation_id).then(messages => {
            setMessages(messages);
            listen();
      })
    //return unsubscribe;
  }, []);


    // if (sendMessage != null) {
  // getConversationIds().then(conversationsIds => {
  //   setThreads(conversationsIds.map(id => {
  //     return {
  //       id: id,
  //       userId: id,
  //       content: '<TODO.>'
  //     };
  //   }))
  // })

  

  // const handleUserInput = () => {
  //   if (inputText.trim() !== '') {
  //     const currentTime = new Date().toLocaleString();
  //     const newThread = {
  //       id: threads.length + 1,
  //       userId: 'User123',
  //       time: currentTime,
  //       content: inputText,
  //     };
  //     setThreads([...threads, newThread]);
  //     setInputText(''); // Clear the input field after adding a thread
  //   }
  // };
  // if (sendMessage != null) {
  // getConversationIds().then(conversationsIds => {
  //   setThreads(conversationsIds.map(id => {
  //     return {
  //       id: id,
  //       userId: id,
  //       content: '<TODO.>'
  //     };
  //   }))
  // })

 // if (sendMessage != null) {
 //   getConversationIds().then(conversationsIds => {
  //    }))
  //  }
    
  // if (conversation_id === null) {
  //   // startConversation ().then(id => {
  //   //   if (id !== undefined) {
  //   //     window.location.href = `${window.location}?id=${id}`;
  //   //   }
  //   // });
  // } else {
  //   getMessages().then(messages => {
  //     setMessages(messages);
  //     // listen();
  //   })
  // }
//}

  return (
    <div>
      <NavigationBar></NavigationBar>
      <div className="page-container">
        <div className="left-column-QA">
          {/* Display threads in the left column */}
          {/*<Routes>*/}
          {threads.map((thread) => (

            <Link to={`?id=${thread.id}`}>
          
              <div key={thread.id} className="thread">
              <div>{thread.userId}</div>    {/*user*/}
              <div>{thread.content}</div>   {/*content*/}
            </div>
            </Link>
            //} 
            ///>

            //<Link to={`?id=${thread.id}`}>
            // <div key={thread.id} className="thread">
            //   <div>{thread.userId}</div>    {/*user*/}
            //   <div>{thread.content}</div>   {/*content*/}
            // </div>
            // </Link>
          ))}
          {/*</Routes>*/}
        </div>


        <div className="right-column-QA">
          {/* User input section in the right column */}
          <div className="user-input">
          <div id="messageDisplay">
          {/* Display threads in the left column */}
          {messages.map((message) => (
             <div>{message.sender}: {message.body}</div> 
          ))}
          </div>
          <input
              type="text"
              id="messageInput"
              placeholder="Type your message"
              //onChange={(e) => setInputText(e.target.value)}
            />
            <button id="sendMessageBtn" onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondPage;

