import React from "react";

const Footer = () => {

    const footerStyle = {
        backgroundColor: "#80bd80",
        color: "#fff",
        padding: "10px",
        textAlign: "center",
        position: "fixed",
        bottom: "0",
        width: "100%"
    };

    const contentStyle = {
        maxWidth: "1200px",
        margin: "0 auto",
    };

    return (
        <footer style={footerStyle}>
            <div style={contentStyle}>
                <p>&copy; 2024 Safety Shield</p>
            </div>
        </footer>
    );
};

export default Footer;