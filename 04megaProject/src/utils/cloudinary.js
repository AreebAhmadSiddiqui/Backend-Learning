// Local server se file uthao
// Use fir cloudinary mein dalo
// Agar success to local file delete karo


import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs' // node js file system se baat karne ke liye 

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async (localFilePath) =>{
    try{
        if(!localFilePath) return null

        // upload file on cloudinary
        const response = await cloudinary.v2.uploader.upload(localFilePath,
        {resource_type:"auto"},
        function(error,result){
            console.log(result)
        })

        console.log('File uploaded on cloudinary',response.url);
        return response;
    }catch(err){
        // remove file from our local server( Unlink the locally saved temp file as the upload ope got failed)

        fs.unlinkSync(localFilePath)
        return null
    }
}


export default uploadOnCloudinary;

// cloudinary.v2.uploader.upload("local file path",
//     {public_id: 'olympic_flag'},
//     function(error,result){
//         console.log(result)
//     }
// )