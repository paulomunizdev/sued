# Sued

Sued is an AI designed to respond and assist in WhatsApp groups.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/paulomunizdev/sued.git
    cd sued
    ```

2. Add your OpenAI API key to the `.env` file.

3. Install NVM (Node Version Manager):
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    source ~/.bashrc
    ```

4. Remove existing Node.js and npm installations (if any):
    ```bash
    sudo apt remove nodejs npm
    ```

5. Install Node.js using NVM:
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    nvm install node
    nvm use node
    ```

6. Install dependencies:
    ```bash
    npm install
    ```

7. Start the application:
    ```bash
    npm start
    ```

8. Scan the WhatsApp QR Code displayed in the terminal to authenticate.

9. Enjoy!
  
