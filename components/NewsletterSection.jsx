import Image from "next/image";

const NewsletterSection = () => {
  return (
    <section className="newsletter section">
      <div className="newsletter__container container">
        <div className="newsletter__content grid">
          <Image
            src="/img/newsletter-sushi.png"
            alt="newsletter image"
            width={300}
            height={300}
            className="newsletter__img"
          />

          <div className="newsletter__data">
            <span className="section__subtitle">Newsletter</span>
            <h2 className="section__title">
              Subscribe For <br />
              Offer Updates
            </h2>

            <form action="" className="newsletter__form">
              <input
                type="email"
                placeholder="Enter email"
                className="newsletter__input"
              />
              <button className="button newsletter__button" type="submit">
                Subscribe <i className="ri-send-plane-line"></i>
              </button>
            </form>
          </div>
        </div>

        <Image
          src="/img/spinach-leaf.png"
          alt="newsletter leaf"
          width={100}
          height={100}
          className="newsletter__spinach"
        />
      </div>
    </section>
  );
};

export default NewsletterSection;
