import React from "react";

const Hero = () => {
  return (
    <div>
      <main className="main">
        <section className="home section" id="home">
          <div className="home__container container grid">
            <img
              src="../img/home-sushi-rolls.png"
              alt="home image"
              className="home__img"
            />
            <div className="home__data">
              <h1 className="home__title">
                Enjoy Delicious
                <div>
                  <img src="/img/home-sushi-title.png" alt="home image" />
                  Sushi Food
                </div>
              </h1>
              <p className="home__description">
                Enjoy a good dinner with the best dishes in the restaurant and
                improve your day.
              </p>
              <a href="#" className="button">
                Order now <i className="ri-arrow-right-line"></i>
              </a>
            </div>
          </div>
          <img
            src="/img/leaf-branch-2.png"
            alt="home image"
            className="home__leaf-1"
          />
          <img
            src="/img/leaf-branch-4.png"
            alt="home image"
            className="home__leaf-2"
          />
        </section>
      </main>
    </div>
  );
};

export default Hero;
