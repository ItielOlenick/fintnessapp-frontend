import Login from "./Auth/Login";

const Home = () => {
  return (
    <div>
      <div className="main-content" style={{ textAlign: "center" }}>
        <h2>Welcome to my fitness app</h2>
      </div>
      <Login />
    </div>
  );
};

export default Home;
