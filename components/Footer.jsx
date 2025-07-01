import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container container grid">
        <div>
          <a href="#" className="footer__logo">
            <Image src="/img/logo.png" alt="logo image" width={40} height={40} />
            Shushi
          </a>
          <p className="footer__description">
            Food for the body is not <br />
            enough. There must be food <br />
            for the soul.
          </p>
        </div>

        <div className="footer__content">
          <h3 className="footer__title">Main Menu</h3>
          <ul className="footer__links">
            {['About', 'Menus', 'Offer', 'Events'].map((item) => (
              <li key={item}>
                <a href="#" className="footer__link">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__content">
          <h3 className="footer__title">Information</h3>
          <ul className="footer__links">
            {['Contact', 'Order & Returns', 'Videos', 'Reservation'].map((item) => (
              <li key={item}>
                <a href="#" className="footer__link">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__content">
          <h3 className="footer__title">Address</h3>
          <ul className="footer__links">
            <li className="footer__information">
              R.L.Complex, Neelbad <br />
              462044, Bhopal
            </li>
            <li className="footer__information">9AM - 11PM</li>
          </ul>
        </div>

        <div className="footer__content">
          <h3 className="footer__title">Social Media</h3>
          <ul className="footer__social">
            <a href="https://www.facebook.com/" target="_blank" className="footer__social-link" rel="noopener noreferrer">
              <i className="ri-facebook-fill"></i>
            </a>
            <a href="https://www.instagram.com/" target="_blank" className="footer__social-link" rel="noopener noreferrer">
              <i className="ri-instagram-line"></i>
            </a>
            <a href="https://www.youtube.com/" target="_blank" className="footer__social-link" rel="noopener noreferrer">
              <i className="ri-youtube-fill"></i>
            </a>
          </ul>
        </div>

        <Image src="/img/spring-onion.png" alt="footer image" width={80} height={80} className="footer__onion" />
        <Image src="/img/spinach-leaf.png" alt="footer image" width={80} height={80} className="footer__spinch" />
        <Image src="/img/leaf-branch-4.png" alt="footer image" width={80} height={80} className="footer__leaf" />
      </div>

      <div className="footer__info container">
        <div className="footer__card">
          {[1, 2, 3, 4].map((num) => (
            <Image
              key={num}
              src={`/img/footer-card-${num}.png`}
              alt={`footer card ${num}`}
              width={60}
              height={40}
            />
          ))}
        </div>
        <span className="footer__copy">
          &#169; Copyright Bedimcode. All rights reserved
        </span>
      </div>
    </footer>
  );
};

export default Footer;
