import origins from './allowedOrigins.js';


const corsOptions = {
    origin: (origin, callback) => {
        if (origins.indexOf(origin) !== -1 || !origin) {
        // if (!origin || origins?.includes(origin)) {
        // if (origins.indexOf(origin) !== -1 || !origin) {
            // console.log('true')
            callback(null, true)
        } else {
            // console.log('false')
            callback(new Error('CORS Restriction'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}; 


export default corsOptions; 
