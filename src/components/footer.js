import React from 'react';


const Footer = () => {
    return (
        <div>
            Made by Cheol Ho Park
            © {new Date().getFullYear()}, Built with
            {` `}
            <a href="https://www.gatsbyjs.com">Gatsby</a>
        </div>
    );
};

export default Footer;