const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Function to safely load the responses JSON file
function loadResponses() {
    try {
        // Try to read and parse the JSON file
        const data = fs.readFileSync('responses.json', 'utf-8');
        return JSON.parse(data) || {};
    } catch (error) {
        console.error("Error reading or parsing responses.json:", error);
        // Return an empty object if file read or JSON parse fails
        return {};
    }
}

// Load predefined responses from the JSON file
let responses = loadResponses();

// Function to save updated responses to the JSON file
function saveResponses(responses) {
    fs.writeFileSync('responses.json', JSON.stringify(responses, null, 2), 'utf-8');
}

// API endpoint to handle both adding a new keyword-reply pair and chatbot responses
app.get('/', (req, res) => {
    const keyword = req.query.keyword;
    const reply = req.query.reply;
    const message = req.query.message;

    if (keyword && reply) {
        const formattedKeyword = keyword.toLowerCase().trim();
        const formattedReply = reply.trim();

        // Add the new keyword-reply pair to the responses object
        responses[formattedKeyword] = formattedReply;

        // Save updated responses back to the JSON file
        saveResponses(responses);

        return res.json({
            status: 'success',
            message: 'New teach added successfully✅'
        });
    } else if (message) {
        const formattedMessage = message.toLowerCase().trim();
        let responseText = "Sorry, I don't understand that."; // Default response

        // Check if the message contains any predefined keywords
        for (const [keyword, response] of Object.entries(responses)) {
            if (formattedMessage.includes(keyword)) {
                responseText = response;
                break;
            }
        }

        return res.json({
            status: 'success',
            response: responseText
        });
    } else {
        return res.json({
            status: 'error',
            message: 'No message or keyword/reply provided.'
        });
    }
});

// Handle invalid methods
app.use((req, res) => {
    return res.json({
        status: 'error',
        message: 'Invalid request method. Please use GET.'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(Server running on port ${PORT});
});
