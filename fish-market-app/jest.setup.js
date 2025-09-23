import '@testing-library/jest-dom'

// Use require for node-fetch to avoid ES module issues
const fetch = require('node-fetch')
global.fetch = fetch
