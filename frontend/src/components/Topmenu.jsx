import React from "react";
import registro from "../icons/edit.png";
import listar from "../icons/checklist.png";

export default function Topmenu({}) {
  return (
      <div className="navigation">
        <ul>
          <li className="listActive">
            <a href="#">
              <span class="icon"><img src={registro} alt="registro" className="icon-btn" /></span>
            </a>

          </li>
          <li className="listActive">
            <a href="#">
              <span class="icon"><img src={listar} alt="registro" className="icon-btn" /></span>
            </a>
          </li>
          <div className="indicator"><span></span></div>
        </ul>
      </div>

    
  );
}
