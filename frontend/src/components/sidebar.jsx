import React, { useState } from "react";
import { sidebarData } from "./sidebarData";

function Sidebar() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div>
      <button onClick={toggleSidebar}>
        {isSidebarVisible ? "Hide Menu" : "Show Menu"}
      </button>

      {isSidebarVisible && (
        <div className="Sidebar">
          <ul className="SidebarList">
            {sidebarData.map((val, key) => {
              return (
                <li
                  key={key}
                  className="row"
                  onClick={() => {
                    window.location.pathname = val.link;
                  }}
                >
                  <div id="title"> {val.title} </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
