import { Link } from "react-router-dom";
import "./chatList.css";

const ChatList = () => {
  return (
    <div className="chatList">
      <span className="title">DASHBOARD</span>
      <Link to="/dashboard">Create new Chat</Link>
      <Link to="/dashboard">Explore</Link>
      <Link to="/dashboard">Contact</Link>
      <hr />
      <span className="title">Recent Chats</span>
      <div className="list">
        <Link to="/">My chat Title</Link>
        <Link to="/">My chat Title</Link>
        <Link to="/">My chat Title</Link>
        <Link to="/">My chat Title</Link>
        <Link to="/">My chat Title</Link>
        <Link to="/">My chat Title</Link>
        <Link to="/">My chat Title</Link>
        <Link to="/">My chat Title</Link>
        <Link to="/">My chat Title</Link>
        <Link to="/">My chat Title</Link>
      </div>
    </div>
  );
};

export default ChatList;
