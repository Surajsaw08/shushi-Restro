import React from "react";
import Image from "next/image";

const AboutSection = () => {
  return (
    <div>
      <section className="about section" id="about">
        <div className="about__container container grid">
          <div className="about__data">
            <span className="section__subtitle">About Us</span>
            <h2 className="section__title about__title">
              <div>
                We Provide
                <Image
                  src="/img/about-sushi-title.png"
                  alt=""
                  width={50}
                  height={20}
                />
              </div>
              Healthy Food
            </h2>
            <p className="about__description">
              Food comes to us from our relatives, whether they have wings or
              roots. This is how we consider food, it also has a culture. It has
              a history that passes from generation to generation.
            </p>
          </div>

          <Image
            src="/img/about-sushi.png"
            alt="about image"
            width={400}
            height={400}
            className="about__img"
          />
        </div>

        <Image
          src="/img/leaf-branch-1.png"
          alt="about leaf"
          width={100}
          height={100}
          className="about__leaf"
        />
      </section>
    </div>
  );
};

export default AboutSection;
