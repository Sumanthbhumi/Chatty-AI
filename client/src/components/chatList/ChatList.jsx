import { Link } from "react-router-dom";
import "./chatList.css";
import { useQuery } from "@tanstack/react-query";

const ChatList = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["userChats"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  return (
    <div className="chatList">
      <span className="title">DASHBOARD</span>
      <Link to="/dashboard">Create new Chat</Link>
      <Link to="/dashboard">Explore</Link>
      <Link to="/dashboard">Contact</Link>
      <hr />
      <span className="title">Recent Chats</span>
      <div className="list">
        {isPending ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Something went wrong</p>
        ) : (
          data?.map((chat) => (
            <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>
              {chat.title}
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
