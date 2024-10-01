import { Link } from "react-router-dom";
import "./homePage.css";

const HomePage = () => {
  return (
    <div className="homepage">
      <img src="./orbital.png" alt="" className="orbital" />
      <div className="left">
        <h1>Chatty AI</h1>
        <h2>Supercharge your creativity with ai</h2>
        <h3>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum
          consequuntur qui dolore non sequi
        </h3>
        <Link to="/dashboard" className="link">
          Get Started
        </Link>
      </div>
      <div className="right">
        <div className="imgContainer">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img src="/bot.png" alt="" className="bot" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
