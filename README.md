# Phantom Shield Prototype -> Actual Product

This project has been updated from a static UI prototype to an actual product structure. 
All hardcoded sample data has been removed, and the frontend is now wired up to a Node.js Express backend.

## Features Added
- **Backend API**: An Express server (\`server.js\`) has been provided. It serves as the foundation for the backend and currently uses an in-memory database.
- **Proper Authentication System**: Added a fully functional login and registration system. User passwords are hashed with \`bcrypt\`, and sessions use JWT tokens.
- **Dynamic Frontend**: The \`script.js\` has been refactored to fetch data from the backend rather than using embedded test inputs.
- **Safety Checks**: UI functions and simulations have been updated to gracefully handle empty initial states (when no devices or alerts exist yet).

## How to Run

1. **Install Dependencies**:
   Open a terminal in this directory and run:
   \`\`\`bash
   npm install
   \`\`\`

2. **Start the Backend Server**:
   \`\`\`bash
   node server.js
   \`\`\`
   The backend will run on \`http://localhost:3000\`.

3. **Open the Frontend**:
   Simply open \`index.html\` in your browser, or serve it using a local static server like Live Server or \`npx serve\`. 
   The frontend is configured to communicate with the local API at \`http://localhost:3000/api\`.

## Building Further
Since the hardcoded data is removed, the dashboard will initially be empty when you register a new user. You can add logic to populate initial devices or build an admin screen to add endpoints, threats, and recommendations. 

The API layer inside \`server.js\` provides a great starting point for you to swap out the in-memory array with MongoDB, PostgreSQL, or any other database of your choice.
