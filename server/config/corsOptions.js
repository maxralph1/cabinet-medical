import origins from './allowedOrigins.js';


const corsOptions = {
    origin: (origin, callback) => {
<<<<<<< HEAD
        if (origins.indexOf(origin) !== -1 || !origin) {
        // if (!origin || origins?.includes(origin)) {
=======
        // if (origins.indexOf(origin) !== -1 || !origin) {
        if (!origin || origins?.includes(origin)) {
>>>>>>> 2167b0382c47c97bb177e6f3f0eb7b59d6b73cae
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
