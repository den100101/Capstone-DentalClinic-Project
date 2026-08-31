import "../styles/cosmetic-dentistry.css";

function CosmeticDentistry() {
  return (
    <>
      <div className="cosmetic-dentistry-container">
        <div className="cosmetic-dentistry-header">
          <h1>Cosmetic Dentistry</h1>
        </div>
        <div className="cosmetic-dentistry-content">
          <div>
            <img
              src="/Images/cosmetic-teeth.png"
              alt="cosmetic-img"
              className="cosmetic-dentistry-img"
            />
          </div>
          <div className="cosmetic-dentistry-services">
            <ul>
              <h1>Cosmetic Dentistry Services</h1>
              <li>Teeth Whitening</li>
              <li>Dental Veneers</li>
              <li>Composite Bonding</li>
              <li>Tooth-Colored Fillings</li>
              <li>Smile Makeovers</li>
              <li>Dental Crowns</li>
              <li>Gum Contouring</li>
              <li>Teeth Reshaping and Contouring</li>
              <li>Diastema (Gap) Closure</li>
              <li> Cosmetic Teeth Replacement</li>
            </ul>
          </div>
        </div>
        <div className="about-cosmetic-dentistry">
          <div className="about-cosmetic-dentistry-header">
            <h1>Cosmetic Dentistry</h1>
          </div>
          <div className="about-cosmetic-dentistry-p">
            <p>
              Cosmetic Dentistry is a branch of dentistry that focuses on
              improving the appearance of your teeth, gums, and smile. These
              treatments are designed to enhance the color, shape, size,
              alignment, and overall aesthetics of your teeth while maintaining
              good oral health and function.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default CosmeticDentistry;
