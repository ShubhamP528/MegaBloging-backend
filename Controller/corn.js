const Contact = require("../Models/Contact");
const sendContactEmail = require("../Config/nodemailer");

const contact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Create a new contact entry
    const contact = new Contact({ name, email, message });
    await contact.save();

    // Send an email notification
    await sendContactEmail(contact);

    res
      .status(200)
      .json({ message: "Your message has been sent successfully!" });
  } catch (error) {
    console.error("Error handling contact form:", error);
    res
      .status(500)
      .json({ message: "Failed to send your message. Please try again." });
  }
};

module.exports = {
  contact,
};
