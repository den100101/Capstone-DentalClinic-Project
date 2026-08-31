import "../styles/orthodontics.css";

function Orthodontics() {
  return (
    <>
      <div className="orthodontics-container">
        <div className="ortho-header">
          <h1>Orthodontics</h1>
        </div>
        <div className="orthodontics-contents">
          <div>
            <img
              src="/Images/ortho-teeth.jpg"
              alt="orthodontics-img"
              className="ortho-img"
            />
          </div>
          <div className="orthodontics-services">
            <ul>
              <h1>Orthodontics Services</h1>
              <li>Traditional Metal Braces</li>
              <li>Ceramic Braces</li>
              <li>Self-Ligating Braces</li>
              <li>Clear Aligners</li>
              <li>Retainers</li>
              <li>Space Maintainers</li>
              <li>Early Orthodontic Treatment</li>
              <li>Bite Correction Treatment</li>
              <li>Crowding and Spacing Correction</li>
              <li>Jaw Alignment Treatment</li>
            </ul>
          </div>
        </div>
        <div className="about-orthodontics">
          <div className="about-ortho-header">
            <h1>Orthodontics</h1>
          </div>
          <div className="about-ortho-p">
            <p>
              Orthodontics is a specialized field of dentistry that focuses on
              correcting misaligned teeth, bite problems, and jaw
              irregularities. Properly aligned teeth not only improve the
              appearance of your smile but also contribute to better oral
              health, making it easier to clean your teeth and maintain healthy
              gums.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Orthodontics;
