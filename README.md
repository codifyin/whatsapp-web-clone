# WhatsApp Web Clone

A web application for sending and receiving WhatsApp messages using Green API. This project is built with React and allows users to communicate through WhatsApp without using the official WhatsApp Web interface.

## Features

- Real-time messaging
- Multiple chat conversations
- Message history
- Clean and intuitive UI similar to WhatsApp Web
- Secure authentication through Green API

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (version 14 or higher)
- npm (Node Package Manager)
- Green API account (https://green-api.com/)
- Active WhatsApp account

## Installation

1. Clone the repository:

```bash
git clone https://github.com/codifyin/whatsapp-web-clone.git
cd whatsapp-web-clone
```

2. Navigate to the project directory:

```bash
cd whatsapp-web-clone
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm start
```

The application will open in your default browser at `http://localhost:5000`

## Green API Setup

1. Go to [Green API](https://green-api.com/) and create an account
2. Create a new instance in your dashboard
3. Save your `idInstance` and `apiTokenInstance`
4. Scan the QR code with your WhatsApp to connect your account

## Usage

1. Launch the application and enter your Green API credentials
   ![alt text](image.png)
2. Click "New Chat" to start a new conversation
3. Enter the recipient's phone number in international format (e.g., 77071234567)
   ![alt text](image-2.png)
4. Start sending messages!
   ![alt text](image-3.png)

## Project Structure

```
whatsapp-web-clone/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Chat.js
│   │   └── Login.js
│   ├── api.js
│   ├── App.js
│   ├── index.js
│   └── index.css
└── package.json
```

## Troubleshooting

### Common Issues

1. **Messages not sending:**

   - Verify your Green API credentials
   - Check phone number format (no '+' or special characters)
   - Ensure your internet connection is stable

2. **Authentication errors:**

   - Confirm your `idInstance` and `apiTokenInstance` are correct
   - Make sure your WhatsApp is properly connected to Green API
   - Check your instance status in Green API dashboard

3. **Messages not receiving:**
   - Verify recipient's phone number
   - Ensure recipient's WhatsApp is active
   - Check your instance status

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Amirzhan Issa
Project Link: [https://github.com/codifyin/whatsapp-web-clone]

## Acknowledgments

- [Green API](https://green-api.com/) for providing WhatsApp integration
- [React](https://reactjs.org/) for the awesome framework
- [WhatsApp Web](https://web.whatsapp.com/) for design inspiration
