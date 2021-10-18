import { Link } from "react-router-dom";
const About = () => {
  const open = () => {
    window.open("mailto:etl676@gmail.com");
  };

  return (
    <>
      <h2>Workout tracking app</h2>
      <p>
        This app is designed to track workouts at the gym as you preform them.
      </p>
      <ul>
        <li>
          Create your own routines and log each and every set to see how you
          progress over time.
        </li>
        <li>Get alerts when you break your own personal records.</li>
        <li>
          Add your own costume exercises to fit every workout you may preform.
        </li>
        <li>Get visual representation of your progress.</li>
      </ul>
      <p>
        The app was created by Itiel Olenick. If you have any questions or
        suggestions feel free to email me at{" "}
        <Link to="#" onClick={open}>
          etl676@gmail.com
        </Link>
        .<br /> <br />
        Enjoy the app! 💪
      </p>
    </>
  );
};

export default About;
