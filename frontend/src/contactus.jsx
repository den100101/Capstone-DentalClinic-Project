import Footer from "./components/footer";
import "./styles/contact-us.css";

function ContactUs() {
  return (
    <>
      <div className="contact-us-container">
        <div className="contact-us-header">
          <h1>Contact Us</h1>
        </div>
        <div className="contact-details">
          <div className="contact-details-desc">
            <div className="contact-details-header">
              <h1>We're Listening</h1>
            </div>
            <div className="contact-details-p">
              <p>
                Have question about your Dental Care? Contact us today and let's
                talk.
              </p>
            </div>
          </div>
          <div className="contact-details-container">
            <div className="contacts">
              <div>
                <img
                  src="/Images/location-white.png"
                  alt="location-logo"
                  className="contact-detail-logo"
                />
              </div>
              <div className="contact-detail-p">
                <p>
                  Ledesma Bldg 11 Jordan Street, Parañaque, Philippines, 1719
                </p>
              </div>
            </div>
            <div className="contacts">
              <div>
                <img
                  src="/Images/telephone-white.png"
                  alt="telephone-logo"
                  className="contact-detail-logo"
                />
              </div>
              <div className="contact-detail-p">
                <p>(02) 828 4130</p>
              </div>
            </div>
            <div className="contacts">
              <div>
                <img
                  src="/Images/mail-white.png"
                  alt="mail-logo"
                  className="contact-detail-logo"
                />
              </div>
              <div className="contact-detail-p">
                <p>analizaborras@yahoo.com</p>
              </div>
            </div>
          </div>
        </div>
        <div className="swiss-map-container">
          <img
            src="/Images/swiss-map.jpg"
            alt="map-pic"
            className="swiss-map-img"
          />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ContactUs;
