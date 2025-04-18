import Rect, {useState, useEffect, useRef} from "react";
import music from './Client_src_iphone-sms-tone-original-mp4-5732.mp3'
export const Chat = ({socket, username, room})=>{
    const [currentMessage, setCurrentMessage]=useState("");
    const [messageList, setMessageList]=useState([]);
    const notification =new Audio(music);
    const sendMessage = async () => {
        if (currentMessage.trim() !== "") {
          const now = new Date();
          const hours = now.getHours();
          const formattedHour = hours % 12 || 12;
          const minutes = now.getMinutes().toString().padStart(2, '0');
          const ampm = hours >= 12 ? "PM" : "AM"; 
          const time = `${formattedHour}:${minutes} ${ampm}`;
          const messageData = {
            id: Math.random(),
            room: room,
            author: username,
            message: currentMessage,
            time: time,
          };
          await socket.emit("Send_message", messageData);
          setMessageList((list) => [...list, messageData]);
          setCurrentMessage("");
          notification.play();
        }
      };
      useEffect(() => {
        const handleReceiveMessage = (data) => {
          console.log("Received msg:", data);
          setMessageList((list) => [...list, data]);
        };
        socket.on("Receive_message", handleReceiveMessage);
        return () => socket.off("Receive_message", handleReceiveMessage);
      }, [socket]);
    const containRef=useRef(null)
    useEffect(()=>{
        containRef.current.scrollTop= containRef.current.scrollHeight;
    }, [messageList])
    return(
        <>
        <div className="chat_container">
            <h1>Welcome {username} Room No: {room}</h1>
            <div className="chat_box">
                <div className="auto-scrolling-div"
                ref={containRef}
                style={{
                    height: "450px",
                    overflowY: "auto",
                    border: "2px solid yellow",
                }}
                >
                    {messageList.map((data=>(
                        <div 
                        key={data.id}
                        className="message_content"
                        id={username == data.author ? "you" : "other"}
                        >
                            <div>
                                <div className="msg" id={username == data.author ? "y" : "b"}>
                                    <p>{data.message}</p>
                                </div>
                                <div className="msg_detail">
                                    <p>{data.author}</p>
                                    <p>{data.time}</p>
                                </div>
                        </div>
                        </div>
                    )))}
            </div>
            <div className="chat_body">
                <input
                value={currentMessage}
                type = "text"
                placeholder="Type a message..."
                onChange={(e)=>setCurrentMessage(e.target.value)}
                onKeyDown={(e)=>{
                    e.key === "Enter" && sendMessage();
                }}
                />
                <button onClick={sendMessage}>&#9658;</button>
                </div>
            </div>
        </div>
        </>
    );
};