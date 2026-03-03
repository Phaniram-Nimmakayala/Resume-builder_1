import { useState } from "react";
import "../styles/TemplateSlider.css";

import temp1 from "../assets/res1.png";
import temp2 from "../assets/res2.webp";
import temp3 from "../assets/res3.jpg";
import temp4 from "../assets/res4.png";

const templates = [
  { title: "Modern Resume Templates", bg: "purple", image: temp1 },
  { title: "Creative Resume Designs", bg: "red", image: temp2 },
  { title: "Professional Layouts", bg: "green", image: temp3 },
  { title: "ATS Friendly Resumes", bg: "blue", image: temp4 },
];

export default function TemplateSlider() {

  const [index, setIndex] = useState(0);

  const nextSlide = () =>
    setIndex((prev) => (prev + 1) % templates.length);

  const prevSlide = () =>
    setIndex(
      (prev - 1 + templates.length) % templates.length
    );

  return (
    <section className="template-slider-wrapper">

      <button className="arrow left" onClick={prevSlide}>❮</button>

      {/* SLIDER WINDOW */}
      <div className="slider-window">

        {/* SLIDER TRACK */}
        <div
          className="slider-track"
          style={{
            transform: `translateX(-${index * 100}%)`,
          }}
        >
          {templates.map((item, i) => (
            <div
              key={i}
              className={`template-slide ${item.bg}`}
            >
              <div className="slider-content">

                <div className="slider-text">
                  <h2>{item.title}</h2>
                  <p>
                    Choose beautifully crafted resume
                    templates designed to impress recruiters.
                  </p>
                </div>

                <div className="slider-image">
                  <img src={item.image} alt="" />
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      <button className="arrow right" onClick={nextSlide}>❯</button>

    </section>
  );
}