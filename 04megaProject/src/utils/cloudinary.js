// Local server se file uthao
// Use fir cloudinary mein dalo
// Agar success to local file delete karo

import dotenv from "dotenv";
dotenv.config({
   path: "./.env"     
});

import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs' // node js file system se baat karne ke liye 



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async (localFilePath) =>{
    
    try {
        if (!localFilePath) return null

        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        // console.log(response);
    
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        console.log('error check in cloudinary',error);
        
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}


export {uploadOnCloudinary};

// cloudinary.v2.uploader.upload("local file path",
//     {public_id: 'olympic_flag'},
//     function(error,result){
//         console.log(result)
//     }
// )