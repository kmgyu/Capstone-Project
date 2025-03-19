import React from "react";

function DroneImage() {
  return (
    <div className="drone-image">
      <h2>노지 항공사진</h2>
      <div className="image-content">
        <img src="field-image.png" alt="노지 항공사진" />
        <div className="filter-buttons">
          <button>병</button>
          <button>충</button>
          <button>항공 사진</button>
        </div>
      </div>
    </div>
  );
}

export default DroneImage;
