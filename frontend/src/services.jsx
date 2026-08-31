import "./styles/services.css";
import ClinicService from "./components/clinicservice";
import GeneralDentistry from "./components/general-dentistry";
import OralSurgery from "./components/oral-surgery";
import Orthodontics from "./components/orthodontics";
import Footer from "./components/footer";
import { useState } from "react";
import CosmeticDentistry from "./components/cosmetic-dentistry";

function Services() {
  const [renderComponent, setRenderComponent] = useState("View");

  return (
    <>
      <div className="services-container">
        <div className="services-header">
          <div className="services-header-1">
            <h1>Our Services</h1>
          </div>
          <div className="services-header-2">
            <h1>Quality dental care for your smile with precision and care.</h1>
          </div>
          <div className="service-buttons-container">
            <div>
              <button
                onClick={() => setRenderComponent("View")}
                className={
                  renderComponent === "View"
                    ? "service-buttons active"
                    : "service-buttons"
                }
              >
                View our work
              </button>
            </div>
            <div>
              <button
                onClick={() => setRenderComponent("General")}
                className={
                  renderComponent === "General"
                    ? "service-buttons active"
                    : "service-buttons"
                }
              >
                General Dentistry
              </button>
            </div>
            <div>
              <button
                onClick={() => setRenderComponent("Oral")}
                className={
                  renderComponent === "Oral"
                    ? "service-buttons active"
                    : "service-buttons"
                }
              >
                Oral Surgery
              </button>
            </div>
            <div>
              <button
                onClick={() => setRenderComponent("Ortho")}
                className={
                  renderComponent === "Ortho"
                    ? "service-buttons active"
                    : "service-buttons"
                }
              >
                Orthodontics
              </button>
            </div>
            <div>
              <button
                onClick={() => setRenderComponent("Cosmetic")}
                className={
                  renderComponent === "Cosmetic"
                    ? "service-buttons active"
                    : "service-buttons"
                }
              >
                Cosmetic Dentistry
              </button>
            </div>
          </div>
        </div>

        <div className="services-content-container">
          {renderComponent === "View" && (
            <ClinicService setRenderComponent={setRenderComponent} />
          )}
          {renderComponent === "General" && (
            <GeneralDentistry setRenderComponent={setRenderComponent} />
          )}
          {renderComponent === "Oral" && (
            <OralSurgery setRenderComponent={setRenderComponent} />
          )}
          {renderComponent === "Ortho" && (
            <Orthodontics setRenderComponent={setRenderComponent} />
          )}
          {renderComponent === "Cosmetic" && (
            <CosmeticDentistry setRenderComponent={setRenderComponent} />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Services;
