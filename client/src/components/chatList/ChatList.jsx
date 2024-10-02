import { Link } from "react-router-dom";
import "./chatList.css";
import { useQuery } from "@tanstack/react-query";
import { SignedIn, SignOutButton } from "@clerk/clerk-react";

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
      <hr />
      <SignedIn className="bottom">
        <SignOutButton className="glowing-btn">
          <span className="glowing-txt">
            Sig<span className="faulty-letter">n O</span> ut
          </span>
        </SignOutButton>
      </SignedIn>
    </div>
  );
};

export default ChatList;
