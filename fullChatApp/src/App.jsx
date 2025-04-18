import React, {useState} from 'react'
import io from 'socket.io-client'
import {Chat} from './Chat'
import music from './Client_src_mixkit-tile-game-reveal-960.wav'
const socket = io.connect("http://localhost:3000")
const App = () => {
  const[username, setUserName]= useState("");
  const [room, setRoom]=useState("");
  const[showChat,setShowChat]= useState(false);
  const notification= new Audio(music)
  const joinChat=()=>{
    if(username!==""&& room !== ""){
      socket.emit("Join_room", room);
      setShowChat(true)
      notification.play();
    }
  };
  return (
    <>
    {!showChat &&(
      <div className="join_room">
        <h1>Join Chat</h1>
        <input
        type="text"
        placeholder="Enter your Name"
        onChange={(e)=>setUserName(e.target.value)}
      />
      <input
      type="text"
      placeholder="Enter your Room"
      onChange={(e)=>setRoom(e.target.value)}
      />
      <button onClick={joinChat}>Join</button>
      </div>
    )}
    {
      showChat &&
      (
        <Chat socket={socket} username={username} room={room} />
      )
    }
    </>
  );
}
export default App